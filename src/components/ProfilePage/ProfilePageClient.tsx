'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabSwitch from '@/components/TabSwitch/TabSwitch';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';

const ProfilePageClient = () => {
    const [currentTab, setCurrentTab] = useState('profile');
    const { t } = useTranslation();

    const tabs = [
        { id: 'profile', label: t('profile.profileInfo') },
        { id: 'statistics', label: t('profile.statistics') },
    ];

    return (
        <>
            <TabSwitch tabs={tabs} defaultTab="profile" onTabChange={setCurrentTab} />

            {currentTab === 'profile' && <ProfileInfo />}

            {currentTab === 'statistics' && <div>{t('profile.statistics')}</div>}
        </>
    );
};

export default ProfilePageClient;
