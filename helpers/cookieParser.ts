class CookieParser {
    parse(str?: string): { [key: string]: string; } {
        if (str === undefined) return {};

        const keyValuePairs = str.split(';').map(v => v.split('='));
        const cookies: { [key: string]: string; } = {};
        keyValuePairs.forEach((pairs: string[]) => {
            const key: string = decodeURIComponent(pairs[0].trim());
            const value: string = decodeURIComponent(pairs[1].trim());
            cookies[key] = value;
        });
        return cookies;
    }
}


const CookieParserObject = new CookieParser();
export {
    CookieParserObject as CookieParser
}
