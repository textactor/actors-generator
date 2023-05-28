require("dotenv").config();

import { parseLocale, delay, Locale } from "./utils";

const locale = parseLocale(process.env.LOCALE) as Locale;

if (!locale) {
  throw new Error("LOCALE env is required!");
}

import logger from "./logger";

import { create, close } from "./data";
import { generateFromQueries } from "./generate-from-queries";

async function start() {
  logger.warn(
    `START collect-concepts-from-queries ${locale.lang}-${locale.country}`
  );
  const explorer = await create();

  return generateFromQueries(explorer, locale, process.env.FILE);
}

start()
  .then(() => logger.warn("END", locale))
  .catch((e) => logger.error(e))
  .then(() => close())
  .then(() => delay(3 * 1000))
  .then(() => process.exit());

process.on("uncaughtException", (error) => logger.error(error));
process.on("unhandledRejection", (error) => logger.error(error));
