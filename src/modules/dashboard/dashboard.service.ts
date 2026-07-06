import Product from '../product/product.model';
import Customer from '../customer/customer.model';
import Sale from '../sale/sale.model';

interface SalesTrendPoint {
  date: string;
  revenue: number;
  count: number;
}

function buildSalesTrend(
  raw: { _id: string; revenue: number; count: number }[]
): SalesTrendPoint[] {
  const byDate = new Map(raw.map((entry) => [entry._id, entry]));
  const trend: SalesTrendPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setUTCHours(0, 0, 0, 0);
    day.setUTCDate(day.getUTCDate() - i);
    const key = day.toISOString().slice(0, 10);
    const entry = byDate.get(key);
    trend.push({
      date: key,
      revenue: entry?.revenue ?? 0,
      count: entry?.count ?? 0,
    });
  }

  return trend;
}

export const getDashboardStats = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

  const [
    totalProducts,
    totalCustomers,
    totalSales,
    lowStockProducts,
    recentSales,
    revenueResult,
    salesByDay,
  ] = await Promise.all([
    Product.countDocuments({ deletedAt: null }),
    Customer.countDocuments({ deletedAt: null }),
    Sale.countDocuments(),
    Product.find({ stock: { $lt: 5 }, deletedAt: null })
      .select('name sku stock category')
      .sort({ stock: 1 })
      .lean(),
    Sale.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(6)
      .select('customer grandTotal items createdAt')
      .lean(),
    Sale.aggregate<{ total: number }>([
      { $group: { _id: null, total: { $sum: '$grandTotal' } } },
    ]),
    Sale.aggregate<{ _id: string; revenue: number; count: number }>([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const salesTrend = buildSalesTrend(salesByDay);
  const weekRevenue = salesTrend.reduce((sum, day) => sum + day.revenue, 0);
  const weekSales = salesTrend.reduce((sum, day) => sum + day.count, 0);

  return {
    totalProducts,
    totalCustomers,
    totalSales,
    totalRevenue: revenueResult[0]?.total ?? 0,
    weekRevenue,
    weekSales,
    salesTrend,
    recentSales,
    lowStockProducts,
  };
};
