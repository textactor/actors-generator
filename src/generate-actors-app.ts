
require('dotenv').config();

import { parseLocale, Locale } from "./utils";

const locale = parseLocale(process.env.LOCALE) as Locale;

if (!locale) {
    throw new Error('LOCALE env is required!');
}

import logger from './logger';

import { initData, close, textactorExplorer } from "./data";
import { generateActors } from './generate-actors';
import { ConceptContainerStatus } from "textactor-explorer";

async function start() {
    logger.warn(`START generate-actors ${locale.lang}-${locale.country}`);
    await initData();

    const containers = await textactorExplorer.findDataContainer({
        ...locale,
        status: [
            ConceptContainerStatus.COLLECT_DONE,
            ConceptContainerStatus.COLLECT_ERROR,
            ConceptContainerStatus.GENERATE_ERROR,
            // ConceptContainerStatus.GENERATING,
        ],
        limit: 10,
    });

    if (!containers.length) {
        logger.warn(`No container found!`, locale);
        return;
    }

    for (let container of containers) {
        logger.warn(`Start processing container: ${container.uniqueName}: ${container.status}`);
        await generateActors(container);
    }
}

start()
    .then(() => logger.warn('END'))
    .catch(e => logger.error(e))
    .then(() => close())
    .then(() => process.exit());

process.on("uncaughtException", error => logger.error(error));
process.on("unhandledRejection", error => logger.error(error));
