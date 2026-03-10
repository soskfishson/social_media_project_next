'use client';

import Link from 'next/link';
import Logo from '../../assets/logo.svg';
import LogoLight from '../../assets/logoLight.svg';
import useTheme from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { ThemeTypes } from '@/interfaces/interfaces';

const HeaderLogo = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <Link href="/" className="header-logo-container" aria-label={t('a11y.logoHome')}>
            {theme === ThemeTypes.DARK ? (
                <Logo aria-hidden="true" />
            ) : (
                <LogoLight aria-hidden="true" />
            )}
        </Link>
    );
};

export default HeaderLogo;
