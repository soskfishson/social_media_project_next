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
                        width={24}
                        height={24}
                        loading="lazy"
                        fetchPriority="auto"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,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"
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
