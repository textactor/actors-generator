
const debug = require('debug')('actors-generator');

import { ConceptCollector } from '@textactor/concept-collector';
import { PushContextConcepts, ConceptContainer, ConceptContainerStatus } from '@textactor/concept-domain';
import { conceptRepository, conceptRootNameRepository, containerRepository } from "./data";
import { seriesPromise } from '@textactor/domain';
import { IConceptEnumerator } from "./conceptEnumerator";
import { KnownNameService } from '@textactor/known-names';
import logger from './logger';

export async function collectConcepts(container: ConceptContainer, enumerator: IConceptEnumerator) {
    const collector = new ConceptCollector(new PushContextConcepts(conceptRepository, conceptRootNameRepository),
        new KnownNameService());

    let countTexts = 0;

    function start(): Promise<any> {
        return enumerator.next().then(texts => {
            countTexts += texts.length;
            if (countTexts % 200 === 0) {
                debug(`processing ${countTexts} texts...`);
            }
            if (texts.length === 0) {
                return;
            }
            return seriesPromise(texts, text => collector.execute({
                text,
                lang: container.lang,
                country: container.country,
                containerId: container.id,
            }))
                .then(() => start());
        });
    }

    await containerRepository.update({ item: { id: container.id, status: ConceptContainerStatus.COLLECTING } });

    try {
        await start();
    } catch (e) {
        logger.error(e);
        const error = e.message;
        await containerRepository.update({
            item: {
                id: container.id, status: ConceptContainerStatus.COLLECT_ERROR,
                lastError: error
            }
        });
        return Promise.reject(e);
    }
    await containerRepository.update({ item: { id: container.id, status: ConceptContainerStatus.COLLECT_DONE } });
}
