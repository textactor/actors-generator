
require('dotenv').config();

import { parseLocale } from "./utils";

const locale = parseLocale(process.env.LOCALE);

if (!locale) {
    throw new Error('LOCALE env is required!');
}

import logger from './logger';

import { initData, close, containerRepository } from "./data";
import { generateActors } from './generateActors';
import { ConceptContainerStatus, ConceptContainerHelper } from "@textactor/concept-domain";
import { seriesPromise } from "@textactor/domain";

async function start() {
    logger.warn(`START generate-actors ${locale.lang}-${locale.country}`);
    await initData();

    const containers = await containerRepository.getByStatus(locale,
        [
            ConceptContainerStatus.COLLECT_DONE,
            ConceptContainerStatus.COLLECT_ERROR,
            ConceptContainerStatus.GENERATE_ERROR,
            ConceptContainerStatus.GENERATING,
        ]);

    return seriesPromise(containers, async container => {
        container = await containerRepository.getById(container.id);
        if (ConceptContainerHelper.canStartGenerate(container.status)) {
            logger.warn(`Start processing container: ${container.uniqueName}: ${container.status}`);
            return generateActors(container);
        }
    });
}

start()
    .then(() => logger.warn('END'))
    .catch(e => logger.error(e))
    .then(() => close())
    .then(() => process.exit());
