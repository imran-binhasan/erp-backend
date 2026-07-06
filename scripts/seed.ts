import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../src/modules/role/role.model';
import User from '../src/modules/user/user.model';
import Customer from '../src/modules/customer/customer.model';
import Product from '../src/modules/product/product.model';
import Sale from '../src/modules/sale/sale.model';
import { hashPassword } from '../src/shared/utils/password.util';
import {
  DEFAULT_ROLES,
  ROLE_PERMISSIONS,
} from '../src/shared/constants/permissions';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

const pic = (slug: string) => `https://picsum.photos/seed/${slug}/400/400`;

const bangladeshiCustomers = [
  { name: 'Md. Kamal Hossain',      email: 'kamal@gmail.com',      phone: '01712345678' },
  { name: 'Farzana Akhter',         email: 'farzana@yahoo.com',    phone: '01723456789' },
  { name: 'Md. Rafiqul Islam',      email: 'rafiqul@outlook.com',  phone: '01734567890' },
  { name: 'Sharmin Sultana',        email: 'sharmin@gmail.com',    phone: '01745678901' },
  { name: 'Md. Jahangir Alam',      email: 'jahangir@gmail.com',   phone: '01756789012' },
  { name: 'Nasrin Begum',           email: 'nasrin@yahoo.com',     phone: '01767890123' },
  { name: 'Md. Shahidul Islam',     email: 'shahidul@gmail.com',   phone: '01778901234' },
  { name: 'Tahmina Yasmin',         email: 'tahmina@outlook.com',  phone: '01789012345' },
  { name: 'Md. Mizanur Rahman',     email: 'mizanur@gmail.com',    phone: '01790123456' },
  { name: 'Ayesha Khatun',          email: 'ayesha@yahoo.com',     phone: '01812345678' },
  { name: 'Md. Abdur Rahim',        email: 'abdur.rahim@gmail.com', phone: '01823456789' },
  { name: 'Parvin Sultana',         email: 'parvin@gmail.com',     phone: '01834567890' },
];

