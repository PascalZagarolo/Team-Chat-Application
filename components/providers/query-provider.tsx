'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";

export const QueryProvider = ({ children }: {children: React.ReactNode}) => {
    //cached data =>  no Api-call required //
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}