
require('dotenv').config();

import { parseLocale } from "./utils";

const locale = parseLocale(process.env.LOCALE);

if (!locale) {
    throw new Error('LOCALE env is required!');
}

const debug = require('debug')('actors-generator');

import { initData, close, containerRepository } from "./data";
import { generateActors } from './generateActors';
import { ConceptContainerStatus, ConceptContainerHelper } from "@textactor/concept-domain";
import { seriesPromise } from "@textactor/domain";

async function start() {
    debug(`START ${locale.lang}-${locale.country}`);
    await initData();

    const containers = await containerRepository.getByStatus(locale, [ConceptContainerStatus.COLLECT_DONE]);

    return seriesPromise(containers, async container => {
        container = await containerRepository.getById(container.id);
        if (ConceptContainerHelper.canStartGenerate(container.status)) {
            debug(`Start processing container: ${container.uniqueName}: ${container.status}`);
            return generateActors(container);
        }
    });
}

start()
    .then(() => console.log('END'))
    .catch(e => console.error(e))
    .then(() => close())
    .then(() => process.exit());
