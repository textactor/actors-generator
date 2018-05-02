
const debug = require('debug')('actors-generator');

import { ProcessConcepts, ConceptActor, WikiEntityType, WikiEntity as ConceptWikiEntity } from "@textactor/concept-domain";
import { Locale } from "./utils";
import { conceptRepository, conceptRootNameRepository, conceptWikiEntityRepository, wikiSearchNameRepository, wikiTitleRepository, actorRepository, actorNameRepository, wikiEntityRepository } from "./data";
import { SaveActor, KnownActorData, ActorType } from "@textactor/actor-domain";
import { NameHelper } from "@textactor/domain";
import { getGenerateOptions } from './generateOptions';
import { WikiEntity, CreatingWikiEntityData, WikiEntityHelper } from "@textactor/wikientity-domain";

export function generateActors(locale: Locale) {
    const processConcepts = new ProcessConcepts(locale,
        conceptRepository,
        conceptRootNameRepository,
        conceptWikiEntityRepository,
        wikiSearchNameRepository,
        wikiTitleRepository);

    const saveActor = new SaveActor(actorRepository, actorNameRepository);

    const processOptions = getGenerateOptions(locale.country);

    const onActor = (conceptActor: ConceptActor) => {
        if (!isValidActor(conceptActor)) {
            debug(`---   Invalid actor: ${conceptActor.name}, wiki=${!!conceptActor.wikiEntity}`);
            return;
        }
        // conceptActor.
        const actor = conceptActorToActor(conceptActor);
        debug(`+++   Adding new actor: ${actor.name}`);
        const tasks: Promise<any>[] = [saveActor.execute(actor)];
        if (conceptActor.wikiEntity) {
            tasks.push(saveWikiEntity(conceptActor.wikiEntity));
        }
        return Promise.all(tasks);
    }

    return processConcepts.execute(onActor, processOptions);
}

function saveWikiEntity(conceptEntity: ConceptWikiEntity): Promise<WikiEntity> {
    const knownData: CreatingWikiEntityData = {
        wikiDataId: conceptEntity.wikiDataId,
        wikiPageId: conceptEntity.wikiPageId,
        wikiPageTitle: conceptEntity.wikiPageTitle,
        about: conceptEntity.about,
        aliases: conceptEntity.aliases,
        categories: conceptEntity.categories,
        data: conceptEntity.data,
        description: conceptEntity.description,
        lang: conceptEntity.lang,
        name: conceptEntity.name,
        type: conceptEntity.type,
        types: conceptEntity.types,
    };

    const entity = WikiEntityHelper.create(knownData);

    return wikiEntityRepository.createOrUpdate(entity);
}

function isValidActor(conceptActor: ConceptActor) {
    if (!conceptActor || !conceptActor.wikiEntity) {
        return false;
    }

    if (!conceptActor.wikiEntity.type) {
        if (NameHelper.countWords(conceptActor.wikiEntity.name) < 2) {
            debug(`actor no type and too short: ${conceptActor.wikiEntity.name}`);
            return false;
        }
    }

    const lowerCaseNames = conceptActor.wikiEntity.names.filter(name => name.toLowerCase() === name);

    if (lowerCaseNames.length > conceptActor.wikiEntity.names.length / 3) {
        debug(`too many lowecase names: ${lowerCaseNames}`);
        return false;
    }
    return true;
}

function conceptActorToActor(conceptActor: ConceptActor) {
    const actorData: KnownActorData = {
        name: conceptActor.name,
        names: conceptActor.names.map(name => ({ name })),
        country: conceptActor.country,
        lang: conceptActor.lang,
        type: conceptActor.wikiEntity && wikiTypeToActorType(conceptActor.wikiEntity.type),
    };

    if (conceptActor.wikiEntity) {
        actorData.wikiEntity = {
            wikiDataId: conceptActor.wikiEntity.wikiDataId,
            description: conceptActor.wikiEntity.description,
            name: conceptActor.wikiEntity.name,
            wikiPageTitle: conceptActor.wikiEntity.wikiPageTitle,
            countryCode: conceptActor.wikiEntity.countryCode,
        };
    }

    return actorData;
}

function wikiTypeToActorType(wikiType: WikiEntityType): ActorType {
    switch (wikiType) {
        case WikiEntityType.EVENT: return ActorType.EVENT;
        case WikiEntityType.ORG: return ActorType.ORG;
        case WikiEntityType.PERSON: return ActorType.PERSON;
        case WikiEntityType.PLACE: return ActorType.PLACE;
        case WikiEntityType.PRODUCT: return ActorType.PRODUCT;
    }
}
