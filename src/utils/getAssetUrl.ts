export const getAssetUrl = (url: string | null | undefined) => {
    if (!url) return '';

    if (url.startsWith('http') || url.startsWith('data:')) return url;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    if (basePath && url.startsWith(basePath)) return url;

    const formattedUrl = url.startsWith('/') ? url : `/${url}`;

    return `${basePath}${formattedUrl}`;
};
