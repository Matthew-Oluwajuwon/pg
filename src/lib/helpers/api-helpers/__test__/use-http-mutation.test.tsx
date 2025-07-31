import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useHttpMutation } from "../use-http-mutation";
import type { AxiosInstance } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

describe("useHttpMutation", () => {
  let mockAxios: Partial<AxiosInstance>;
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();

    mockAxios = {
      request: vi.fn().mockResolvedValue({ data: { message: "success" } }),
    };
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should call axios with correct config and return response", async () => {
    const { result } = renderHook(
      () =>
        useHttpMutation<{ name: string }, { message: string }>({
          url: "/test",
          method: "POST",
          axiosInstance: mockAxios as AxiosInstance,
        }),
      { wrapper },
    );

    act(() => {
      result.current.mutate({ data: { name: "John" } });
    });

    await waitFor(() => result.current.isSuccess);

    expect(mockAxios.request).toHaveBeenCalledWith({
      url: "/test",
      data: { name: "John" },
      method: "POST",
      headers: {},
    });

    expect(result.current.data).toEqual({ message: "success" });
  });

  it("should call onError if axios fails", async () => {
    const error = new Error("Request failed");
    (mockAxios.request as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      error,
    );

    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useHttpMutation({
          url: "/fail",
          method: "POST",
          axiosInstance: mockAxios as AxiosInstance,
          retry: false,
          onError,
        }),
      { wrapper },
    );

    act(() => {
      result.current.mutate({ data: { fail: true } });
    });

    await waitFor(() => result.current.isError);

    expect(onError).toHaveBeenCalledWith(
      error,
      { data: { fail: true } },
      undefined,
    );
  });
});
