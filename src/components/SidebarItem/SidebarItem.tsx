import Image from 'next/image';
import './SidebarItem.css';
import { getAssetUrl } from '@/utils/getAssetUrl';

export interface LinkableItem {
    id: number;
    title: string;
    description: string;
    pictureLink: string;
}

interface SidebarItemProps {
    title: string;
    items: LinkableItem[];
}

const SidebarItem = ({ title, items }: SidebarItemProps) => {
    return (
        <section className="sidebar-item">
            <h2 className="sidebar-item-heading">{title}</h2>
            <ul className="sidebar-item-list">
                {items.map((item) => (
                    <li key={item.id} className="sidebar-list-item">
                        <Image
                            width={48}
                            height={48}
                            loading="lazy"
                            fetchPriority="auto"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,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"
                            src={getAssetUrl(item.pictureLink)}
                            alt={item.title}
                            className="sidebar-item-image"
                            unoptimized
                        />
                        <div className="sidebar-item-text">
                            <h3 className="sidebar-item-title">{item.title}</h3>
                            <p className="sidebar-item-desc">{item.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default SidebarItem;
