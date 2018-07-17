
if (!process.env.CONCEPT_DB) {
    throw new Error(`CONCEPT_DB is required!`);
}

const DB_CONNECTION = process.env.CONCEPT_DB;

import {
    explorer,
} from 'textactor-explorer';

import {
    ActorModel,
    ActorNameModel,
    ActorNameRepository,
    ActorRepository,
    createTables as actorsCreateTables,
} from '@textactor/actor-data';

import {
    WikiEntityModel,
    WikiEntityRepository,
    createTables as wikiEntityCreateTables,
} from '@textactor/wikientity-data';

import {
    setLogger
} from '@textactor/actor-domain';
import logger from './logger';

setLogger(logger);

export const textactorExplorer = explorer({
    dbConnectionString: DB_CONNECTION
});

export const wikiEntityRepository = new WikiEntityRepository(new WikiEntityModel());
export const actorNameRepository = new ActorNameRepository(new ActorNameModel());
export const actorRepository = new ActorRepository(new ActorModel());

export function initData() {
    return Promise.all([actorsCreateTables(), wikiEntityCreateTables()]);
}

export function close() {
    return textactorExplorer.closeDatabase();
}
