import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    title: 'Create Account',
    description:
        'Join Sidekick for free. Create an account to start sharing posts, discovering communities, and connecting with people.',
    alternates: {
        canonical: `${BASE_URL}/signup`,
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: 'Create Account | Sidekick',
        description: 'Join Sidekick and start connecting with your community.',
        url: `${BASE_URL}/signup`,
    },
};

export default function SignUpLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
