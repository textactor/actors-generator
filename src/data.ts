
import {
    createConnection,
    ConceptRepository,
    ConceptRootNameRepository,
    ConceptModel,
    ConceptRootNameModel,
    WikiSearchNameModel,
    WikiSearchNameRepository,
    WikiTitleModel,
    WikiEntityModel,
    WikiTitleRepository,
    WikiEntityRepository,
} from '@textactor/concept-data';

import {
    ActorModel,
    ActorNameModel,
    ActorNameRepository,
    ActorRepository,
    createTables,
} from '@textactor/actor-data';

const conceptConnection = createConnection(process.env.CONCEPT_DB);

export const conceptRepository = new ConceptRepository(new ConceptModel(conceptConnection));
export const conceptRootNameRepository = new ConceptRootNameRepository(new ConceptRootNameModel(conceptConnection));
export const wikiSearchNameRepository = new WikiSearchNameRepository(new WikiSearchNameModel(conceptConnection));
export const wikiTitleRepository = new WikiTitleRepository(new WikiTitleModel(conceptConnection));
export const wikiEntityRepository = new WikiEntityRepository(new WikiEntityModel(conceptConnection));

export const actorNameRepository = new ActorNameRepository(new ActorNameModel());
export const actorRepository = new ActorRepository(new ActorModel());

export function initData() {
    return createTables();
}

export function close() {
    return conceptConnection.close();
}
