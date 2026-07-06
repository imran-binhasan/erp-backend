import Product from './product.model';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
} from '../../shared/errors/AppError';
import { queryBuilder, type ListQueryParams } from '../../shared/utils/queryBuilder';
import { uploadToCloudinary, deleteFromCloudinary } from '../../shared/utils/cloudinary.util';

export const createProduct = async (
  data: {
    name: string;
    sku: string;
    category: string;
    purchasePrice: number;
    sellingPrice: number;
    stock: number;
    imageUrl?: string;
    imagePublicId?: string;
  },
  file?: Express.Multer.File
) => {
  if (!file) {
    throw new BadRequestError('Product image is required');
  }

  const existing = await Product.findOne({ sku: data.sku });
  if (existing) {
    throw new ConflictError(`Product with SKU "${data.sku}" already exists`);
  }

  const { url, publicId } = await uploadToCloudinary(file.buffer, 'products');

  return Product.create({
    ...data,
    imageUrl: url,
    imagePublicId: publicId,
  });
};

export const listProducts = async (params: ListQueryParams) => {
  const filters: Record<string, unknown> = {};

  if (params.category) {
    filters.category = { $regex: params.category, $options: 'i' };
  }

  if (params.stockStatus === 'outOfStock') {
    filters.stock = 0;
  }

  if (params.stockStatus === 'lowStock') {
    filters.stock = { $gt: 0, $lt: 5 };
  }

  if (params.stockStatus === 'inStock') {
    filters.stock = { $gte: 5 };
  }

  return queryBuilder(Product, {
    ...params,
    searchFields: ['name', 'sku', 'category'],
    filters,
  }, { deletedAt: null });
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError('Product not found');
  return product;
};

export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    sku?: string;
    category?: string;
    purchasePrice?: number;
    sellingPrice?: number;
    stock?: number;
    imageUrl?: string;
    imagePublicId?: string;
  },
  file?: Express.Multer.File
) => {
  if (data.sku) {
    const existing = await Product.findOne({ sku: data.sku, _id: { $ne: id } });
    if (existing) {
      throw new ConflictError(`SKU "${data.sku}" is already in use`);
    }
  }

  const product = await Product.findById(id);
  if (!product) throw new NotFoundError('Product not found');

  const updateData: Partial<typeof data> = { ...data };

  if (file) {
    const { url, publicId } = await uploadToCloudinary(file.buffer, 'products');
    updateData.imageUrl = url;
    updateData.imagePublicId = publicId;
  }

  const updated = await Product.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new NotFoundError('Product not found');

  if (file && product.imagePublicId) {
    deleteFromCloudinary(product.imagePublicId).catch((error: unknown) => {
      console.warn('Failed to delete replaced product image:', error);
    });
  }

  return updated;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError('Product not found');

  product.deletedAt = new Date();
  await product.save();

  return product;
};
