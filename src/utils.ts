
export type Locale = {
    lang: string
    country: string
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function parseLocale(s: string | undefined | null): Locale | null {
    if (!s || s.length !== 5) {
        return null;
    }
    const parts = s.split(/[_-]/);
    return {
        lang: parts[0].trim().toLowerCase(),
        country: parts[1].trim().toLowerCase(),
    }
}

export function isWikidataId(id: string) {
    return /^Q\d+$/.test(id);
}

export function uniqProp<T>(items: T[], prop: keyof T): T[] {
    const map: { [index: string]: any } = {}
    const list: T[] = []

    for (let item of items) {
        if (map[(<any>item)[prop]] === undefined) {
            map[(<any>item)[prop]] = 1;
            list.push(item)
        }
    }

    return list;
}
