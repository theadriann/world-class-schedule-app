// utils
import _ from "lodash";
import React from "react";
import moment from "moment";
import { strToDoc } from "../utils/index";

export default class Schedule {
    //

    constructor(json, key, wc_data) {
        this.key = key;
        this.wc_data = wc_data;

        this.fromJSON(json);
    }

    exactSearch(value, field) {
        switch (field) {
            case "trainers":
                return (
                    this.trainers
                        .map(value => _.lowerCase(value))
                        .join(" ")
                        .indexOf(_.lowerCase(value)) !== -1
                );
            // .includes(_.lowerCase(value));

            case "location":
                return (
                    _.lowerCase(this.club.name).indexOf(_.lowerCase(value)) !==
                    -1
                );

            case "title":
                return (
                    _.lowerCase(this.name).indexOf(_.lowerCase(value)) !== -1
                );

            default:
                return false;
        }
    }

    filter(values, field) {
        switch (field) {
            case "trainers":
                return values.indexOf(this.trainers.join(" ")) !== -1;

            case "location":
                return values.indexOf(this.club.name) !== -1;

            case "title":
                return values.indexOf(this.name) !== -1;

            default:
                return false;
        }
    }

    toDoc() {
        let title = strToDoc(this.name);

        const bodyIndex = title.indexOf("body");
        if (bodyIndex === 0 && title[4] !== " ") {
            title = [title, ...[title.substring(0, 4), title.substring(4)]];
        }

        return {
            id: this.key,
            title: strToDoc(title),
            location: strToDoc(this.club.name),
            trainers: strToDoc(this.trainers)
        };
    }

    toJSON() {
        return {
            id: this.id,
            date: this.date,
            name: this.name,
            room: this.room,
            end_hour: this.end_hour,
            trainers: this.trainers,
            start_hour: this.start_hour
        };
    }

    fromJSON(json = {}) {
        this.id = json.id;
        this.date = json.date;
        this.name = json.name;
        this.room = json.room;
        this.clubid = json.clubid;
        this.end_hour = json.end_hour;
        this.trainers = json.trainers;
        this.start_hour = json.start_hour;

        this.location = this.club.name;
        this.startDate = moment(`${this.date} ${this.start_hour}`).toDate();
        this.endDate = moment(`${this.date} ${this.end_hour}`).toDate();
        this.title = (
            <div>
                <div>{this.name}</div>
                <div>{this.trainers.join(",")}</div>
                <div>{this.location}</div>
            </div>
        );

        // this.hour = json.hour;
        this.duration = json.duration;
    }

    get club() {
        return this.wc_data.clubs.get(this.clubid);
    }
}
