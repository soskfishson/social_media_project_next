'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarItem from '../SidebarItem/SidebarItem';
import SidebarItemSkeleton from '../Skeletons/SidebarItemSkeleton';
import useAuth from '@/hooks/useAuth';
import './Sidebar.css';
import type { Group, SuggestedUser } from '@/interfaces/interfaces';

export default function Sidebar() {
    const { t } = useTranslation();
    const { isLoggedIn } = useAuth();
    const [data, setData] = useState({ users: [], groups: [], loading: true });

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            };

            try {
                const [uRes, gRes] = await Promise.all([
                    fetch('/api/getSuggested', { headers }),
                    fetch('/api/groups', { headers }),
                ]);

                const users = await uRes.json();
                const groups = await gRes.json();

                setData({
                    users: users.map((u: SuggestedUser) => ({
                        id: u.id,
                        title: `${u.firstName} ${u.secondName}`,
                        description: u.username || 'Suggested',
                        pictureLink: u.photo || '/assets/default-avatar.png',
                    })),
                    groups: groups.map((g: Group) => ({
                        id: g.id,
                        title: g.title,
                        description: `${g.membersCount} members`,
                        pictureLink: g.photo || '/assets/default-group.png',
                    })),
                    loading: false,
                });
            } catch (e) {
                setData((prev) => ({ ...prev, loading: false }));
                console.error(e);
            }
        };

        fetchData();
    }, [isLoggedIn]);

    if (!isLoggedIn) return null;

    return (
        <aside className="sidebar">
            {data.loading ? (
                <>
                    <SidebarItemSkeleton title={t('sidebar.suggestedPeople')} />
                    <SidebarItemSkeleton title={t('sidebar.communities')} />
                </>
            ) : (
                <>
                    <SidebarItem title={t('sidebar.suggestedPeople')} items={data.users} />
                    <SidebarItem title={t('sidebar.communities')} items={data.groups} />
                </>
            )}
        </aside>
    );
}
