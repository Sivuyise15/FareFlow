import type { DashboardSummary, ImportResult, Trip } from './types';

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockDashboard(): Promise<DashboardSummary> {
  await wait();
  return {
    monthTotal: 4250.8,
    providers: ['Uber', 'Bolt', 'inDrive'],
    budget: { limit: 6000, spent: 4250 },
    thisWeek: 840,
    averageTrip: 125,
    topProvider: 'Uber',
    trend: [120, 90, 0, 210, 150, 80, 300, 260, 140, 0, 190, 330, 280, 410, 360, 300],
  };
}

export async function mockTrips(): Promise<Trip[]> {
  await wait();
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
  return [
    { id: '1', provider: 'Uber', amount: 142.5, occurredAt: hoursAgo(3), pickup: 'Green Point', dropoff: 'Century City' },
    { id: '2', provider: 'Bolt', amount: 88, occurredAt: hoursAgo(20), pickup: 'Woodstock', dropoff: 'Sea Point' },
    { id: '3', provider: 'Uber', amount: 210.9, occurredAt: hoursAgo(31), pickup: 'CBD', dropoff: 'Claremont' },
    { id: '4', provider: 'inDrive', amount: 96, occurredAt: hoursAgo(52) },
    { id: '5', provider: 'Uber', amount: 133.4, occurredAt: hoursAgo(75), pickup: 'Observatory', dropoff: 'V&A Waterfront' },
    { id: '6', provider: 'Bolt', amount: 74.2, occurredAt: hoursAgo(99) },
    { id: '7', provider: 'Uber', amount: 189, occurredAt: hoursAgo(122), pickup: 'Camps Bay', dropoff: 'Gardens' },
    { id: '8', provider: 'inDrive', amount: 110, occurredAt: hoursAgo(150) },
  ];
}

export async function mockImport(): Promise<ImportResult> {
  await wait(900);
  return { imported: 3 };
}
