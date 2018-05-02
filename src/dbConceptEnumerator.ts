import { Locale } from "./utils";
import { IConceptEnumerator } from "./conceptEnumerator";
const debug = require('debug')('actors-generator');
const News = require('ournet.data.news');
const newsAccess = News.getAccessService(process.env.NEWS_CONNECTION);

export class DBConceptEnumerator implements IConceptEnumerator {
    pagesize = 50;
    offset = 0;
    constructor(private locale: Locale, private options: { startDate: Date, endDate: Date }) {
    }

    next(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            newsAccess.webpages({
                culture: this.locale,
                where: {
                    country: this.locale.country,
                    lang: this.locale.lang,
                    createdAt: { $gt: this.options.startDate, $lt: this.options.endDate },
                },
                select: 'title summary',
                limit: this.pagesize,
                offset: this.offset,
            }).then((pages: any[]) => {
                const list = pages.map<string>(page => `${page.title}\n${page.summary}`);
                this.offset += this.pagesize;
                resolve(list);
            }).catch(reject);
        });
    }

    static createFromEnv(locale: Locale) {
        const startDate = new Date();
        const endDate = new Date();
        const PAST_DAYS = !!process.env.PAST_DAYS ? parseInt(process.env.PAST_DAYS) : 4;
        const PERIOD = !!process.env.PERIOD ? parseInt(process.env.PERIOD) : 4;
        startDate.setDate(startDate.getDate() - PAST_DAYS);
        endDate.setDate(startDate.getDate() + PERIOD);

        debug('startDate=', startDate)
        debug('endDate=', endDate)

        return new DBConceptEnumerator(locale, { startDate, endDate });
    }
}
