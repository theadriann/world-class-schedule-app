// components
import Paper from "@material-ui/core/Paper";
import SearchBox from "./components/SearchBox";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
    DayView,
    Toolbar,
    WeekView,
    Scheduler,
    TodayButton,
    Appointments,
    ViewSwitcher,
    DateNavigator,
    AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import AppointmentContentView from "./components/AppointmentContentView";
import FiltersModal from "./components/FiltersModal";

// utils
import _ from "lodash";
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";

// services
import WCDataService from "./services/WCData";
import SearchClassesService from "./services/SearchClasses";

// styles
import "reset-css";
import "./index.css";

const theme = createMuiTheme({ palette: { type: "dark", primary: red } });

class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: SearchClassesService.schedules,
            allData: SearchClassesService.schedules,
            searchText: "",
            filters: [],
        };

        this.commitSearch = _.throttle(this._commitSearch, 250);

        this.initServices();
    }

    initServices() {
        // fetch initial data
        WCDataService.fetch({
            start_date: moment().format("YYYY-MM-DD"),
            end_date: moment().add(7, "days").format("YYYY-MM-DD"),
        });

        // set wcdata
        SearchClassesService.setWCData(WCDataService);

        WCDataService.on("update", () => {
            this.setState({ allData: WCDataService.allSchedules });

            this._commitSearch(this.state.searchText);
        });
    }

    _commitSearch(text) {
        this.setState({
            data: SearchClassesService.filterAndSearch(
                text,
                this.state.filters
            ),
        });
    }

    onSearchBoxInputChange = (value) => {
        // set text
        this.setState({
            searchText: value,
        });

        // commit search
        this.commitSearch(value);
    };

    onFiltersChange = (filters) => {
        this.setState({ filters }, () => {
            this.commitSearch(this.state.searchText);
        });
    };

    onFiltersOpen = () => this.setState({ filtersOpen: true });

    onFiltersClose = () => this.setState({ filtersOpen: false });

    render() {
        const { data, filters, searchText } = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <Paper variant="outlined" square>
                    <SearchBox
                        value={searchText}
                        placeholder={`search for "bodypump"`}
                        showFilterButton={true}
                        onChange={this.onSearchBoxInputChange}
                        onFiltersOpen={this.onFiltersOpen}
                    />
                    <Scheduler
                        data={data}
                        firstDayOfWeek={new Date().getDay()}
                        rootComponent={SchedulerContainer}
                    >
                        <ViewState defaultCurrentViewName="Day" />
                        <DayView startDayHour={6} endDayHour={24} />
                        <WeekView startDayHour={6} endDayHour={24} />
                        <Toolbar />
                        <ViewSwitcher />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments />
                        <AppointmentTooltip
                            showOpenButton
                            showCloseButton
                            contentComponent={AppointmentContentView}
                        />
                    </Scheduler>
                    <FiltersModal
                        open={this.state.filtersOpen}
                        filters={filters}
                        searchService={SearchClassesService}
                        onFiltersChange={this.onFiltersChange}
                        onClose={this.onFiltersClose}
                    />
                </Paper>
            </MuiThemeProvider>
        );
    }
}

class SchedulerContainer extends React.Component {
    render() {
        return <div id="da">{this.props.children}</div>;
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
