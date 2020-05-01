// utils
import _ from "lodash";
import React from "react";
import moment from "moment";
import "moment-duration-format";

// components
import AddToCalendar from "./AddToCalendar";

// styles
import styles from "./AppointmentContentView.module.css";

const isMobile = () =>
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(
        window.navigator.userAgent || window.navigator.vendor || window.opera
    );

export default class AppointmentContentView extends React.Component {
    //

    get data() {
        return this.props.appointmentData;
    }

    get vEvent() {
        const FORMAT = "YYYYMMDDTHHmmss";
        const trainersText = _.upperCase(this.data.trainers.join(" "));
        const eventTitle = _.upperCase(this.data.name);
        const locationText = _.upperCase(this.data.location);
        const roomText = _.upperCase(this.data.room);

        const content = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            `URL:${document.URL}`,
            "METHOD:PUBLISH",
            `DTSTART;TZID=Europe/Bucharest:${moment(this.data.startDate).format(
                FORMAT
            )}`,
            `DTEND;TZID=Europe/Bucharest:${moment(this.data.endDate).format(
                FORMAT
            )}`,
            `SUMMARY:${eventTitle} | ${trainersText}`,
            `DESCRIPTION:`,
            `LOCATION:${locationText} | ${roomText}`,
            `END:VEVENT`,
            `END:VCALENDAR`
        ].join("\n");

        return isMobile()
            ? encodeURI(`data:text/calendar;charset=utf8,${content}`)
            : content;
    }

    render() {
        return (
            <div className={styles.container}>
                {this.renderName()}
                <div className={styles.where}>
                    {this.renderLocation()}
                    <span> in </span>
                    {this.renderRoom()}
                </div>
                {this.renderTrainers()}

                <div className={styles.at}>
                    {this.renderDate()}
                    <div> · </div>
                    {this.renderStartTime()}
                    <div> to </div>
                    {this.renderEndTime()}
                </div>

                {this.renderAddToCalendarV2()}
            </div>
        );
    }

    renderDate() {
        return (
            <div className={styles.date}>
                {moment(this.data.date).format("DD MMM YYYY")}
            </div>
        );
    }

    renderLocation() {
        return <div className={styles.location}>{this.data.location}</div>;
    }

    renderName() {
        return <div className={styles.name}>{this.data.name}</div>;
    }

    renderRoom() {
        return <div className={styles.room}>{this.data.room}</div>;
    }

    renderTrainers() {
        return (
            <div className={styles.trainers}>
                {this.data.trainers.map(this.renderTrainer)}
            </div>
        );
    }

    renderTrainer = trainer => {
        return (
            <div key={trainer} className={styles.trainer}>
                {trainer
                    .split(" ")
                    .map(_.capitalize)
                    .join(" ")}
            </div>
        );
    };

    renderStartTime() {
        return (
            <div className={styles.startTime}>
                {moment(this.data.startDate).format("HH:mm")}
            </div>
        );
    }

    renderEndTime() {
        return (
            <div className={styles.endTime}>
                {moment(this.data.endDate).format("HH:mm")}
            </div>
        );
    }

    renderAddToCalendarV2() {
        return (
            <a href={this.vEvent} className={styles.eventButton}>
                Add To Calendar
            </a>
        );
    }

    renderAddToCalendar() {
        const FORMAT = "YYYYMMDDTHHmmss";
        const duration = moment
            .duration(this.data.duration, "minutes")
            .format("H:mm");

        const trainersText = _.upperCase(this.data.trainers.join(" "));
        const eventTitle = `${_.upperCase(this.data.name)} | ${trainersText}`;
        const eventLocation = `${_.upperCase(
            this.data.location
        )} | ${_.upperCase(this.data.room)}`;

        return (
            <AddToCalendar
                event={{
                    title: eventTitle,
                    duration: duration,
                    location: eventLocation,
                    timezone: "Europe/Bucharest",
                    endDatetime: moment(this.data.endDate).format(FORMAT),
                    startDatetime: moment(this.data.startDate).format(FORMAT)
                }}
            />
        );
    }
}
