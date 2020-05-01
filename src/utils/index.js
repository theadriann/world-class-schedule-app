// utils
import _ from "lodash";

const strToDoc = str => {
    if (_.isArray(str)) {
        return str.map(part => _.lowerCase(part));
    }

    return _.lowerCase(str);
};

export { strToDoc };
