import React, { Component } from 'react';
import Transfer from 'react-virtualized-transfer';

class ProjectTeams extends Component {
    constructor(props) {
        super(props);
        const dataSource = [];
        const targetKeys = [];
        this.props.teams.forEach(team => {
            dataSource.push({
                key: team.id,
                title: team.name,
            });
        });
        this.props.project.Teams.forEach(team => {
            targetKeys.push(team.id);
        });
        this.state = {
            dataSource: dataSource,
            selectedKeys: [],
            targetKeys: targetKeys
        }
    }
    render() {
        const filterOption = (inputValue, option) => {
            return option.description.indexOf(inputValue) > -1;
        }

        const handleChange = (nextTargetKeys, _direction, _moveKeys) => {
            if (_direction === "right") {
                this.props.addTeam(this.props.project.id, _moveKeys);
            }
            else {
                this.props.removeTeam(this.props.project.id, _moveKeys);
            }
            this.setState({ targetKeys: nextTargetKeys });
        }

        const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
            this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
        }
        return (
            <div>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ color: "#F2F5F9" }}>Project's name: {this.props.project.name}</h2>
                </div>
                <div>
                    <span>Unassigned teams</span> <span style={{ float: "right" }}>Assigned teams</span>
                </div>
                <div>
                    <Transfer
                        render={item => `${item.title}`}
                        dataSource={this.state.dataSource}
                        targetKeys={this.state.targetKeys}
                        selectedKeys={this.state.selectedKeys}
                        onSelectChange={handleSelectChange}
                        filterOption={filterOption}
                        onChange={handleChange}
                        titles={['Unassigned teams', 'Assigned teams']}
                        className={'test'}
                        rowHeight={32}
                        listStyle={{
                            width: '100%',
                            height: 800,
                        }}
                        operations={['Remove from project', 'Assign/Add to project']}
                        showSearch
                        notFoundContent={'not found'}
                        searchPlaceholder={'Search'}
                    />
                </div>
            </div>
        );
    }
}

export default ProjectTeams;