import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../src/modules/role/role.model';
import User from '../src/modules/user/user.model';
import Customer from '../src/modules/customer/customer.model';
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

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const existingRoles = await Role.countDocuments();
  if (existingRoles > 0) {
    console.log('Roles already exist, purging and re-seeding...');
    await Role.deleteMany({});
    await User.deleteMany({});
  }

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

  const adminPassword = await hashPassword('admin123');
  const managerPassword = await hashPassword('manager123');
  const employeePassword = await hashPassword('employee123');

  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: adminPassword,
    role: adminRole._id,
  });

  const managerUser = await User.create({
    name: 'Manager User',
    email: 'manager@example.com',
    password: managerPassword,
    role: managerRole._id,
  });

  const employeeUser = await User.create({
    name: 'Employee User',
    email: 'employee@example.com',
    password: employeePassword,
    role: employeeRole._id,
  });

  console.log('Users created:', [
    adminUser.email,
    managerUser.email,
    employeeUser.email,
  ]);

  const sampleCustomers = await Customer.insertMany([
    { name: 'John Doe', email: 'john@example.com', phone: '01711111111' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '01722222222' },
    { name: 'Bob Wilson', email: 'bob@example.com', phone: '01733333333' },
  ]);

  console.log(`Sample customers created: ${sampleCustomers.length}`);

  console.log('\n--- Login Credentials ---');
  console.log('Admin:    admin@example.com / admin123');
  console.log('Manager:  manager@example.com / manager123');
  console.log('Employee: employee@example.com / employee123');
  console.log('-------------------------\n');

  await mongoose.disconnect();
  console.log('Seed completed successfully');
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
