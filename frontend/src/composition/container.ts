import { LoginService } from "@/application/auth/LoginService";
import { RegisterService } from "@/application/auth/RegisterService";
import { axiosClient } from "@/infrastructure/http/axiosClient";
import { AxiosHttpClient } from "@/infrastructure/http/AxiosHttpClient";
import { LocalStorageTokenStorage } from "@/infrastructure/storage/LocalStorageTokenStorage";

export const tokenStorage = new LocalStorageTokenStorage();
export const httpClient = new AxiosHttpClient(axiosClient, tokenStorage);
export const loginService = new LoginService(httpClient, tokenStorage);
export const registerService = new RegisterService(httpClient);