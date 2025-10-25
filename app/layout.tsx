import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stock Chat AI - Real-time Market Insights',
  description: 'Chat with AI to get real-time stock market information powered by Google Gemini with web search',
  keywords: ['stock market', 'AI chat', 'financial news', 'stock prices', 'market analysis'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
