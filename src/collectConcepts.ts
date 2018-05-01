
const debug = require('debug')('actors-generator');

import { Locale } from "./utils";
import { ConceptCollector } from '@textactor/concept-collector';
import { PushContextConcepts } from '@textactor/concept-domain';
import { conceptRepository, conceptRootNameRepository } from "./data";
import { seriesPromise } from '@textactor/domain';
import { IConceptEnumerator } from "./conceptEnumerator";

export function collectConcepts(locale: Locale, enumerator: IConceptEnumerator) {
    const collector = new ConceptCollector(new PushContextConcepts(conceptRepository, conceptRootNameRepository));

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
                lang: locale.lang,
                country: locale.country,
            }))
                .then(() => start());
        });
    }

    return start();
}
