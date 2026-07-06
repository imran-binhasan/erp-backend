import mongoose from 'mongoose';
import Sale from './sale.model';
import Product from '../product/product.model';
import Customer from '../customer/customer.model';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { queryBuilder, type ListQueryParams } from '../../shared/utils/queryBuilder';
import { getIO } from '../../core/socket/socket.server';

type SaleItemInput = { product: string; quantity: number };
type ProductLike = {
  _id: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  sellingPrice: number;
  stock: number;
};

export const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

export const calculateGrandTotal = (items: { subtotal: number }[]): number =>
  roundToTwo(items.reduce((sum, item) => sum + item.subtotal, 0));

export const buildSaleItems = (
  items: SaleItemInput[],
  products: ProductLike[]
): {
  product: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}[] => {
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  return items.map((item) => {
    const product = productMap.get(item.product);
    if (!product) {
      throw new NotFoundError(`Product not found: ${item.product}`);
    }

    return {
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
      subtotal: roundToTwo(item.quantity * product.sellingPrice),
    };
  });
};

export const createSale = async (
  data: {
    customer: string;
    items: SaleItemInput[];
  },
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customer = await Customer.findById(data.customer).session(session);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const productIds = [...new Set(data.items.map((item) => item.product))];
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session
    );

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundError(`Products not found: ${missingIds.join(', ')}`);
    }

    const saleItems = buildSaleItems(data.items, products);

    for (const item of data.items) {
      const product = products.find((p) => p._id.toString() === item.product);
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.product}`);
      }

      const stockUpdate = await Product.updateOne(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );

      if (stockUpdate.matchedCount === 0) {
        throw new BadRequestError(
          `Insufficient stock for ${product.name} (SKU: ${product.sku}) - available: ${product.stock}, requested: ${item.quantity}`
        );
      }
    }

    const grandTotal = calculateGrandTotal(saleItems);

    const [sale] = await Sale.create(
      [
        {
          customer: data.customer,
          items: saleItems,
          grandTotal,
          createdBy: userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const updatedProducts = await Product.find({ _id: { $in: productIds } });
    const lowStockProducts = updatedProducts.filter((p) => p.stock < 5);

    try {
      const io = getIO();
      if (lowStockProducts.length > 0) {
        io.emit('low-stock-alert', lowStockProducts);
      }
      io.emit('stock-updated', updatedProducts);
    } catch (error) {
      console.warn('Socket notification skipped:', error);
    }

    return Sale.populate(sale, [
      { path: 'customer' },
      { path: 'createdBy' },
    ]);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getSaleById = async (id: string) => {
  const sale = await Sale.findById(id);
  if (!sale) throw new NotFoundError('Sale not found');
  return Sale.populate(sale, [
    { path: 'customer', select: 'name email phone' },
    { path: 'createdBy', select: 'name email' },
  ]);
};

export const listSales = async (params: ListQueryParams) => {
  const filters: Record<string, unknown> = {};

  if (params.dateFrom || params.dateTo) {
    filters.createdAt = {
      ...(params.dateFrom ? { $gte: new Date(params.dateFrom) } : {}),
      ...(params.dateTo ? { $lte: new Date(`${params.dateTo}T23:59:59.999Z`) } : {}),
    };
  }

  const result = await queryBuilder(Sale, {
    ...params,
    searchFields: ['items.productName'],
    filters,
  });

  const populated = await Sale.populate(result.data, [
    { path: 'customer', select: 'name email phone' },
    { path: 'createdBy', select: 'name email' },
  ]);

  return { ...result, data: populated };
};
