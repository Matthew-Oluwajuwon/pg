import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMakePayment } from "../use-make-payment";
import { App } from "antd";
import { useHttpMutation, useStore } from "@/lib";
import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { encryptPayload } from "@/lib/utils/encryt-payload.utils";

const mockAxiosResponse: AxiosResponse<{ message: string }> = {
  data: { message: "Axios error message" },
  status: 400,
  statusText: "Bad Request",
  headers: {},
  config: {} as InternalAxiosRequestConfig,
};

vi.mock("@/lib", () => ({
  useHttpMutation: vi.fn(),
  useStore: vi.fn(),
  errorModalProps: vi.fn(() => ({ some: "props" })),
}));

vi.mock("antd", () => ({
  App: {
    useApp: vi.fn(),
  },
}));

vi.mock("@/lib/utils/encryt-payload.utils", () => ({
  encryptPayload: vi.fn(() => "encrypted-card-data"),
}));

describe("useMakePayment", () => {
  const modalErrorMock = vi.fn();
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (App.useApp as Mock).mockReturnValue({
      modal: { error: modalErrorMock },
    });

    (useStore as unknown as Mock).mockImplementation((selector) =>
      selector({
        paymentInfo: {
          token: "fake-token",
          reference: "ref123",
          amount: 1000,
          billingCountry: "NG",
          publicKey: "pubkey123",
          callbackUrl: "https://callback.com",
        },
        setMakePaymentSuccessful: vi.fn(),
      }),
    );

    (useHttpMutation as Mock).mockReturnValue({
      isPending: false,
      data: null,
      mutateAsync: mutateAsyncMock,
    });
  });

  it("should call mutateAsync with correct encrypted payload", async () => {
    const { result } = renderHook(() => useMakePayment());

    await act(async () => {
      await result.current.onMakePayment({
        cardNumber: "1234 5678 9012 3456",
        cvv: "123",
        expiryMonth: "12",
        expiryYear: "25",
      });
    });

    expect(encryptPayload).toHaveBeenCalledWith(
      JSON.stringify({
        cardNumber: "1234567890123456",
        cvv: "123",
        expiryMonth: "12",
        expiryYear: "25",
      }),
      "pubkey123",
    );

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        encrypted: "encrypted-card-data",
        accessCode: "ref123",
      }),
    });
  });

  it("should call modal.error with AxiosError message", async () => {
    mutateAsyncMock.mockRejectedValueOnce(
      new AxiosError(
        "Axios failed",
        undefined,
        undefined,
        undefined,
        mockAxiosResponse,
      ),
    );

    const { result } = renderHook(() => useMakePayment());

    await act(async () => {
      await result.current.onMakePayment({});
    });

    expect(modalErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "Axios error message",
      }),
    );
  });

  it("should call modal.error with Error message", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("Some error"));

    const { result } = renderHook(() => useMakePayment());

    await act(async () => {
      await result.current.onMakePayment({});
    });

    expect(modalErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "Some error",
      }),
    );
  });

  it("should call modal.error with default message for unknown error", async () => {
    mutateAsyncMock.mockRejectedValueOnce("weird error");

    const { result } = renderHook(() => useMakePayment());

    await act(async () => {
      await result.current.onMakePayment({});
    });

    expect(modalErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "Unable to process transaction",
      }),
    );
  });
});
