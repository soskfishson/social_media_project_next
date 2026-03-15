'use client';

import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface HeaderControlsProps {
    variant?: 'default' | 'simple';
}

const HeaderControls = ({ variant }: HeaderControlsProps) => {
    const { isLoggedIn, user } = useAuth();
    const { t } = useTranslation();

    if (variant === 'simple') {
        return (
            <div className="header-right-side">
                <LanguageSwitcher />
            </div>
        );
    }

    if (isLoggedIn && user) {
        return (
            <div className="header-right-side header-right-side--logged-wrapper">
                <LanguageSwitcher />
                <Link
                    href="/profile"
                    className="header-right-side-logged"
                    aria-label={t('a11y.userAvatar', { name: user.username })}
                >
                    <Image
                        className="header-avatar"
                        src={user.profileImage || '/assets/default-avatar.png'}
                        alt={t('a11y.userAvatar', { name: user.username })}
                    />
                    <span className="header-username" aria-hidden="true">
                        {user.firstName} {user.secondName}
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className="header-right-side">
            <LanguageSwitcher />
            <Link href="/signup" className="header-link" data-testid="signup-link">
                {t('nav.signUp')}
            </Link>
            <Link href="/signin" className="header-link" data-testid="signin-link">
                {t('nav.signIn')}
            </Link>
        </div>
    );
};

export default HeaderControls;
