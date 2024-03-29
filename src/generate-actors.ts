const debug = require("debug")("actors-generator");

import {
  actorRepository,
  actorNameRepository,
  wikiEntityRepository
} from "./data";
import {
  SaveActor,
  BuildActorParams,
  ActorType,
  ActorNameType
} from "@textactor/actor-domain";
import { NameHelper } from "@textactor/domain";
import { getGenerateOptions } from "./generate-options";
import {
  WikiEntity as ConceptWikiEntity,
  WikiEntityType as ConceptWikiEntityType,
  ConceptContainer
} from "@textactor/concept-domain";
import {
  WikiEntity,
  WikiEntityHelper,
  WikiEntityType,
  BuildWikiEntityParams
} from "@textactor/wikientity-domain";
import logger from "./logger";
import { delay } from "./utils";
import {
  ContainerExplorerOptions,
  ExplorerApi,
  Actor as ConceptActor
} from "@textactor/actors-explorer";

export function generateActors(
  explorerApi: ExplorerApi,
  container: ConceptContainer,
  options: ContainerExplorerOptions
) {
  options = options || getGenerateOptions(container.country);

  const explorer = explorerApi.createContainerExplorer(container.id, options);

  const saveActor = new SaveActor(actorRepository, actorNameRepository);
  let countAdded = 0;

  const onActor = async (conceptActor: ConceptActor) => {
    if (!isValidActor(conceptActor)) {
      debug(
        `---   Invalid actor: ${
          conceptActor.name
        }, wiki=${!!conceptActor.wikiEntity}`
      );
      return;
    }

    const actor = conceptActorToActor(conceptActor);
    debug(`+++   Adding new actor: ${actor.name}`);

    countAdded++;

    if (countAdded % 50 === 0) {
      logger.warn(`Added ${countAdded} actors`, {
        id: container.id,
        lang: container.lang,
        country: container.country
      });
    }

    const tasks: Promise<any>[] = [saveActor.execute(actor)];
    if (conceptActor.wikiEntity) {
      tasks.push(saveWikiEntity(conceptActor.wikiEntity));
    }
    await Promise.all(tasks);
    await delay(300);
  };

  explorer.onData(onActor);
  explorer.onError((error) => logger.error(error));

  return new Promise((resolve) => {
    explorer.onEnd(() => resolve(null));
    logger.warn(`Starting generating actors for: ${container.uniqueName}`);
    explorer.start();
  });
}

function saveWikiEntity(conceptEntity: ConceptWikiEntity): Promise<WikiEntity> {
  const knownData: BuildWikiEntityParams = {
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
    countLinks: Object.keys(conceptEntity.links).length
  };

  if (knownData.aliases) {
    knownData.aliases = knownData.aliases.filter(
      (item) => item.trim().length > 1
    );
  }

  const entity = WikiEntityHelper.build(knownData);

  return wikiEntityRepository.createOrUpdate(entity);
}

function isValidActor(conceptActor: ConceptActor) {
  if (!conceptActor || !conceptActor.wikiEntity) {
    return false;
  }

  const nameCountWords = Math.min(
    NameHelper.countWords(conceptActor.wikiEntity.name),
    NameHelper.countWords(conceptActor.name)
  );

  if (nameCountWords < 2) {
    if (!conceptActor.wikiEntity.type) {
      logger.warn(
        `actor no type and too short: ${conceptActor.wikiEntity.name}`
      );
      return false;
    }
    const isLocale = conceptActor.wikiEntity.countryCodes.includes(
      conceptActor.country
    );
    const countLinks = Object.keys(conceptActor.wikiEntity.links).length;

    if (!isLocale && countLinks < 10) {
      logger.warn(`actor too short name & not popular: ${conceptActor.name}`);
      return false;
    }
  }

  // const lowerCaseNames = conceptActor.wikiEntity.names.filter(name => name.toLowerCase() === name);

  // if (lowerCaseNames.length > conceptActor.wikiEntity.names.length / 3) {
  //     debug(`too many lowecase names: ${lowerCaseNames}`);
  //     return false;
  // }
  return true;
}

function conceptActorToActor(conceptActor: ConceptActor) {
  if (!conceptActor.wikiEntity) {
    throw new Error(`No conceptActor.wikiEntity`);
  }
  const actorData: BuildActorParams = {
    name: conceptActor.name,
    names: conceptActor.names.map((item) => ({
      name: item.name,
      popularity: item.popularity,
      type: item.type as ActorNameType
    })),
    country: conceptActor.country,
    lang: conceptActor.lang,
    type:
      conceptActor.wikiEntity &&
      conceptWikiTypeToActorType(conceptActor.wikiEntity.type),
    commonName: conceptActor.commonName,
    abbr: conceptActor.abbr,
    wikiEntity: {
      wikiDataId: conceptActor.wikiEntity.wikiDataId,
      description: conceptActor.wikiEntity.description,
      name: conceptActor.wikiEntity.name,
      wikiPageTitle: conceptActor.wikiEntity.wikiPageTitle,
      countLinks: Object.keys(conceptActor.wikiEntity.links).length,
      countryCodes: conceptActor.wikiEntity.countryCodes
    }
  };

  if (conceptActor.wikiEntity) {
    const links = conceptActor.wikiEntity.links;
    if (links && links["en"]) {
      actorData.englishName = links["en"].trim();
    }
  }

  return actorData;
}

function conceptWikiTypeToWikiType(
  wikiType: ConceptWikiEntityType | undefined
) {
  switch (wikiType) {
    case ConceptWikiEntityType.EVENT:
      return WikiEntityType.EVENT;
    case ConceptWikiEntityType.ORG:
      return WikiEntityType.ORG;
    case ConceptWikiEntityType.PERSON:
      return WikiEntityType.PERSON;
    case ConceptWikiEntityType.PLACE:
      return WikiEntityType.PLACE;
    case ConceptWikiEntityType.PRODUCT:
      return WikiEntityType.PRODUCT;
    case ConceptWikiEntityType.WORK:
      return WikiEntityType.WORK;
    default:
      return undefined;
  }
}

function conceptWikiTypeToActorType(
  wikiType: ConceptWikiEntityType | undefined
) {
  switch (wikiType) {
    case ConceptWikiEntityType.EVENT:
      return ActorType.EVENT;
    case ConceptWikiEntityType.ORG:
      return ActorType.ORG;
    case ConceptWikiEntityType.PERSON:
      return ActorType.PERSON;
    case ConceptWikiEntityType.PLACE:
      return ActorType.PLACE;
    case ConceptWikiEntityType.PRODUCT:
      return ActorType.PRODUCT;
    case ConceptWikiEntityType.WORK:
      return ActorType.WORK;
    default:
      return undefined;
  }
}
