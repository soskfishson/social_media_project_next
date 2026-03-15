'use client';

import { useState } from 'react';
import './TabSwitch.css';
import Button from '@/components/Button/Button';
import { ButtonType } from '@/interfaces/interfaces';

interface Tab {
    id: string;
    label: string;
}

interface TabSwitchProps {
    tabs: Tab[];
    defaultTab?: string;
    onTabChange?: (tabId: string) => void;
}

const TabSwitch = ({ tabs, defaultTab, onTabChange }: TabSwitchProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange?.(tabId);
    };

    return (
        <div className="tab-switch" role="tablist">
            {tabs.map((tab) => (
                <Button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`tab-switch-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab.id)}
                    type={ButtonType.BUTTON}
                    label={tab.label}
                />
            ))}
        </div>
    );
};

export default TabSwitch;
