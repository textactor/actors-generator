
require('dotenv').config();

import { parseLocale } from "./utils";

const locale = parseLocale(process.env.LOCALE);

if (!locale) {
    throw new Error('LOCALE env is required!');
}

const debug = require('debug')('actors-generator');

import { initData, close } from "./data";
import { generateActors } from './generateActors';

async function start() {
    debug(`START ${locale.lang}-${locale.country}`);
    await initData();

    return generateActors(locale);
}

start()
    .then(() => console.log('END'))
    .catch(e => console.error(e))
    .then(() => close())
    .then(() => process.exit());
