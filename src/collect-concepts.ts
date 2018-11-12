
const debug = require('debug')('actors-generator');

import { IConceptEnumerator } from "./concept-enumerator";
import { DataCollector } from "@textactor/actors-explorer";

export async function collectConcepts(collector: DataCollector, enumerator: IConceptEnumerator) {
    let countTexts = 0;
    debug(`Start collectConcepts`)
    function start(): Promise<any> {
        debug(`re start collectConcepts`)
        return enumerator.next().then(async texts => {
            countTexts += texts.length;
            if (countTexts % 200 === 0) {
                debug(`processing ${countTexts} texts...`);
            }
            if (texts.length === 0) {
                return;
            }
            for (let text of texts) {
                await collector.pushText(text);
            }
            return start();
        });
    }

    await start();
}
