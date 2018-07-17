
import { IConceptEnumerator } from "./concept-enumerator";
const debug = require('debug')('actors-generator');
const articleScrape = require('ascrape');

export class WebsiteConceptEnumerator implements IConceptEnumerator {
    currentId: number
    constructor(private options: { startId: number, endId: number, url: string }) {
        if (!options.url.includes('ID')) {
            throw new Error(`Invalid url: ${options.url}`);
        }
        if (!Number.isFinite(options.startId) || !Number.isFinite(options.endId) || options.startId > options.endId) {
            throw new Error(`Invalid options: ${JSON.stringify(options)}`);
        }
        this.currentId = options.startId - 1;
    }

    static createFromEnv() {
        const startId = parseInt(process.env.START_ID || '');
        const endId = parseInt(process.env.END_ID || '');
        const url = process.env.URL || '';

        debug('startId=', startId)
        debug('endId=', endId)

        return new WebsiteConceptEnumerator({ startId, endId, url });
    }

    next(): Promise<string[]> {
        return this.getNext().then(article => {
            if (!article) {
                return []
            }
            return [article];
        })
    }

    private async getNext(tries?: number): Promise<string | null> {
        this.currentId++;
        if (this.currentId >= this.options.endId || tries !== undefined && tries > 4) {
            return null;
        }
        tries = tries || 0;
        const url = this.options.url.replace('ID', this.currentId.toString());
        const article = await fetchUrl(url);
        if (!article) {
            debug(`next try`);
            return this.getNext(++tries);
        }
        return article;
    }
}

function fetchUrl(url: string) {
    debug(`getting url: ${url}`)
    return new Promise<string | null>((resolve, reject) => {
        articleScrape(url, (error: Error, article: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(article.title + '\n' + (article.content && article.content.text() || article.excerpt));
            }
        })
    })
        .catch(error => {
            debug(error.message);
            return null;
        });
}
