import { LoginService } from "@/application/auth/LoginService";
import { RegisterService } from "@/application/auth/RegisterService";
import {
  CreateProductService,
} from "@/application/products/CreateProductService";
import { GetProductService } from "@/application/products/GetProductService";
import { ListMyProductsService } from "@/application/products/ListMyProductsService";
import { ListProductsService } from "@/application/products/ListProductsService";
import { ListTagsService } from "@/application/tags/ListTagsService";
import { axiosClient } from "@/infrastructure/http/axiosClient";
import { AxiosHttpClient } from "@/infrastructure/http/AxiosHttpClient";
import { LocalStorageTokenStorage } from "@/infrastructure/storage/LocalStorageTokenStorage";

export const tokenStorage = new LocalStorageTokenStorage();
export const httpClient = new AxiosHttpClient(axiosClient, tokenStorage);
export const loginService = new LoginService(httpClient, tokenStorage);
export const registerService = new RegisterService(httpClient);
export const listProductsService = new ListProductsService(httpClient);
export const getProductService = new GetProductService(httpClient);
export const listMyProductsService = new ListMyProductsService(httpClient);
export const createProductService = new CreateProductService(httpClient);
export const listTagsService = new ListTagsService(httpClient);
