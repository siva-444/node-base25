import axios, { type AxiosRequestConfig } from "axios";
import { merge } from "remeda";

import { API_BASE_URL, STATUS_CODES } from "@services/constants";

import ResponseModel from "./ResponseModel";
import type { ApiResponse, GlobalHeaderKeys, ResponseTypesWith } from "./types";
import {
  isBadRequestResponse,
  isNullableResponse,
  isSuccessResponse,
} from "./utils";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Interceptor Request Message", error);
    Promise.reject(error.message);
  },
);
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Interceptor Message", error);
    Promise.reject(error.message);
  },
);

const axiosSuccessLimit = 500;

const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 1000 * 15,
  validateStatus: (status) => status < axiosSuccessLimit,
  headers: {
    Accept: "application/json",
  },
};

const request = async <T extends object, D = unknown>(
  config: AxiosRequestConfig<D>,
) => {
  try {
    const mergedConfig = merge(defaultConfig, config) as AxiosRequestConfig<D>;

    const { status, data, statusText } =
      await axios.request<ApiResponse<ResponseTypesWith<T>>>(mergedConfig);
    const responseData = data.data ?? null;
    const message = data?.message ?? statusText;

    switch (status) {
      case STATUS_CODES.OK:
      case STATUS_CODES.CREATED: {
        if (isSuccessResponse<T>(responseData)) {
          return new ResponseModel(status, responseData, message);
        }
        break;
      }

      case STATUS_CODES.BAD_REQUEST: {
        if (isBadRequestResponse<T>(responseData)) {
          return new ResponseModel(status, responseData, message);
        }
        break;
      }

      case STATUS_CODES.NO_CONTENT:
      case STATUS_CODES.UNAUTHORIZED:
      case STATUS_CODES.FORBIDDEN:
      case STATUS_CODES.NOT_FOUND: {
        if (isNullableResponse<T>(responseData)) {
          return new ResponseModel(status, null, message);
        }
        break;
      }
    }
    return new ResponseModel(
      STATUS_CODES.EXPECTATION_FAILED,
      null,
      "Unhandled API response",
    );
  } catch (error) {
    let message = "Something went wrong";
    if (axios.isAxiosError(error)) {
      const response = error.response;
      message =
        response?.data?.message ?? response?.statusText ?? error.message;
    }

    return new ResponseModel(STATUS_CODES.EXPECTATION_FAILED, null, message);
  }
};

export const get = async <T extends object>(config: AxiosRequestConfig) =>
  request<T>({ ...config, method: "GET" });

export const post = async <T extends object, D = unknown>(
  config: AxiosRequestConfig<D>,
) => request<T, D>({ ...config, method: "POST" });

export const put = async <T extends object, D = unknown>(
  config: AxiosRequestConfig<D>,
) => request<T, D>({ ...config, method: "PUT" });

export const del = async <T extends object, D = unknown>(
  config: AxiosRequestConfig<D>,
) => request<T, D>({ ...config, method: "DELETE" });

export const setGlobalHeader = (
  headerKey: GlobalHeaderKeys,
  headerValue: string | number | boolean,
) => {
  axios.defaults.headers.common[headerKey] = headerValue;
};

export const removeGlobalHeader = (headerKey: GlobalHeaderKeys) => {
  delete axios.defaults.headers.common[headerKey];
};
