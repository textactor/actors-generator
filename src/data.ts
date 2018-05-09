
import {
    createConnection,
    ConceptRepository,
    ConceptRootNameRepository,
    ConceptModel,
    ConceptRootNameModel,
    WikiSearchNameModel,
    WikiSearchNameRepository,
    WikiTitleModel,
    WikiEntityModel as ConceptWikiEntityModel,
    WikiTitleRepository,
    WikiEntityRepository as ConceptWikiEntityRepository,
    ConceptContainerModel,
    ConceptContainerRepository,
} from '@textactor/concept-data';

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

const conceptConnection = createConnection(process.env.CONCEPT_DB);

export const conceptRepository = new ConceptRepository(new ConceptModel(conceptConnection));
export const conceptRootNameRepository = new ConceptRootNameRepository(new ConceptRootNameModel(conceptConnection));
export const wikiSearchNameRepository = new WikiSearchNameRepository(new WikiSearchNameModel(conceptConnection));
export const wikiTitleRepository = new WikiTitleRepository(new WikiTitleModel(conceptConnection));
export const conceptWikiEntityRepository = new ConceptWikiEntityRepository(new ConceptWikiEntityModel(conceptConnection));
export const containerRepository = new ConceptContainerRepository(new ConceptContainerModel(conceptConnection));

export const wikiEntityRepository = new WikiEntityRepository(new WikiEntityModel());
export const actorNameRepository = new ActorNameRepository(new ActorNameModel());
export const actorRepository = new ActorRepository(new ActorModel());

export function initData() {
    return Promise.all([actorsCreateTables(), wikiEntityCreateTables()]);
}

export function close() {
    return conceptConnection.close();
}
