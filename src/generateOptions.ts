import { ProcessConceptsOptions } from "@textactor/concept-domain";

export function getGenerateOptions(country: string) {
    return OPTIONS[country] || DEFAULT_OPTIONS;
}

const DEFAULT_OPTIONS: ProcessConceptsOptions = {
    minConceptPopularity: 2,
    minAbbrConceptPopularity: 5,
    minOneWordConceptPopularity: 5,
    minRootConceptPopularity: 5,
    minRootAbbrConceptPopularity: 10,
    minRootOneWordConceptPopularity: 10,
};

const OPTIONS: { [country: string]: ProcessConceptsOptions } =
    {
        md: {
            minConceptPopularity: 2,
            minAbbrConceptPopularity: 5,
            minOneWordConceptPopularity: 5,
            minRootConceptPopularity: 5,
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
