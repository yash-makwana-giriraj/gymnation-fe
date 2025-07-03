export const getCookieValue = (name: string) => {
    const cookies: false | string[] = typeof window !== "undefined" ? document.cookie.split(';') : false;

    // Check if cookies is an array before iterating
    if (Array.isArray(cookies)) {
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(`${name}=`)) {
                return cookie.substring(name.length + 1);
            }
        }
    }

    return null;
};