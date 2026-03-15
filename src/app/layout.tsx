import type { Metadata, Viewport } from 'next';
import { type ReactNode } from 'react';
import Providers from '@/components/Providers/Providers';
import '@/styles/colors.css';
import '@/styles/index.css';
import '@/styles/Animations.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#0E1223' },
        { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'Sidekick — Social Media Platform',
        template: '%s | Sidekick',
    },
    description:
        'Sidekick is a modern social media platform where you can share posts, connect with people, and build communities.',
    keywords: ['social media', 'posts', 'community', 'sidekick', 'networking'],
    authors: [{ name: 'Sidekick Team' }, { name: 'TechClub1990' }],
    creator: 'Sidekick',
    publisher: 'Sidekick',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: BASE_URL,
        siteName: 'Sidekick',
        title: 'Sidekick — Social Media Platform',
        description:
            'Sidekick is a modern social media platform where you can share posts, connect with people, and build communities.',
        images: [
            {
                url: `${BASE_URL}/og-image.png`,
                width: 200,
                height: 200,
                alt: 'Sidekick Social Media Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sidekick — Social Media Platform',
        description: 'Share posts, connect with people, and build communities on Sidekick.',
        images: [`${BASE_URL}/og-image.png`],
        creator: '@sidekick',
    },
    icons: {
        icon: `${BASE_URL}/favicon.ico`,
    },
    category: 'social media',
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
