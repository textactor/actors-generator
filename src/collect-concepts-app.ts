require("dotenv").config();

import { parseLocale, Locale, delay } from "./utils";

const locale = parseLocale(process.env.LOCALE) as Locale;

if (!locale) {
  throw new Error("LOCALE env is required!");
}

const sourceName = process.env.SOURCE as string;

import logger from "./logger";

import { collectConcepts } from "./collect-concepts";
import { create, close } from "./data";
import { WebsiteTextEnumerator } from "./website-text-enumerator";
import { DbTextEnumerator } from "./db-text-enumerator";
import { TextEnumerator } from "./text-enumerator";

async function start() {
  logger.warn(`START collect-concepts ${locale.lang}-${locale.country}`);
  const explorer = await create();
  const enumerator = createEnumerator();
  const container = await explorer.createCollector({
    name: `actors-generator-app`,
    uniqueName: `actors-generator-app-${Math.round(Date.now() / 1000)}`,
    lang: locale.lang,
    country: locale.country,
    ownerId: "ournet"
  });
  await collectConcepts(container, enumerator);
  await container.end();
  await close();
}

function createEnumerator(): TextEnumerator {
  if (~["website", "site"].indexOf(sourceName)) {
    return WebsiteTextEnumerator.createFromEnv();
  }
  return DbTextEnumerator.createFromEnv(locale);
}

start()
  .then(() => logger.warn("END", locale))
  .catch((e) => logger.error(e))
  .then(() => close())
  .then(() => delay(3 * 1000))
  .then(() => process.exit());

process.on("uncaughtException", (error) => logger.error(error));
process.on("unhandledRejection", (error) => logger.error(error));
