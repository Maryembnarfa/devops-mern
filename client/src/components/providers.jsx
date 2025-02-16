import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export default function Providers({ children }) {
    const client = new QueryClient()
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}