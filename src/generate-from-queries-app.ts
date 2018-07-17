
require('dotenv').config();

import { parseLocale, delay, Locale } from "./utils";

const locale = parseLocale(process.env.LOCALE) as Locale;

if (!locale) {
    throw new Error('LOCALE env is required!');
}

import logger from './logger';

import { initData, close } from "./data";
import { generateFromQueries } from "./generate-from-queries";

async function start() {
    logger.warn(`START collect-concepts-from-queries ${locale.lang}-${locale.country}`);
    await initData();

    return generateFromQueries(locale, process.env.FILE);
}

start()
    .then(() => logger.warn('END'))
    .catch(e => logger.error(e))
    .then(() => close())
    .then(() => delay(1000 * 3))
    .then(() => process.exit());

process.on("uncaughtException", error => logger.error(error));
process.on("unhandledRejection", error => logger.error(error));
