import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProfilePageClient from '@/components/ProfilePage/ProfilePageClient';
import ProtectedRoute from '@/utils/ProtectedRoute';
import './ProfilePage.css';

export default function Profile() {
    return (
        <ProtectedRoute>
            <div className="profile-page-container page-transition-wrapper">
                <Header />
                <div className="profile-page">
                    <ProfilePageClient />
                </div>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
