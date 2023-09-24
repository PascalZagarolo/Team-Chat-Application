import './globals.css'
import type { Metadata } from 'next'
import { Averia_Gruesa_Libre, Inter, Lora, Open_Sans, Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

const font = Open_Sans({ weight: "400", subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Team-Chat',
  description: 'Team-Chat Application 2023',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
    
      <body className={cn(font.className, "dark:bg-[#171717] dark:bg-gradient-to-br to-white")}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem storageKey='discord-theme'>
        <SocketProvider>
          
          <ModalProvider />
          <QueryProvider>
            {children}
          </QueryProvider>
        </SocketProvider>
        </ThemeProvider>
        
      </body>
     
    </html>
    </ClerkProvider>
  )
}
