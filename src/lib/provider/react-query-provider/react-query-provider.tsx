import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type FC, type PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
