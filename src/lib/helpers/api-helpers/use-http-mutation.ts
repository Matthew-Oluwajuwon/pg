import {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosInstance,
  type Method,
  AxiosError,
} from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import apiClient from "./api-client";

export type UseHttpMutationAxiosOptions<Data> = Pick<
  AxiosRequestConfig<Data>,
  // Pick as you need, make sure to also extract below or else these will be forwarded to useMutation instead of axios.request
  "url" | "data" | "method" | "headers"
>;

export type UseHttpMutationFunctionProps<Data> = {
  data?: Data;
  config?: AxiosRequestConfig;
};

type UseHttpMutationOptions<Data, Response> = {
  url?: string;
  data?: Data;
  method?: Method | string;
  headers?: Record<string, string>;
  axiosInstance?: AxiosInstance; // New: Accept an Axios instance
  isAuthorized?: boolean; // New: flag for authorization
  enableEntityId?: boolean;
} & UseMutationOptions<Response, AxiosError, Data>;
/**
 * @example
 *
 * const { mutate, isLoading, error } = useHttpMutation({
 *  url: "/api/user",
 *  method: "POST",
 *  onSuccess: () => queryClient.invalidateQueries("user"),
 *  onError: (error) => console.error(error),
 * });
 */
export function useHttpMutation<Data = unknown, Response = unknown>(
  options?: UseHttpMutationOptions<
    UseHttpMutationFunctionProps<Data>,
    Response
  >,
) {
  // Extract the axios options from the mutation options
  const {
    url,
    headers,
    onError,
    axiosInstance,
    method = "POST",
    ...mutationOptions
  } = options ?? {};
  // Define the mutation function with an object containing data and optional config
  // This optional config can be used to provide additional axios settings at the time of mutation
  const mutationFn = async ({
    data,
    config,
  }: UseHttpMutationFunctionProps<Data>): Promise<Response> => {
    const response: AxiosResponse<Response> = await (
      axiosInstance || apiClient
    ).request({
      url,
      data,
      method,
      headers: {
        ...headers,
      },
      ...config, // Spread the config to allow overriding default settings
    });

    return response.data;
  };

  return useMutation<Response, AxiosError, UseHttpMutationFunctionProps<Data>>({
    mutationFn,
    ...mutationOptions,
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
  });
}
