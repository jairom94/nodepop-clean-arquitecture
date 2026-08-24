export interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T, B>(url: string, body: B): Promise<T>;
  postFormData<T>(url: string, data: FormData): Promise<T>;
  patch<T, B>(url: string, body: B): Promise<T>;
  delete(url: string): Promise<void>;
}
