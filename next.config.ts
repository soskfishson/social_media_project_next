import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        // turbopack: {}
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
