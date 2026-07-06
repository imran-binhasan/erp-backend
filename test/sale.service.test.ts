import test from 'node:test';
import assert from 'node:assert/strict';
import type mongoose from 'mongoose';
import {
  buildSaleItems,
  calculateGrandTotal,
  roundToTwo,
} from '../src/modules/sale/sale.service';

test('rounds to 2 decimals', () => {
  assert.equal(roundToTwo(10.005), 10.01);
  assert.equal(roundToTwo(10.004), 10);
});

test('calculates grand total from subtotals', () => {
  assert.equal(
    calculateGrandTotal([{ subtotal: 10.1 }, { subtotal: 5.255 }]),
    15.36
  );
});

test('builds sale items with snapshots', () => {
  const productId = { toString: () => 'p1' } as mongoose.Types.ObjectId;
  const items = buildSaleItems(
    [{ product: 'p1', quantity: 2 }],
    [
      {
        _id: productId,
        name: 'Widget',
        sku: 'SKU-1',
        sellingPrice: 12.5,
        stock: 7,
      } as {
        _id: mongoose.Types.ObjectId;
        name: string;
        sku: string;
        sellingPrice: number;
        stock: number;
      },
    ]
  );

  assert.deepEqual(items, [
    {
      product: productId,
      productName: 'Widget',
      quantity: 2,
      unitPrice: 12.5,
      subtotal: 25,
    },
  ]);
});
