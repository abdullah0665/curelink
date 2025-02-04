export const getCategories = async () => {
    try {
        const res = await fetch(`https://angi.weteck.co/category_data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent stale SSR data
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Fetch error (getCategories):", error.message);
        return null; // Return null to prevent Next.js hydration issues
    }
};

export const getAngiData = async () => {
    try {
        const res = await fetch(`https://angi.weteck.co/business_data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Fetch error (getAngiData):", error.message);
        return null;
    }
};

export const getIndeedData = async () => {
    try {
        const res = await fetch(`https://angi.weteck.co/jobdata`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Fetch error (getAngiData):", error.message);
        return null;
    }
};

export const keywordData = async (keyword) => {
    try {
        const res = await fetch(`https://angi.weteck.co/keywords?keyword=${keyword}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Fetch error (getAngiData):", error.message);
        return null;
    }
};
export const GetKeywords = async () => {
    try {
        const res = await fetch(`https://angi.weteck.co/keywords_data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Fetch error (getAngiData):", error.message);
        return null;
    }
};
