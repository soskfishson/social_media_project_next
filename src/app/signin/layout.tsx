import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    title: 'Sign In',
    description:
        'Sign in to your Sidekick account to access your personalised feed, post updates, and connect with your community.',
    alternates: {
        canonical: `${BASE_URL}/signin`,
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: 'Sign In | Sidekick',
        description: 'Sign in to your Sidekick account.',
        url: `${BASE_URL}/signin`,
    },
};

export default function SignInLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
