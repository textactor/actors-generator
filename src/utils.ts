
export type Locale = {
    lang: string
    country: string
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function parseLocale(s: string): Locale {
    if (!s || s.length !== 5) {
        return null;
    }
    const parts = s.split(/[_-]/);
    return {
        lang: parts[0].trim().toLowerCase(),
        country: parts[1].trim().toLowerCase(),
    }
}
