import { render } from '@testing-library/react';
import { WebsiteJsonLd } from './JsonLd';

function getSchema(container: HTMLElement): Record<string, unknown> {
    const script = container.querySelector('script[type="application/ld+json"]');
    if (!script) {
        throw new Error('No JSON-LD script found');
    }
    return JSON.parse(script.textContent || '{}') as Record<string, unknown>;
}

describe('WebsiteJsonLd', () => {
    it('renders a script tag with application/ld+json type', () => {
        const { container } = render(<WebsiteJsonLd name="Sidekick" url="http://localhost:3000" />);
        expect(container.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
    });

    it('sets @type to WebSite', () => {
        const { container } = render(<WebsiteJsonLd name="Sidekick" url="http://localhost:3000" />);
        expect(getSchema(container)['@type']).toBe('WebSite');
    });

    it('includes the site name', () => {
        const { container } = render(<WebsiteJsonLd name="Sidekick" url="http://localhost:3000" />);
        expect(getSchema(container).name).toBe('Sidekick');
    });

    it('includes the url', () => {
        const { container } = render(<WebsiteJsonLd name="Sidekick" url="http://localhost:3000" />);
        expect(getSchema(container).url).toBe('http://localhost:3000');
    });

    it('includes description when provided', () => {
        const { container } = render(
            <WebsiteJsonLd
                name="Sidekick"
                url="http://localhost:3000"
                description="A social platform"
            />,
        );
        expect(getSchema(container).description).toBe('A social platform');
    });

    it('omits description when not provided', () => {
        const { container } = render(<WebsiteJsonLd name="Sidekick" url="http://localhost:3000" />);
        expect(getSchema(container).description).toBeUndefined();
    });
});
