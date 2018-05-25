
require('dotenv').config();

import { delay, parseLocale } from "./utils";

const locale = parseLocale(process.env.LOCALE);

if (!locale) {
    throw new Error('LOCALE env is required!');
}

import logger from './logger';

import { initData, close } from "./data";
import { collectConceptsFromQueries } from "./collectConceptsFromQueries";

async function start() {
    logger.warn(`START collect-concepts-from-queries ${locale.lang}-${locale.country}`);
    await initData();

    return collectConceptsFromQueries(locale).then(() => delay(1000 * 5));
}

start()
    .then(() => console.log('END'))
    .catch(e => logger.error(e))
    .then(() => close())
    .then(() => process.exit());
