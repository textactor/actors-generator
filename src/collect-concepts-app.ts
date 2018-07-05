
require('dotenv').config();

import { delay, parseLocale } from "./utils";

const locale = parseLocale(process.env.LOCALE);

if (!locale) {
    throw new Error('LOCALE env is required!');
}

const sourceName = process.env.SOURCE;

import logger from './logger';

import { collectConcepts } from "./collect-concepts";
import { initData, close, textactorExplorer } from "./data";
import { WebsiteConceptEnumerator } from './website-concept-enumerator';
import { DBConceptEnumerator } from './db-concept-enumerator';
import { IConceptEnumerator } from './concept-enumerator';

async function start() {
    logger.warn(`START collect-concepts ${locale.lang}-${locale.country}`);
    await initData();
    const enumerator = createEnumerator();
    const container = textactorExplorer.newDataContainer({
        name: `actors-generator-app`,
        uniqueName: `actors-generator-app-${Math.round(Date.now() / 1000)}`,
        lang: locale.lang,
        country: locale.country,
        ownerId: 'ournet',
    });
    await collectConcepts(container, enumerator).then(() => delay(1000 * 5));
    await container.end();
}

function createEnumerator(): IConceptEnumerator {
    if (~['website', 'site'].indexOf(sourceName)) {
        return WebsiteConceptEnumerator.createFromEnv();
    }
    return DBConceptEnumerator.createFromEnv(locale);
}

start()
    .then(() => console.log('END'))
    .catch(e => logger.error(e))
    .then(() => close())
    .then(() => process.exit());
