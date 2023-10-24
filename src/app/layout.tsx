import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
         <script async src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/bootstrap-icons.svg"/>      
     </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
