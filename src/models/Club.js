//

export default class Club {
    //

    constructor(json) {
        this.fromJSON(json);
    }

    toJSON() {
        return {
            id: this.id,
            city: this.city,
            name: this.name,
            shortName: this.shortName,
            resources: this.resources
        };
    }

    fromJSON(json = {}) {
        this.id = json.id;
        this.city = json.city;
        this.name = json.name;
        this.shortName = json.shortName;
        this.resources = json.resources;
    }
}