const bangladeshiProducts = [
  { name: 'Basmati Rice (1kg)',     sku: 'GRO-RICE-001', category: 'Groceries', purchasePrice: 120, sellingPrice: 145, stock: 200, imageUrl: pic('basmati-rice') },
  { name: 'Miniket Rice (1kg)',     sku: 'GRO-RICE-002', category: 'Groceries', purchasePrice: 85,  sellingPrice: 105, stock: 180, imageUrl: pic('miniket-rice') },
  { name: 'Soybean Oil (5L)',       sku: 'GRO-OIL-001',  category: 'Groceries', purchasePrice: 620, sellingPrice: 720, stock: 80,  imageUrl: pic('soybean-oil') },
  { name: 'Mustard Oil (1L)',       sku: 'GRO-OIL-002',  category: 'Groceries', purchasePrice: 180, sellingPrice: 220, stock: 60,  imageUrl: pic('mustard-oil') },
  { name: 'Wheat Flour (2kg)',      sku: 'GRO-FLOUR-001', category: 'Groceries', purchasePrice: 75, sellingPrice: 95, stock: 150, imageUrl: pic('wheat-flour') },
  { name: 'Sugar (1kg)',            sku: 'GRO-SUGAR-001', category: 'Groceries', purchasePrice: 110, sellingPrice: 135, stock: 120, imageUrl: pic('sugar') },
  { name: 'Salt (1kg)',             sku: 'GRO-SALT-001', category: 'Groceries', purchasePrice: 25,  sellingPrice: 35,  stock: 250, imageUrl: pic('salt') },
  { name: 'Red Lentil (Dal, 1kg)',  sku: 'GRO-DAL-001', category: 'Groceries', purchasePrice: 95,  sellingPrice: 120, stock: 100, imageUrl: pic('red-lentil') },
  { name: 'Farm Eggs (dozen)',      sku: 'DAIRY-EGG-001', category: 'Dairy & Eggs', purchasePrice: 110, sellingPrice: 140, stock: 90,  imageUrl: pic('farm-eggs') },
  { name: 'Fresh Cow Milk (1L)',    sku: 'DAIRY-MLK-001', category: 'Dairy & Eggs', purchasePrice: 70,  sellingPrice: 90,  stock: 70,  imageUrl: pic('cow-milk') },
  { name: 'Broiler Chicken (1kg)',  sku: 'MEAT-CHK-001', category: 'Meat & Fish', purchasePrice: 200, sellingPrice: 250, stock: 50,  imageUrl: pic('broiler-chicken') },
  { name: 'Local Beef (1kg)',       sku: 'MEAT-BEF-001', category: 'Meat & Fish', purchasePrice: 480, sellingPrice: 590, stock: 40,  imageUrl: pic('beef-meat') },
  { name: 'Rui Fish (1kg)',         sku: 'FISH-RUI-001', category: 'Meat & Fish', purchasePrice: 280, sellingPrice: 350, stock: 35,  imageUrl: pic('rui-fish') },
  { name: 'Hilsa Fish (1kg)',       sku: 'FISH-HIL-001', category: 'Meat & Fish', purchasePrice: 900, sellingPrice: 1200, stock: 15, imageUrl: pic('hilsa-fish') },
  { name: 'Onion (1kg)',            sku: 'VEG-ONI-001',  category: 'Vegetables', purchasePrice: 40,  sellingPrice: 60,  stock: 200, imageUrl: pic('onion') },
  { name: 'Potato (1kg)',           sku: 'VEG-POT-001',  category: 'Vegetables', purchasePrice: 20,  sellingPrice: 30,  stock: 300, imageUrl: pic('potato') },
  { name: 'Green Chili (100g)',     sku: 'VEG-CHL-001',  category: 'Vegetables', purchasePrice: 15,  sellingPrice: 25,  stock: 120, imageUrl: pic('green-chili') },
  { name: 'Turmeric Powder (100g)', sku: 'SPC-TUR-001',  category: 'Spices',    purchasePrice: 40,  sellingPrice: 55,  stock: 100, imageUrl: pic('turmeric-powder') },
  { name: 'Chili Powder (100g)',    sku: 'SPC-CHL-001',  category: 'Spices',    purchasePrice: 50,  sellingPrice: 70,  stock: 90,  imageUrl: pic('chili-powder') },
  { name: 'Cumin Seeds (100g)',     sku: 'SPC-CUM-001',  category: 'Spices',    purchasePrice: 60,  sellingPrice: 80,  stock: 85,  imageUrl: pic('cumin-seeds') },
  { name: 'Biscuits (200g)',        sku: 'SNK-BSC-001',  category: 'Snacks',    purchasePrice: 35,  sellingPrice: 50,  stock: 160, imageUrl: pic('biscuits') },
  { name: 'Instant Noodles',        sku: 'SNK-NDL-001',  category: 'Snacks',    purchasePrice: 18,  sellingPrice: 25,  stock: 200, imageUrl: pic('instant-noodles') },
  { name: 'Mineral Water (2L)',     sku: 'BEV-WTR-001',  category: 'Beverages', purchasePrice: 18,  sellingPrice: 25,  stock: 240, imageUrl: pic('mineral-water') },
  { name: 'Mango Juice (1L)',       sku: 'BEV-JUC-001',  category: 'Beverages', purchasePrice: 65,  sellingPrice: 90,  stock: 70,  imageUrl: pic('mango-juice') },
  { name: 'Toothpaste (100g)',      sku: 'HPC-TPT-001',  category: 'Personal Care', purchasePrice: 85, sellingPrice: 110, stock: 100, imageUrl: pic('toothpaste') },
  { name: 'Bath Soap',              sku: 'HPC-SOP-001',  category: 'Personal Care', purchasePrice: 40, sellingPrice: 55,  stock: 130, imageUrl: pic('bath-soap') },
  { name: 'LED Bulb (12W)',         sku: 'ELC-BLB-001',  category: 'Electronics', purchasePrice: 130, sellingPrice: 180, stock: 60,  imageUrl: pic('led-bulb') },
  { name: 'USB Cable (Type-C)',     sku: 'ELC-USB-001',  category: 'Electronics', purchasePrice: 90,  sellingPrice: 150, stock: 45,  imageUrl: pic('usb-cable') },
  { name: 'Notebook (80 Pages)',    sku: 'STN-NTB-001',  category: 'Stationery', purchasePrice: 25,  sellingPrice: 40,  stock: 200, imageUrl: pic('notebook') },
  { name: 'Ballpoint Pen (10pc)',   sku: 'STN-PEN-001',  category: 'Stationery', purchasePrice: 30,  sellingPrice: 50,  stock: 180, imageUrl: pic('ballpoint-pen') },
];

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const existingRoles = await Role.countDocuments();
  if (existingRoles > 0) {
    console.log('Existing data found, purging and re-seeding...');
    await Role.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Sale.deleteMany({});
  }

  // --- Roles ---
  const adminRole = await Role.create({
    name: DEFAULT_ROLES.ADMIN,
    permissions: ['*'],
  });

  const managerRole = await Role.create({
    name: DEFAULT_ROLES.MANAGER,
    permissions: ROLE_PERMISSIONS[DEFAULT_ROLES.MANAGER],
  });

  const employeeRole = await Role.create({
    name: DEFAULT_ROLES.EMPLOYEE,
    permissions: ROLE_PERMISSIONS[DEFAULT_ROLES.EMPLOYEE],
  });
  console.log('Roles created:', [adminRole.name, managerRole.name, employeeRole.name]);

  // --- Users ---
  const userRoleMap: Record<string, typeof adminRole> = {
    'admin@example.com': adminRole,
    'manager@example.com': managerRole,
    'employee@example.com': employeeRole,
  };

  const userEntries = [
    { name: 'Admin User',       email: 'admin@example.com',    password: 'admin123' },
    { name: 'Md. Shariful Islam', email: 'manager@example.com', password: 'manager123' },
    { name: 'Rokeya Begum',     email: 'employee@example.com', password: 'employee123' },
  ];

  for (const u of userEntries) {
    const hashed = await hashPassword(u.password);
    await User.create({ name: u.name, email: u.email, password: hashed, role: userRoleMap[u.email]._id });
  }
  console.log('Users created:', userEntries.map((u) => u.email));

  // --- Customers ---
  const customers = await Customer.insertMany(bangladeshiCustomers);
  console.log(`Customers created: ${customers.length}`);

  // --- Products ---
  const products = await Product.insertMany(
    bangladeshiProducts.map((p) => ({ ...p, imagePublicId: p.sku.toLowerCase() }))
  );
  console.log(`Products created: ${products.length}`);

  // --- Sample Sales (last 7 days) ---
  const employeeUser = await User.findOne({ email: 'employee@example.com' });
  const now = new Date();
  const saleDocs: {
    customer: mongoose.Types.ObjectId;
    items: { product: mongoose.Types.ObjectId; productName: string; quantity: number; unitPrice: number; subtotal: number }[];
    grandTotal: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }[] = [];

  for (let day = 6; day >= 0; day--) {
    const salesToday = Math.floor(Math.random() * 3) + 2;
    for (let s = 0; s < salesToday; s++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const itemsCount = Math.floor(Math.random() * 4) + 1;
      const shuffled = [...products].sort(() => Math.random() - 0.5);

      const items = shuffled.slice(0, itemsCount).map((p) => {
        const qty = Math.floor(Math.random() * 5) + 1;
        return {
          product: p._id,
          productName: p.name,
          quantity: qty,
          unitPrice: p.sellingPrice,
          subtotal: Math.round(qty * p.sellingPrice * 100) / 100,
        };
      });

      const grandTotal = Math.round(items.reduce((sum, i) => sum + i.subtotal, 0) * 100) / 100;
      const hour = 8 + Math.floor(Math.random() * 13);
      const minute = Math.floor(Math.random() * 60);
      const sec = Math.floor(Math.random() * 60);
      const saleDate = new Date(now);
      saleDate.setDate(saleDate.getDate() - day);
      saleDate.setHours(hour, minute, sec, 0);

      saleDocs.push({
        customer: customer._id,
        items,
        grandTotal,
        createdBy: employeeUser!._id,
        createdAt: saleDate,
        updatedAt: saleDate,
      });
    }
  }

  const sales = await Sale.insertMany(saleDocs);
  console.log(`Sales created: ${sales.length} (spanning last 7 days)`);

  console.log('\n========================================');
  console.log('  Seed Completed Successfully');
  console.log('========================================');
  console.log('  Login Credentials:');
  console.log('  Admin:    admin@example.com / admin123');
  console.log('  Manager:  manager@example.com / manager123');
  console.log('  Employee: employee@example.com / employee123');
  console.log('========================================\n');

  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
