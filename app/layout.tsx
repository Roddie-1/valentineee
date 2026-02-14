import './globals.css'
import { Cookie, Nunito, Dancing_Script } from 'next/font/google' // Light romantic fonts

const serif = Cookie({ subsets: ['latin'], variable: '--font-serif', weight: ['400'] })
const sans = Nunito({ subsets: ['latin'], variable: '--font-sans', weight: ['300', '400', '600', '700'] })
const script = Dancing_Script({ subsets: ['latin'], variable: '--font-script', weight: ['400', '700'] })

export const metadata = {
    title: 'Happy Valentine My Love',
    description: 'A special surprise for you.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${serif.variable} ${sans.variable} ${script.variable} font-sans antialiased`}>{children}</body>
        </html>
    )
}
