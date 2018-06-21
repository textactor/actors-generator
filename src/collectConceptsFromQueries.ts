
const debug = require('debug')('actors-generator');

import { ConceptContainerStatus, Locale, ConceptContainerHelper, ConceptHelper, RootNameHelper, ConceptContainer } from '@textactor/concept-domain';
import { containerRepository, conceptRepository, conceptRootNameRepository } from "./data";
import { seriesPromise } from '@textactor/domain';
import { queryWikidata } from './queryWikidata';
import { isWikidataId } from './utils';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import logger from './logger';

export async function collectConceptsFromQueries(locale: Locale, file?: string) {
    let files: string[]
    if (file) {
        files = [file];
    } else {
        let dir = join(__dirname, '..', 'data', 'queries', locale.lang);
        files = readdirSync(dir, 'utf8').map(file => join(dir, file));
        dir = join(dir, locale.country);
        files = files.concat(readdirSync(dir, 'utf8').map(file => join(dir, file)));
        files = files.filter(file => file.endsWith('.txt'));
    }

    const queries = files.map(file => ({ query: readFileSync(file, 'utf8'), file }));

    const container = await containerRepository.create(ConceptContainerHelper.build({
        name: `actors-generator-app`,
        uniqueName: `actors-generator-app-${Math.round(Date.now() / 1000)}`,
        lang: locale.lang,
        country: locale.country,
        ownerId: 'ournet',
    }));

    const map = new Map<string, boolean>();

    await seriesPromise(queries, query => collectConceptsByQuery(map, container, query.query, query.file));
}

async function collectConceptsByQuery(map: Map<string, boolean>, container: ConceptContainer, query: string, file: string) {
    logger.warn(`processing file: ${file}`);
    let items = await queryWikidata(query);

    items = items.filter(item => item.title
        && !isWikidataId(item.title)
        && item.title !== item.title.toLowerCase()
        && !item.title.includes('('));

    if (items.length === 0) {
        return;
    }

    await containerRepository.update({ item: { id: container.id, status: ConceptContainerStatus.COLLECTING } });

    let concepts = items.map(item => ConceptHelper.build({ containerId: container.id, name: item.title, lang: container.lang, country: container.country }))
        .filter(item => ConceptHelper.isValid(item));

    await seriesPromise(concepts, async concept => {
        if (map.has(concept.name)) {
            return;
        }
        map.set(concept.name, true);
        debug(`creating concept: ${concept.name}`);
        const rootName = RootNameHelper.build({ name: concept.name, lang: concept.lang, country: concept.country, containerId: concept.containerId });
        rootName.popularity = 30;
        concept.popularity = 30;
        try {
            await conceptRootNameRepository.create(rootName);
            await conceptRepository.create(concept);
        } catch (e) {
            debug(`error: ${e.message}`);
            logger.error(e);
        }
    });

    await containerRepository.update({ item: { id: container.id, status: ConceptContainerStatus.COLLECT_DONE } });
}
