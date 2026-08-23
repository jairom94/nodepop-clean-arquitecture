import { LoginService } from "@/application/auth/LoginService";
import { axiosClient } from "@/infrastructure/http/axiosClient";
import { AxiosHttpClient } from "@/infrastructure/http/AxiosHttpClient";

export const httpClient = new AxiosHttpClient(axiosClient);
export const loginService = new LoginService(httpClient);