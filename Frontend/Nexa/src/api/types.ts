export type Session = {
  accessToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    provider: 'google';
  };
};

export type GoogleOAuthCompleteRequest = {
  code: string;
  state: string;
};

export type GoogleConnectionStatus = {
  connected: boolean;
  emailAddress: string | null;
};

export type DashboardSummary = {
  monthTotal: number;
  providers: string[];
  trend: number[];
  budget: {
    limit: number;
    spent: number;
  };
  thisWeek: number;
  averageTrip: number;
  topProvider: string | null;
};

export type ImportResult = {
  imported: number;
};

export type Trip = {
  id: string;
  provider: string;
  amount: number;
  occurredAt: string;
  pickup?: string;
  dropoff?: string;
};