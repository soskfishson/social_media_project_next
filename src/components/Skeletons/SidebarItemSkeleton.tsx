import './Skeleton.css';

interface SidebarItemSkeletonProps {
    title: string;
    count?: number;
}

const SidebarItemSkeleton = ({ count = 5 }: SidebarItemSkeletonProps) => {
    const items = Array.from({ length: count });

    return (
        <section className="sidebar-skeleton-section" data-testid="sidebar-skeleton">
            <div className="skeleton sidebar-skeleton-title" />
            <ul className="sidebar-skeleton-list">
                {items.map((_, idx) => (
                    <li key={idx} className="sidebar-skeleton-item">
                        <div className="skeleton skeleton-avatar" />
                        <div>
                            <div className="skeleton skeleton-line long" />
                            <div className="skeleton skeleton-line medium" />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default SidebarItemSkeleton;
