import { USE_MOCKS } from '@/constants/config';
import { request } from '../client';
import { mockImport } from '../mock';
import type { ImportResult } from '../types';

/** Ask the backend to scan the connected mailbox for new receipts. */
export function importReceipts(): Promise<ImportResult> {
  if (USE_MOCKS) return mockImport();
  return request<ImportResult>('/api/receipts/import', { method: 'POST' });
}
