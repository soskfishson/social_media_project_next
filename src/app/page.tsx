import type { Metadata } from 'next';
import { WebsiteJsonLd } from '@/components/SEO/JsonLd';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Sidebar from '@/components/Sidebar/Sidebar';
import CreatePostWrapper from '@/components/CreatePostForm/CreatePostWrapper';
import PostFeed from '@/components/Feed/PostFeed';
import './MainPage.css';

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    title: 'Home Feed',
    description: 'Share your thoughts on latest happening on Sidekick.',
    alternates: {
        canonical: BASE_URL,
    },
    openGraph: {
        title: 'Home Feed | Sidekick',
        description: 'Share your thoughts on latest happening on Sidekick.',
        url: BASE_URL,
        type: 'website',
    },
};

export default function MainPage() {
    return (
        <>
            <WebsiteJsonLd
                name="Sidekick"
                url={BASE_URL}
                description="A modern social media platform for sharing ideas and building communities."
            />
            <Header />
            <div className="main-page page-transition-wrapper">
                <div className="main-page-content">
                    <main className="main-page-container">
                        <CreatePostWrapper />
                        <PostFeed />
                    </main>
                </div>
                <Sidebar />
            </div>
            <Footer />
        </>
    );
}
