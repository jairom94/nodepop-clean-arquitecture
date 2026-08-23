export interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T, B>(url: string, body: B): Promise<T>;
}