// utils
import React from "react";

// components
import AddToCalendarHOC from "react-add-to-calendar-hoc";

class Button extends React.Component {
    //

    render() {
        return (
            <button
                className={this.props.buttonClassName}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>
        );
    }
}

class Dropdown extends React.Component {
    //

    render() {
        return <div>{this.props.children}</div>;
    }
}

// setup
const AddToCalendar = AddToCalendarHOC(Button, Dropdown);

// export
export default AddToCalendar;
