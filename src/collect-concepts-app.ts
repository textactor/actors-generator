
require('dotenv').config();

import { delay, parseLocale } from "./utils";

const locale = parseLocale(process.env.LOCALE);

if (!locale) {
    throw new Error('LOCALE env is required!');
}

const sourceName = process.env.SOURCE;

const debug = require('debug')('actors-generator');

import { collectConcepts } from "./collectConcepts";
import { initData, close } from "./data";
import { WebsiteConceptEnumerator } from './websiteConceptEnumerator';
import { DBConceptEnumerator } from './dbConceptEnumerator';
import { IConceptEnumerator } from './conceptEnumerator';

async function start() {
    debug(`START ${locale.lang}-${locale.country}`);
    await initData();
    const enumerator = createEnumerator();
    return collectConcepts(locale, enumerator).then(() => delay(1000 * 5));
}

function createEnumerator(): IConceptEnumerator {
    if (~['website', 'site'].indexOf(sourceName)) {
        return WebsiteConceptEnumerator.createFromEnv();
    }
    return DBConceptEnumerator.createFromEnv(locale);
}

start()
    .then(() => console.log('END'))
    .catch(e => console.error(e))
    .then(() => close())
    .then(() => process.exit());
