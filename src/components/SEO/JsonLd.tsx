interface WebsiteJsonLdProps {
    name: string;
    url: string;
    description?: string;
}

export const WebsiteJsonLd = ({ name, url, description }: WebsiteJsonLdProps) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url,
        ...(description && { description }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};
