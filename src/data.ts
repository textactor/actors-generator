
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

export const textactorExplorer = explorer({
    dbConnectionString: process.env.CONCEPT_DB
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
