import Image from 'next/image';
import './SidebarItem.css';

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
                            src={item.pictureLink}
                            alt={item.title}
                            className="sidebar-item-image"
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
