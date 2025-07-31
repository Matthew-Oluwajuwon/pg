import { describe, it, expect, vi, beforeEach } from "vitest";
import MockAdapter from "axios-mock-adapter";

// Mock storageHelper from "@/lib"
vi.mock("@/lib", () => ({
  storageHelper: {
    getItem: vi.fn(),
  },
}));

import { storageHelper } from "@/lib";
import { apiClient } from "../api-client";

describe("apiClient interceptor", () => {
  const mock = new MockAdapter(apiClient);

  beforeEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  it("adds Authorization header when token exists", async () => {
    // Arrange
    (storageHelper.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
      "mock-token",
    );

    mock.onGet("/test").reply(200, { success: true });

    // Act
    const response = await apiClient.get("/test");

    // Assert
    expect(response.status).toBe(200);
    const requestHeaders = mock.history.get[0].headers;
    expect(requestHeaders?.Authorization).toBe("Bearer mock-token");
  });

  it("does not set Authorization header if no token", async () => {
    (storageHelper.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

    mock.onGet("/test").reply(200, { success: true });

    const response = await apiClient.get("/test");

    expect(response.status).toBe(200);
    const requestHeaders = mock.history.get[0].headers;
    expect(requestHeaders?.Authorization).toBeUndefined();
  });
});
