import React, { Component } from 'react';
import Transfer from 'react-virtualized-transfer';

class TeamsProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: [],
            targetKeys: [],
            dataSource: [],
        };
        const dataSource = [];
        const targetKeys = [];
        let filteredProjects = this.props.projects;
        filteredProjects.forEach(project => {
            dataSource.push({
                key: project.id,
                title: project.name
            });
        });
        this.props.team.Projects.forEach(project => {
            targetKeys.push(project.id);
        });
        this.state = {
            selectedKeys: [],
            targetKeys: targetKeys,
            dataSource: dataSource,
        };
    }

    filterOption = (inputValue, option) => {
        return option.description.indexOf(inputValue) > -1;
    }

    handleChange = (nextTargetKeys, _direction, _moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
        if (_direction === "right") {
            this.props.addProjects(this.props.team.id, _moveKeys);
        }
        else {
            this.props.removeProjects(this.props.team.id, _moveKeys);
        }
    }

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    }

    render() {
        return (
            <div>
                <Transfer
                    render={item => `${item.title}`}
                    dataSource={this.state.dataSource}
                    targetKeys={this.state.targetKeys}
                    selectedKeys={this.state.selectedKeys}
                    onSelectChange={this.handleSelectChange}
                    filterOption={this.filterOption}
                    onChange={this.handleChange}
                    titles={['Unassigned projects', 'Assigned projects']}
                    className={'test'}
                    rowHeight={32}
                    listStyle={{
                        width: '100%',
                        height: 800,
                    }}
                    operations={['Remove from team', 'Assign/Add to team']}
                    showSearch
                    notFoundContent={'not found'}
                    searchPlaceholder={'Search'} />
            </div>
        );
    }
}

export default TeamsProjects;