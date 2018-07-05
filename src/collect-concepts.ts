
const debug = require('debug')('actors-generator');

import { IConceptEnumerator } from "./concept-enumerator";
import { INewDataContainer } from 'textactor-explorer';

export async function collectConcepts(container: INewDataContainer, enumerator: IConceptEnumerator) {
    let countTexts = 0;

    function start(): Promise<any> {
        return enumerator.next().then(async texts => {
            countTexts += texts.length;
            if (countTexts % 200 === 0) {
                debug(`processing ${countTexts} texts...`);
            }
            if (texts.length === 0) {
                return;
            }
            for (let text of texts) {
                await container.pushText(text);
            }
            return start();
        });
    }

    await start();
}
