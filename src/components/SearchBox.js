import React from "react";
import styles from "./SearchBox.module.css";

export default class SearchBox extends React.Component {
    //

    // =======================
    // event handling methods
    // =======================

    onInputChange = event => this.props.onChange(event.target.value);

    // =======================
    // rendering methods
    // =======================

    render() {
        const { value, placeholder } = this.props;

        return (
            <div className={styles.container}>
                <input
                    value={value}
                    placeholder={placeholder}
                    onChange={this.onInputChange}
                />
                {this.renderFilterButton()}
            </div>
        );
    }

    renderFilterButton() {
        if (!this.props.showFilterButton) {
            return null;
        }

        return (
            <div className={styles.icon} onClick={this.props.onFiltersOpen}>
                <svg width="20" height="20" viewBox="0 0 1024 1024">
                    <path d="M918.244 68.324h-814.080c-0.504-0.018-1.095-0.028-1.69-0.028-28.277 0-51.2 22.923-51.2 51.2 0 14.113 5.71 26.892 14.946 36.153l-0.001-0.001 372.679 402.489v267.378c0 0.014 0 0.031 0 0.048 0 7.053 2.871 13.435 7.508 18.041l102.401 102.401c4.632 4.626 11.027 7.487 18.091 7.487 14.131 0 25.587-11.449 25.6-25.576v-379.734l363.52-392.533c9.266-9.266 14.998-22.066 14.998-36.205 0-28.277-22.923-51.2-51.2-51.2-0.553 0-1.104 0.009-1.652 0.026l0.080-0.002z"></path>
                </svg>
            </div>
        );
    }
}
