'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Error from '@/assets/Error.svg';
import { useTranslation } from 'react-i18next';
import './error.css';

export default function ErrorPage() {
    const { t } = useTranslation();
    return (
        <div className="error-page page-transition-wrapper">
            <Header variant="simple" />
            <main className="error-page-container">
                <Error />
                <p className="error-message" data-testid="error-message">
                    {t('errors.generic')}
                </p>
            </main>
            <Footer />
        </div>
    );
}
