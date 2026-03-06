import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import Providers from '@/components/Providers/Providers';
import '@/styles/colors.css';
import '@/styles/index.css';
import '@/styles/Animations.css';

export const metadata: Metadata = {
    title: 'Sidekick',
    description: 'Social media platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
                <div id="portal-root" />
            </body>
        </html>
    );
}
