require("dotenv").config();

import { parseLocale, Locale, delay } from "./utils";

const locale = parseLocale(process.env.LOCALE) as Locale;

if (!locale) {
  throw new Error("LOCALE env is required!");
}

import logger from "./logger";

import { close, create } from "./data";
import { generateActors } from "./generate-actors";
import { ConceptContainerStatus } from "@textactor/concept-domain";

async function start() {
  logger.warn(`START generate-actors ${locale.lang}-${locale.country}`);
  const explorer = await create();

  const containers = await explorer.findConceptContainer({
    ...locale,
    status: [
      ConceptContainerStatus.COLLECT_DONE,
      ConceptContainerStatus.COLLECT_ERROR,
      ConceptContainerStatus.GENERATE_ERROR
      // ConceptContainerStatus.GENERATING,
    ],
    limit: 10
  });

  if (!containers.length) {
    logger.warn(`No container found!`, locale);
    return;
  }

  for (let container of containers) {
    logger.warn(
      `Start processing container: ${container.uniqueName}: ${container.status}`
    );
    await generateActors(explorer, container, {
      minAbbrConceptPopularity: 2,
      minConceptPopularity: 5,
      minOneWordConceptPopularity: 10
    });
  }
}

start()
  .then(() => logger.warn("END", locale))
  .catch((e) => logger.error(e))
  .then(() => close())
  .then(() => delay(3 * 1000))
  .then(() => process.exit());

process.on("uncaughtException", (error) => logger.error(error));
process.on("unhandledRejection", (error) => logger.error(error));
