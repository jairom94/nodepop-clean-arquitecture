export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: {
    id: number | null;
    name: string;
    lastname1: string;
    email: string;
  };
}
