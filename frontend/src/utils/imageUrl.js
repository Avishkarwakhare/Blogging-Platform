export const getImageUrl = (url) => {
    if (!url) return null;

    // Check if it's a full URL (http, https, or protocol-relative //)
    if (/^(https?:\/\/|\/\/)/i.test(url)) {
        return url;
    }

    // Use the base URL from env or fallback to localhost:4000
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://blogging-platform-backend-hz7a.onrender.com';
    const baseUrl = apiBaseUrl.replace('/api', '');

    return `${baseUrl}${url}`;
};

export const getFullAvatarUrl = getImageUrl;
