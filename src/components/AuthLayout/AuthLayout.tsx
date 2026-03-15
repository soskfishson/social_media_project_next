import type { ReactNode } from 'react';
import Link from 'next/link';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './AuthLayout.css';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    bottomText: string;
    bottomLink: {
        text: string;
        href: string;
    };
}

const AuthLayout = ({ title, subtitle, children, bottomText, bottomLink }: AuthLayoutProps) => {
    return (
        <div className="auth-layout page-transition-wrapper">
            <Header variant="simple" />
            <main className="auth-main">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1 className="auth-title">{title}</h1>
                        <p className="auth-subtitle">{subtitle}</p>
                    </div>
                    {children}
                    <p className="auth-bottom-text">
                        {bottomText}{' '}
                        <Link href={bottomLink.href} className="auth-link">
                            {bottomLink.text}
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AuthLayout;
