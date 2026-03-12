import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        // turbopack: {}
        optimizeCss: true,
    },

    output: 'export',
    basePath: '/social_media_project_next',
    trailingSlash: true,

    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'via.placeholder.com' }],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 365,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' },
                ],
            },
        ];
    },

    async redirects() {
        return [{ source: '/home', destination: '/', permanent: true }];
    },

    compiler: {
        removeConsole:
            process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    },

    webpack(config) {
        const fileLoaderRule = config.module.rules.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (rule: any) => rule.test?.test?.('.svg'),
        );

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                issuer: (fileLoaderRule as any).issuer,
                resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not ?? []), /url/] },
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgo: true,
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: {
                                                removeViewBox: false,
                                                cleanupIds: false,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        );

        if (fileLoaderRule) {
            fileLoaderRule.exclude = /\.svg$/i;
        }

        return config;
    },
};

export default nextConfig;
