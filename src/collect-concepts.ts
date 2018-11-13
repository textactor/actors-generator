
const debug = require('debug')('actors-generator');

import { TextEnumerator } from "./text-enumerator";
import { DataCollector } from "@textactor/actors-explorer";

export async function collectConcepts(collector: DataCollector, enumerator: TextEnumerator) {
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
                // debug('pre push text');
                await collector.pushText(text);
                // debug('post push text');
            }
            return start();
        });
    }

    await start();
}
