// const debug = require('debug')('actors-generator');

import { queryWikidata } from "./query-wikidata";
import { isWikidataId } from "./utils";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import logger from "./logger";
import { generateActors } from "./generate-actors";
import { ExplorerApi, DataCollector } from "@textactor/actors-explorer";

export async function generateFromQueries(
  explorer: ExplorerApi,
  locale: { lang: string; country: string },
  file?: string
) {
  let files: string[];
  if (file) {
    files = [file];
  } else {
    let dir = join(__dirname, "..", "data", "queries", locale.lang);
    files = readdirSync(dir, "utf8").map((file) => join(dir, file));
    dir = join(dir, locale.country);
    files = files.concat(
      readdirSync(dir, "utf8").map((file) => join(dir, file))
    );
    files = files.filter((file) => file.endsWith(".txt"));
  }

  const queries = files.map((file) => ({
    query: readFileSync(file, "utf8"),
    file
  }));

  const dataContainer = await explorer.createCollector({
    name: `actors-generator-app`,
    uniqueName: `actors-generator-app-${Math.round(Date.now() / 1000)}`,
    lang: locale.lang,
    country: locale.country,
    ownerId: "ournet"
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

  await generateActors(explorer, dataContainer.container(), {
    minAbbrConceptPopularity: 1,
    minConceptPopularity: 1,
    minOneWordConceptPopularity: 1
  });
}

async function collectConceptsByQuery(
  collector: DataCollector,
  query: string,
  file: string
) {
  logger.warn(`processing file: ${file}`);
  let items = await queryWikidata(query);

  items = items.filter(
    (item) =>
      item.title &&
      !isWikidataId(item.title) &&
      item.title !== item.title.toLowerCase() &&
      !item.title.includes("(")
  );

  if (items.length === 0) {
    return;
  }

  for (let item of items) {
    await collector.pushTextNames([item.title]);
  }
}
