"use client"
import "./globals.css";

import {
  QueryClientProvider
} from '@tanstack/react-query';
import { query_client } from "./lib/tanstack_query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <QueryClientProvider client={query_client}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
