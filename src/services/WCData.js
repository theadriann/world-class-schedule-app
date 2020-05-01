// models
import Club from "../models/Club";
import Schedule from "../models/Schedule";
import EventEmitter from "../utils/EventEmitter";

class WCData extends EventEmitter {
    //

    constructor(data) {
        super();

        this.data = data;
        this.clubs = new Map();
        this.schedules = new Map();

        this.filters = {
            events: new Set(),
            trainers: new Set(),
            locations: new Set(),
        };

        if (data) {
            this.build(data);
        }
    }

    async fetch({ start_date, end_date }) {
        if (!start_date || !end_date) {
            return;
        }

        if (!process.env.REACT_APP_WC_API_URL) {
            return console.warn(
                'no "REACT_APP_WC_API_URL" env provided at build time'
            );
        }

        try {
            const res = await window.fetch(
                `${process.env.REACT_APP_WC_API_URL}/all?start_date=${start_date}&end_date=${end_date}`
            );
            const data = await res.json();

            this.build({ ...data });
        } catch (e) {
            console.log(e);
        }
    }

    build({ clubs, schedules }) {
        this.addClubs(clubs.map((club) => new Club(club)));
        this.addSchedules(
            schedules.map((schedule, key) => new Schedule(schedule, key, this))
        );

        this.schedules.forEach((schedule) => {
            // add location
            this.filters.locations.add(schedule.location);

            // add location
            schedule.trainers.forEach((trainer) =>
                this.filters.trainers.add(trainer)
            );

            // add name
            this.filters.events.add(schedule.name);
        });

        this.emit("update");
    }

    addClubs(clubs) {
        for (let club of clubs) {
            this.clubs.set(club.id, club);
        }
    }

    addSchedules(schedules) {
        for (let schedule of schedules) {
            this.schedules.set(schedule.id, schedule);
        }
    }

    get allClubs() {
        return [...this.clubs.values()];
    }

    get allSchedules() {
        return [...this.schedules.values()];
    }
}

export default new WCData();
