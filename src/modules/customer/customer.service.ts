import Customer from './customer.model';
import { NotFoundError } from '../../shared/errors/AppError';
import { queryBuilder, type ListQueryParams } from '../../shared/utils/queryBuilder';

export const createCustomer = async (data: {
  name: string;
  email?: string;
  phone?: string;
}) => {
  return Customer.create(data);
};

export const listCustomers = async (params: ListQueryParams) => {
  return queryBuilder(Customer, {
    ...params,
    searchFields: ['name', 'email', 'phone'],
  }, { deletedAt: null });
};

export const getCustomerById = async (id: string) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new NotFoundError('Customer not found');
  return customer;
};

export const updateCustomer = async (
  id: string,
  data: { name?: string; email?: string; phone?: string }
) => {
  const customer = await Customer.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
  if (!customer) throw new NotFoundError('Customer not found');
  return customer;
};

export const deleteCustomer = async (id: string) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new NotFoundError('Customer not found');

  customer.deletedAt = new Date();
  await customer.save();

  return customer;
};
