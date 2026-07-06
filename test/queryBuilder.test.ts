import test from 'node:test';
import assert from 'node:assert/strict';
import { queryBuilder } from '../src/shared/utils/queryBuilder';

test('builds text-search query with pagination', async () => {
  let capturedFilter: Record<string, unknown> | undefined;

  const model = {
    find(filter: Record<string, unknown>) {
      capturedFilter = filter;
      return {
        sort() {
          return this;
        },
        skip() {
          return this;
        },
        limit() {
          return this;
        },
        lean() {
          return Promise.resolve([{ id: 1 }]);
        },
      };
    },
    countDocuments(filter: Record<string, unknown>) {
      capturedFilter = filter;
      return Promise.resolve(1);
    },
  };

  const result = await queryBuilder(
    model as never,
    {
      search: 'shoe',
      searchFields: ['name', 'category'],
      page: 2,
      limit: 5,
      sort: '-createdAt',
      useTextSearch: true,
    },
    { deletedAt: null }
  );

  assert.equal(result.meta.page, 2);
  assert.equal(result.meta.limit, 5);
  assert.equal(result.meta.total, 1);
  assert.equal(result.meta.totalPages, 1);
  assert.deepEqual(result.data, [{ id: 1 }]);
  assert.deepEqual(capturedFilter, {
    deletedAt: null,
    $text: { $search: 'shoe' },
  });
});
