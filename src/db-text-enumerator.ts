import { Locale } from "./utils";
import { TextEnumerator } from "./text-enumerator";
import { learningTextRepository } from "./data";
const debug = require('debug')('actors-generator');

export class DbTextEnumerator implements TextEnumerator {
    pagesize = 50;
    offset = 0;
    limit = 1000;

    constructor(private locale: Locale) {
    }

    next(): Promise<string[]> {
        if (this.limit < this.offset) {
            debug(`Reached limit: ${this.limit}`);
            return Promise.resolve([]);
        }
        return new Promise((resolve, reject) => {
            learningTextRepository.list({
                lang: this.locale.lang,
                country: this.locale.country,
                limit: this.pagesize,
                skip: this.offset,
            }).then(pages => {
                const list = pages.map<string>(page => page.text);
                this.offset += this.pagesize;
                resolve(list);
            }).catch(reject);
        });
    }

    static createFromEnv(locale: Locale) {
        return new DbTextEnumerator(locale);
    }
}
