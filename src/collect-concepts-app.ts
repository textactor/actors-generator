
require('dotenv').config();

import { delay, parseLocale } from "./utils";

const locale = parseLocale(process.env.LOCALE);

if (!locale) {
    throw new Error('LOCALE env is required!');
}

const sourceName = process.env.SOURCE;

import logger from './logger';

import { collectConcepts } from "./collectConcepts";
import { initData, close, containerRepository } from "./data";
import { WebsiteConceptEnumerator } from './websiteConceptEnumerator';
import { DBConceptEnumerator } from './dbConceptEnumerator';
import { IConceptEnumerator } from './conceptEnumerator';
import { ConceptContainerHelper } from "@textactor/concept-domain";

async function start() {
    logger.warn(`START collect-concepts ${locale.lang}-${locale.country}`);
    await initData();
    const enumerator = createEnumerator();
    const container = await containerRepository.create(ConceptContainerHelper.build({
        name: `actors-generator-app`,
        uniqueName: `actors-generator-app-${Math.round(Date.now() / 1000)}`,
        lang: locale.lang,
        country: locale.country,
        ownerId: 'ournet',
    }));
    return collectConcepts(container, enumerator).then(() => delay(1000 * 5));
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
