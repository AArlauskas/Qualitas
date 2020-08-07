import React, { Component, forwardRef } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class ClientProjectReview extends Component {
    state = {
        columns: [
            {
                title: "Name", field: "name", render: rowData => rowData.firstname + " " + rowData.lastname,
                customFilterAndSearch: (term, rowData) => rowData.firstname.toLowerCase().startsWith(term.toLowerCase()) ||
                    rowData.lastname.toLowerCase().startsWith(term.toLowerCase())
            },
            {
                title: "Score", field: "score", render: rowData => isNaN(Math.trunc((rowData.score / rowData.points) * 100)) ? "0%" : Math.trunc((rowData.score / rowData.points) * 100) + "%",
                customFilterAndSearch: (term, rowData) => Math.trunc((rowData.score / rowData.points) * 100) === parseInt(term)
            },
            {
                title: "Evaluated cases", field: "caseCount", customFilterAndSearch: (term, rowData) => rowData.caseCount === parseInt(term)
            }
        ]
    }

    componentDidUpdate(prevProps) {
        if (prevProps.minDate !== this.props.minDate || prevProps.maxDate !== this.props.maxDate) {
            this.forceUpdate();
        }
    }

    render() {
        const tableIcons = {
            Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
            Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
            Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
        };


        return (
            <div>
                <div>
                    <MaterialTable
                        title="Project's users"
                        columns={this.state.columns}
                        icons={tableIcons}
                        data={this.props.users}
                        options={{
                            filtering: true,
                            actionsColumnIndex: -1,
                            pageSize: 10
                        }}
                        components={{
                            Toolbar: props => (
                                <div>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <MTableToolbar {...props} />
                                        <div style={{ marginLeft: 10 }}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="yyyy-MM-dd"
                                                margin="normal"
                                                label="Start date"
                                                value={this.props.minDate}
                                                maxDate={this.state.maxDate}
                                                onChange={e => this.props.setMinDate(e)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                            <KeyboardDatePicker
                                                style={{ marginLeft: 10 }}
                                                disableToolbar
                                                variant="inline"
                                                format="yyyy-MM-dd"
                                                margin="normal"
                                                label="End date"
                                                value={this.props.maxDate}
                                                minDate={this.props.minDate}
                                                maxDate={new Date()}
                                                onChange={e => this.props.setMaxDate(e)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </div>
                                    </MuiPickersUtilsProvider>
                                </div>

                            ),
                        }}
                        onRowClick={(event, rowData, togglePanel) => window.location.href = "/userDetails/" + rowData.id + "/" + this.props.projectId} />
                </div>
            </div>
        );
    }
}

export default ClientProjectReview;