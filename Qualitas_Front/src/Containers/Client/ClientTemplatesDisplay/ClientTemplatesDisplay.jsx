import React, { Component } from 'react';
import ClientTemplatesList from '../../../Components/Client/ClientTemplatesList/ClientTemplatesList';
import { connect } from "react-redux";
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
import { fetchClientTemplates } from '../../../Actions/TemplateDisplayActions';

class ClientTemplatesDisplay extends Component {
    state = {}
    componentDidMount() {
        let id = window.localStorage.getItem("id");
        this.props.fetchTemplates(id);
    }
    render() {
        return (
            <div>
                {console.log(this.props.templates)}
                {this.props.templates.length === 0 ? <LoadingScreen /> :
                    <div>
                        <ClientTemplatesList
                            templates={this.props.templates} />
                    </div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    templates: state.Templates
});

const mapDispatchToProps = (dispatch) => ({
    fetchTemplates: (id) => dispatch(fetchClientTemplates(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientTemplatesDisplay);