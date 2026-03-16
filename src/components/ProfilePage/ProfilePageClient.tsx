'use client';

import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import TabSwitch from '@/components/TabSwitch/TabSwitch';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import ProfileStatisticsClient from '@/components/ProfileStatistics/ProfileStatisticsClient';

const ProfilePageClient = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTab = searchParams.get('tab') || 'profile';

    const tabs = [
        { id: 'profile', label: t('profile.profileInfo') },
        { id: 'statistics', label: t('profile.statistics') },
    ];

    const handleTabChange = (tab: string) => {
        router.replace(`?tab=${tab}`, { scroll: false });
    };

    return (
        <>
            <TabSwitch tabs={tabs} defaultTab={currentTab} onTabChange={handleTabChange} />

            {currentTab === 'profile' && <ProfileInfo />}

            {currentTab === 'statistics' && <ProfileStatisticsClient />}
        </>
    );
};

export default ProfilePageClient;
