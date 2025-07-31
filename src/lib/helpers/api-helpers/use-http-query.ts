import {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosInstance,
  AxiosError,
} from "axios";
import {
  useQuery,
  type UseQueryOptions,
  type QueryFunction,
} from "@tanstack/react-query";
import apiClient from "./api-client";
import { useCallback } from "react";

export type UseHttpQueryAxiosOptions<Data> = Pick<
  AxiosRequestConfig<Data>,
  "url" | "data" | "method" | "headers" | "params" | "responseType"
>;

export type UseHttpQueryOptions<Data, Response, Selected, Error> =
  UseHttpQueryAxiosOptions<Data> &
    UseQueryOptions<Response, Error, Selected> & {
      /** Optional axios instance */
      api?: AxiosInstance;
    };

export interface BaseApiError {
  message: string;
  code: string;
}

export type ApiError = AxiosError<BaseApiError>;

/**
 * @example
 * const { data, isLoading, error } = useHttpQuery({
 *  url: "/api/user",
 *  enabled: !!token,
 *  select: (data) => data.user,
 *  headers: {
 *    Authorization: `Bearer ${token}`,
 *  }
 * }
 */
export function useHttpQuery<
  Data = unknown,
  Response = unknown,
  Selected = Response,
  Error = ApiError,
>({
  api,
  url,
  data,
  params,
  headers,
  responseType,
  method = "GET",
  ...queryOptions
}: UseHttpQueryOptions<Data, Response, Selected, Error>) {
  const queryFn: QueryFunction<Response> =
    useCallback(async (): Promise<Response> => {
      const response: AxiosResponse<Response> = await (
        api || apiClient
      ).request({
        url,
        data,
        params,
        method,
        responseType,
        headers: {
          ...headers,
        },
      });
      return response.data;
    }, [api, data, headers, method, params, responseType, url]);

  return useQuery<Response, Error, Selected>({
    queryFn,
    ...queryOptions,
  });
}
