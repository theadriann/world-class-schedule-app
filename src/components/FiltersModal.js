//
import _ from "lodash";
import React from "react";
import styles from "./FiltersModal.module.css";

export default class FiltersModal extends React.Component {
    //

    get searchService() {
        return this.props.searchService;
    }

    get wcData() {
        return this.searchService.data;
    }

    onCheckboxChange = (option, category) => event => {
        const filters = this.props.filters.slice();
        const shouldAdd = event.target.checked;

        if (shouldAdd) {
            this.props.onFiltersChange(filters.concat([{ option, category }]));
            return;
        }

        const index = filters.findIndex(
            f => f.category === category && f.option === option
        );

        filters.splice(index, 1);

        this.props.onFiltersChange(filters);
    };

    render() {
        if (!this.props.open) {
            return null;
        }

        return (
            <div className={styles.overlay}>
                <div className={styles.container}>{this.renderContent()}</div>
            </div>
        );
    }

    renderContent() {
        return (
            <>
                {this.renderCloseButton()}
                {this.renderEvents()}
                {this.renderLocations()}
                {this.renderTrainers()}
            </>
        );
    }

    renderCloseButton() {
        return (
            <div className={styles.closeButton} onClick={this.props.onClose}>
                <svg viewBox="0 0 48 60" version="1.1" x="0px" y="0px">
                    <g
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                    >
                        <g fillRule="nonzero" fill="#ffffff">
                            <g>
                                <path d="M26.8284271,24 L33.1945062,30.3660791 C33.974385,31.1459579 33.9788821,32.4058942 33.1923882,33.1923882 C32.4113396,33.9734367 31.145329,33.9737561 30.3660791,33.1945062 L24,26.8284271 L17.6339209,33.1945062 C16.8540421,33.974385 15.5941058,33.9788821 14.8076118,33.1923882 C14.0265633,32.4113396 14.0262439,31.145329 14.8054938,30.3660791 L21.1715729,24 L14.8054938,17.6339209 C14.025615,16.8540421 14.0211179,15.5941058 14.8076118,14.8076118 C15.5886604,14.0265633 16.854671,14.0262439 17.6339209,14.8054938 L24,21.1715729 L30.3660791,14.8054938 C31.1459579,14.025615 32.4058942,14.0211179 33.1923882,14.8076118 C33.9734367,15.5886604 33.9737561,16.854671 33.1945062,17.6339209 L26.8284271,24 Z M24,48 C10.745166,48 0,37.254834 0,24 C0,10.745166 10.745166,0 24,0 C37.254834,0 48,10.745166 48,24 C48,37.254834 37.254834,48 24,48 Z M24,44 C35.045695,44 44,35.045695 44,24 C44,12.954305 35.045695,4 24,4 C12.954305,4 4,12.954305 4,24 C4,35.045695 12.954305,44 24,44 Z" />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        );
    }

    renderEvents() {
        return this.renderFilters({
            key: "title",
            name: "Classes",
            options: [...this.wcData.filters.events.values()]
        });
    }

    renderTrainers() {
        return this.renderFilters({
            key: "trainers",
            name: "Trainers",
            options: [...this.wcData.filters.trainers.values()]
        });
    }

    renderLocations() {
        return this.renderFilters({
            key: "location",
            name: "Locations",
            options: [...this.wcData.filters.locations.values()]
        });
    }

    renderFilters(opts) {
        const options = _.orderBy(opts.options);

        return (
            <div className={styles.category}>
                <div className={styles.categoryName}>{opts.name}</div>
                <div className={styles.options}>
                    {options.map((loc, idx) =>
                        this.renderOption(loc, opts.key, idx)
                    )}
                </div>
            </div>
        );
    }

    renderOption = (option, category, index) => {
        const isSelected =
            this.props.filters.findIndex(
                v => v.category === category && v.option === option
            ) !== -1;

        return (
            <label key={index} className={styles.option}>
                <input
                    type="checkbox"
                    value={option}
                    checked={isSelected}
                    onChange={this.onCheckboxChange(option, category)}
                />
                {option}
            </label>
        );
    };
}
