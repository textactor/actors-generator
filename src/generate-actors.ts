
const debug = require('debug')('actors-generator');

import {
    textactorExplorer,
    actorRepository,
    actorNameRepository,
    wikiEntityRepository,
} from "./data";
import { SaveActor, KnownActorData, ActorType, ActorNameType } from "@textactor/actor-domain";
import { NameHelper, uniqByProp } from "@textactor/domain";
import { getGenerateOptions } from './generate-options';
import {
    DataContainer,
    Actor as ConceptActor,
    WikiEntity as ConceptWikiEntity,
    WikiEntityType as ConceptWikiEntityType,
    ContainerExplorerOptions,
} from "textactor-explorer";
import { CreatingWikiEntityData, WikiEntity, WikiEntityHelper, WikiEntityType } from "@textactor/wikientity-domain";
import logger from "./logger";

export function generateActors(container: DataContainer, options?: ContainerExplorerOptions) {

    options = options || getGenerateOptions(container.country);

    const explorer = textactorExplorer.newExplorer(container.id, options);

    const saveActor = new SaveActor(actorRepository, actorNameRepository);

    const onActor = async (conceptActor: ConceptActor) => {
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
        await Promise.all(tasks);
    }

    explorer.onData(onActor);
    explorer.onError(error => logger.error(error));

    return new Promise((resolve) => {
        explorer.onEnd(resolve);
        explorer.start();
    });
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
        type: conceptWikiTypeToWikiType(conceptEntity.type),
        types: conceptEntity.types,
        countLinks: Object.keys(conceptEntity.links).length,
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
        names: [],
        country: conceptActor.country,
        lang: conceptActor.lang,
        type: conceptActor.wikiEntity && conceptWikiTypeToActorType(conceptActor.wikiEntity.type),
        wikiEntity: {
            wikiDataId: conceptActor.wikiEntity.wikiDataId,
            description: conceptActor.wikiEntity.description,
            name: conceptActor.wikiEntity.name,
            wikiPageTitle: conceptActor.wikiEntity.wikiPageTitle,
            countLinks: Object.keys(conceptActor.wikiEntity.links).length,
        }
    };

    actorData.names = conceptActor.wikiEntity.names.map(name => ({ name, type: ActorNameType.WIKI }));
    actorData.names = actorData.names.concat(conceptActor.names.map(name => ({ name, type: ActorNameType.SAME })));

    actorData.names = uniqByProp(actorData.names, 'name');

    return actorData;
}

function conceptWikiTypeToWikiType(wikiType: ConceptWikiEntityType): WikiEntityType {
    switch (wikiType) {
        case ConceptWikiEntityType.EVENT: return WikiEntityType.EVENT;
        case ConceptWikiEntityType.ORG: return WikiEntityType.ORG;
        case ConceptWikiEntityType.PERSON: return WikiEntityType.PERSON;
        case ConceptWikiEntityType.PLACE: return WikiEntityType.PLACE;
        case ConceptWikiEntityType.PRODUCT: return WikiEntityType.PRODUCT;
        case ConceptWikiEntityType.WORK: return WikiEntityType.WORK;
    }
}

function conceptWikiTypeToActorType(wikiType: ConceptWikiEntityType): ActorType {
    switch (wikiType) {
        case ConceptWikiEntityType.EVENT: return ActorType.EVENT;
        case ConceptWikiEntityType.ORG: return ActorType.ORG;
        case ConceptWikiEntityType.PERSON: return ActorType.PERSON;
        case ConceptWikiEntityType.PLACE: return ActorType.PLACE;
        case ConceptWikiEntityType.PRODUCT: return ActorType.PRODUCT;
        case ConceptWikiEntityType.WORK: return ActorType.WORK;
    }
}