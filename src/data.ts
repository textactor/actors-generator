
if (!process.env.CONCEPT_DB) {
    throw new Error(`CONCEPT_DB is required!`);
}

const DB_CONNECTION = process.env.CONCEPT_DB;

import {
    createExplorer,
} from '@textactor/actors-explorer';

import {
    ActorNameRepositoryBuilder,
    ActorRepositoryBuilder,
} from '@textactor/actor-data';

import {
    WikiEntityRepositoryBuilder,
} from '@textactor/wikientity-data';

import {
    setLogger,
} from '@textactor/actor-domain';
import logger from './logger';
setLogger(logger);

import {
    ConceptContainerRepositoryBuilder,
    ConceptRepositoryBuilder,
    WikiEntityRepositoryBuilder as ConceptWikiEntityRepositoryBuilder,
    WikiSearchNameRepositoryBuilder,
    WikiTitleRepositoryBuilder,
    LearningTextRepositoryBuilder,
} from '@textactor/concept-data';

import DynamoDB = require('aws-sdk/clients/dynamodb');
import { MongoClient } from 'mongodb';
import {
    LearningTextRepository,
    ConceptContainerValidator,
    WikiEntityValidator as ConceptWikiEntityValidator,
    WikiSearchNameValidator,
    WikiTitleValidator,
    LearningTextValidator,
    ConceptValidator,
} from '@textactor/concept-domain';
import { LocaleCountryTagsService } from './country-tags-service';
import { KnownNameService } from '@textactor/known-names';

const dynamoDbClient = new DynamoDB.DocumentClient();

export const actorNameRepository = ActorNameRepositoryBuilder.build(dynamoDbClient);
export const actorRepository = ActorRepositoryBuilder.build(dynamoDbClient);
export const wikiEntityRepository = WikiEntityRepositoryBuilder.build(dynamoDbClient);

let mongoClient: MongoClient;
export let learningTextRepository: LearningTextRepository;

export async function create() {
    mongoClient = await MongoClient.connect(DB_CONNECTION);
    const mongoDb = mongoClient.db();

    const conceptContainerRepository = ConceptContainerRepositoryBuilder.build(mongoDb, new ConceptContainerValidator());
    const conceptRepository = ConceptRepositoryBuilder.build(mongoDb, new ConceptValidator());
    const conceptWikiEntityRepository = ConceptWikiEntityRepositoryBuilder.build(mongoDb, new ConceptWikiEntityValidator());
    const wikiSearchNameRepository = WikiSearchNameRepositoryBuilder.build(mongoDb, new WikiSearchNameValidator());
    const wikiTitleRepository = WikiTitleRepositoryBuilder.build(mongoDb, new WikiTitleValidator());

    learningTextRepository = LearningTextRepositoryBuilder.build(mongoDb, new LearningTextValidator());

    await Promise.all([
        actorNameRepository.createStorage(),
        actorRepository.createStorage(),
        wikiEntityRepository.createStorage(),
        conceptContainerRepository.createStorage(),
        conceptRepository.createStorage(),
        conceptWikiEntityRepository.createStorage(),
        wikiSearchNameRepository.createStorage(),
        wikiTitleRepository.createStorage(),
    ]);

    return createExplorer({
        conceptRep: conceptRepository,
        containerRep: conceptContainerRepository,
        entityRep: conceptWikiEntityRepository,
        searchNameRep: wikiSearchNameRepository,
        wikiTitleRep: wikiTitleRepository,
        countryTagsService: new LocaleCountryTagsService(),
        knownNameService: new KnownNameService(),
    })
}

export async function close() {
    if (mongoClient) {
        await mongoClient.close();
    }
}
