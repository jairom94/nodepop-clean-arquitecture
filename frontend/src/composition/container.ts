import { axiosClient } from "@/infrastructure/http/axiosClient";
import { AxiosHttpClient } from "@/infrastructure/http/AxiosHttpClient";

export const httpClient = new AxiosHttpClient(axiosClient);