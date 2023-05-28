import { ContainerExplorerOptions } from "@textactor/actors-explorer";

const GENERATE_ALL_CONCEPTS = process.env.GENERATE_ALL_CONCEPTS || "";

export function getGenerateOptions(country: string) {
  if (~["true", "True", "1", "yes"].indexOf(GENERATE_ALL_CONCEPTS)) {
    return {
      minConceptPopularity: 1,
      minAbbrConceptPopularity: 1,
      minOneWordConceptPopularity: 1
    };
  }
  return OPTIONS[country] || DEFAULT_OPTIONS;
}

const DEFAULT_OPTIONS: ContainerExplorerOptions = {
  minConceptPopularity: 2,
  minAbbrConceptPopularity: 5,
  minOneWordConceptPopularity: 5
};

const OPTIONS: { [country: string]: ContainerExplorerOptions } = {
  md: {
    minConceptPopularity: 2,
    minAbbrConceptPopularity: 5,
    minOneWordConceptPopularity: 5
  },
  ro: {
    minConceptPopularity: 2,
    minAbbrConceptPopularity: 5,
    minOneWordConceptPopularity: 5
  },
  ru: {
    minConceptPopularity: 2,
    minAbbrConceptPopularity: 5,
    minOneWordConceptPopularity: 5
  }
};
