import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Sidebar from '@/components/Sidebar/Sidebar';
import CreatePostWrapper from '@/components/CreatePostForm/CreatePostWrapper';
import PostFeed from '@/components/Feed/PostFeed';
import './MainPage.css';

export default function MainPage() {
    return (
        <>
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
