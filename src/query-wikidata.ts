
import fetch from 'node-fetch';

export type WikidataQueryEntity = {
    id: string
    title: string
}

export function queryWikidata(query: string): Promise<WikidataQueryEntity[]> {
    const url = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=' + encodeURIComponent(query);
    return fetch(url)
        .then(response => response.json())
        .then(json => {
            if (!json.results || !json.results.bindings || !json.results.bindings.length) {
                return [];
            }

            let items: WikidataQueryEntity[] = json.results.bindings.filter((it: any) => it.itemTitle && it.itemTitle['xml:lang'] && it.itemTitle.value)
                .map((it: any) => ({
                    id: it.item.value.substr(it.item.value.indexOf('/entity/') + 8),
                    title: it.itemTitle.value
                }));

            return items;
        });
}
