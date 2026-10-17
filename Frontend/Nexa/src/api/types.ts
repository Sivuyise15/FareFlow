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
