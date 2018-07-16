
// const debug = require('debug')('actors-generator');


import { textactorExplorer } from "./data";
import { queryWikidata } from './query-wikidata';
import { isWikidataId } from './utils';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import logger from './logger';
import { INewDataContainer } from "textactor-explorer";
import { generateActors } from "./generate-actors";

export async function generateFromQueries(locale: { lang: string, country: string }, file?: string) {
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

    const dataContainer = await textactorExplorer.newDataContainer({
        name: `actors-generator-app`,
        uniqueName: `actors-generator-app-${Math.round(Date.now() / 1000)}`,
        lang: locale.lang,
        country: locale.country,
        ownerId: 'ournet',
    });

    for (let query of queries) {
        try {
            await collectConceptsByQuery(dataContainer, query.query, query.file);
        } catch (e) {
            logger.error(`Error on file: ${query.file}`);
            logger.error(e);
        }
    }
    await dataContainer.end();

    logger.warn(`End collecting from files`);

    await generateActors(dataContainer.container(), {
        minAbbrConceptPopularity: 1,
        minConceptPopularity: 1,
        minOneWordConceptPopularity: 1,
        minRootAbbrConceptPopularity: 1,
        minRootConceptPopularity: 1,
        minRootOneWordConceptPopularity: 1,
    });
}

async function collectConceptsByQuery(container: INewDataContainer, query: string, file: string) {
    logger.warn(`processing file: ${file}`);
    let items = await queryWikidata(query);

    items = items.filter(item => item.title
        && !isWikidataId(item.title)
        && item.title !== item.title.toLowerCase()
        && !item.title.includes('('));

    if (items.length === 0) {
        return;
    }

    for (let item of items) {
        await container.pushTextNames([item.title]);
    }
}
