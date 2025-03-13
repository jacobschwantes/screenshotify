import { User } from "firebase/auth";

export type ApiKey = {
  locked: boolean;
  name: string;
  quota: number;
  quota_limit: string;
  userid: string;
  key: string;
  usage: number;
};

export type Preferences = {
  email: {
    billing: boolean;
    marketing: boolean;
    transactional: boolean;
  };
  theme: "dark" | "light" | "system";
};

export type UserConfig = {
  usage: number;
  chartData?: {
    usage30day?: { x: string; y: number }[];
    usage7day?: { x: string; y: number }[];
  };
  errorCount: number;
  lastAggregation: number;
  plan: string;
  preferences: Preferences;
};

export type PageProps = {
  user: User;
  idToken: string;
  preferences: Preferences;
};
