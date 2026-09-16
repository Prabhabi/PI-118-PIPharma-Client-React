import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";

// ✅ Compressed localStorage persister using JSON instead of devalue
export const localStoragePersister = {
  persistClient: async (client) => {
    try {
      const compressed = compressToUTF16(JSON.stringify(client));
      sessionStorage.setItem("REACT_QUERY_OFFLINE_CACHE", compressed);
    } catch (err) {
      console.warn("Failed to persist cache:", err);
    }
  },
  restoreClient: async () => {
    try {
      const compressed = sessionStorage.getItem("REACT_QUERY_OFFLINE_CACHE");
      return compressed
        ? JSON.parse(decompressFromUTF16(compressed))
        : undefined;
    } catch (err) {
      console.warn("Failed to restore cache:", err);
      return undefined;
    }
  },
  removeClient: async () => {
    sessionStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
  },
};

// ✅ React Query client setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      gcTime: Infinity, // 🟢 Required in v5
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: "never",
      refetchInterval: false,
      refetchIntervalInBackground: false,
      retry: false,
    },
  },
});

// ✅ Setup persistent cache
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 2 * 1, // 1 days
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
