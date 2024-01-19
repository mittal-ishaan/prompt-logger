'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import HomeContext, { HomeProvider } from '@/context/HomeContext'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// const inter = Inter({ subsets: ['latin'] })
import toast, { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())
  return (

    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />

        <meta property="og:title" content="Prompt-logger" />
        <meta property="og:description" content="Prompt-logger" />

        <meta name="description" content="Prompt-logger" />
        <meta name="keywords" content="Prompt-logger" />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="overflow-auto">

        <QueryClientProvider client={queryClient}>
          <HomeProvider>
            <Toaster />
            {children} 
          </HomeProvider>         
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>

      </body>
    </html>

  )
}