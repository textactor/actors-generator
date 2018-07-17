import { ContainerExplorerOptions } from "textactor-explorer";

const GENERATE_ALL_CONCEPTS = process.env.GENERATE_ALL_CONCEPTS || '';

export function getGenerateOptions(country: string) {
    if (~['true', 'True', '1', 'yes'].indexOf(GENERATE_ALL_CONCEPTS)) {
        return {
            minConceptPopularity: 1,
            minAbbrConceptPopularity: 1,
            minOneWordConceptPopularity: 1,
            minRootConceptPopularity: 1,
            minRootAbbrConceptPopularity: 1,
            minRootOneWordConceptPopularity: 1,
        }
    }
    return OPTIONS[country] || DEFAULT_OPTIONS;
}

const DEFAULT_OPTIONS: ContainerExplorerOptions = {
    minConceptPopularity: 2,
    minAbbrConceptPopularity: 5,
    minOneWordConceptPopularity: 5,
    minRootConceptPopularity: 5,
    minRootAbbrConceptPopularity: 10,
    minRootOneWordConceptPopularity: 10,
};

const OPTIONS: { [country: string]: ContainerExplorerOptions } =
{
    md: {
        minConceptPopularity: 2,
        minAbbrConceptPopularity: 5,
        minOneWordConceptPopularity: 5,
        minRootConceptPopularity: 2,
        minRootAbbrConceptPopularity: 10,
        minRootOneWordConceptPopularity: 10,
    },
    ro: {
        minConceptPopularity: 2,
        minAbbrConceptPopularity: 5,
        minOneWordConceptPopularity: 5,
        minRootConceptPopularity: 5,
        minRootAbbrConceptPopularity: 15,
        minRootOneWordConceptPopularity: 15,
    },
    ru: {
        minConceptPopularity: 2,
        minAbbrConceptPopularity: 5,
        minOneWordConceptPopularity: 5,
        minRootConceptPopularity: 5,
        minRootAbbrConceptPopularity: 15,
        minRootOneWordConceptPopularity: 15,
    }
};
