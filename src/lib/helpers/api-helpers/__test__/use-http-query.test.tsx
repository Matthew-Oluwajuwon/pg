import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from "axios";
import { waitFor } from "@testing-library/react";
import { useHttpQuery } from "../use-http-query";

describe("useHttpQuery", () => {
  let queryClient: QueryClient;
  let mockAxios: Partial<AxiosInstance>;

  beforeEach(() => {
    queryClient = new QueryClient();
    mockAxios = {
      request: vi.fn(),
    };
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should make request and return data", async () => {
    const mockResponse: AxiosResponse = {
      data: { message: "Hello World" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };

    (mockAxios.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    const { result } = renderHook(
      () =>
        useHttpQuery<unknown, { message: string }>({
          url: "/test",
          method: "GET",
          api: mockAxios as AxiosInstance,
          queryKey: ["test"],
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxios.request).toHaveBeenCalledWith({
      url: "/test",
      data: undefined,
      method: "GET",
      params: undefined,
      responseType: undefined,
      headers: {},
    });

    expect(result.current.data).toEqual({ message: "Hello World" });
  });

  it("should handle error correctly", async () => {
    const error = new Error("Network error");

    (mockAxios.request as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      error,
    );

    const { result } = renderHook(
      () =>
        useHttpQuery({
          url: "/fail",
          method: "GET",
          api: mockAxios as AxiosInstance,
          retry: false,
          queryKey: ["test"],
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
  });

  it("should support select function", async () => {
    const mockResponse: AxiosResponse = {
      data: { user: { name: "Jane" } },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };

    (mockAxios.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    const { result } = renderHook(
      () =>
        useHttpQuery<unknown, { user: { name: string } }, string>({
          url: "/user",
          method: "GET",
          api: mockAxios as AxiosInstance,
          select: (data) => data.user.name,
          queryKey: ["test"],
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe("Jane");
  });
});
