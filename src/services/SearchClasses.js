// utils
import _ from "lodash";
import elasticlunr from "elasticlunr";
import EventEmitter from "../utils/EventEmitter";

class SearchClasses extends EventEmitter {
    //

    constructor() {
        super();

        this.createIndex();
    }

    // =======================
    // data getters
    // =======================

    get schedules() {
        return this.data ? this.data.allSchedules : [];
    }

    // =======================
    // indexing methods
    // =======================

    createIndex() {
        this.index = elasticlunr(function() {
            this.addField("trainers");
            this.addField("location");
            this.addField("title");
            this.setRef("id");
        });
    }

    setWCData(data) {
        this.data = data;
        this.data.on("update", () => this.addData());
    }

    addData() {
        for (let i = 0; i < this.schedules.length; i++) {
            const schedule = this.schedules[i];

            this.index.addDoc(schedule.toDoc());
        }
    }

    // =======================
    // search methods
    // =======================

    filterAndSearch(text, filters) {
        const filterResults = this.filter(filters);

        if (!text) {
            return filterResults;
        }

        const searchResults = this.search(text);

        return _.intersectionBy(filterResults, searchResults, "id");
    }

    filter(filters) {
        const grouped = _.groupBy(filters, "category");

        return _.filter(this.schedules, result => {
            return _.reduce(
                grouped,
                (prev, curr, key) => {
                    return (
                        prev &&
                        result.filter(
                            curr.map(c => c.option),
                            key
                        )
                    );
                },
                true
            );
        });
    }

    search(str) {
        const fields = ["title", "location", "trainers"];
        const tokens = this.tokenize(str);

        // get all results per field
        let results = fields.map(field => this.searchField(field, tokens));

        // filter out empty results
        results = results.filter(res => res.length);

        // instersect cross-fields results
        results = _.intersectionBy(...results, "ref").map(({ ref }) => {
            return this.schedules[ref];
        });

        return results;
    }

    tokenize(text) {
        // const noQuotesFilterRegEx = /([A-Za-z0-9\@\.]+)/g;
        const withQuotesFilterRegEx = /"(.*?)"/g;

        let tokens = [];
        let queryInput = text;

        const addToken = (value, options) => tokens.push({ value, options });

        // get quoted tokens
        queryInput = queryInput.replace(
            withQuotesFilterRegEx,
            (match, value) => {
                addToken(value.replace(" ", "."), { exact: true });
                return "";
            }
        );

        // sanitize input
        queryInput = _.trim(queryInput);

        // add the rest of the input
        if (queryInput) {
            addToken(queryInput, {});
        }

        return tokens;
    }

    searchField(field, tokens) {
        return _.flatten(tokens.map(token => this.searchToken(token, field)));
    }

    searchToken(token, field) {
        const { value, options } = token;

        if (options.exact) {
            return this.searchExact(value, field);
        }

        return this.index.search(value, {
            fields: {
                [field]: { boost: 1, bool: "OR", expand: true }
            }
        });
    }

    searchExact(value, field) {
        return this.schedules.reduce((results, schedule) => {
            if (schedule.exactSearch(value, field)) {
                results.push({ ref: `${schedule.key}` });
            }

            return results;
        }, []);
    }
}

export default new SearchClasses();
