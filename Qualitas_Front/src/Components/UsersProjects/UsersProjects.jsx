import React, { Component } from 'react';
import Transfer from 'react-virtualized-transfer';

class UsersProjects extends Component {
    constructor(props) {
        super(props);
        const dataSource = [];
        const targetKeys = [];
        this.props.projects.forEach(project => {
            dataSource.push({
                key: project.id,
                title: project.name,
            });
        });
        if (this.props.isClient) {
            if (this.props.user.clientProject !== null) {
                targetKeys.push(this.props.user.clientProject.id);
            }
        }
        else {
            this.props.user.projects.forEach(project => {
                targetKeys.push(project.id);
            });
        }
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
                if (this.props.isClient) {
                    if (nextTargetKeys.length === 1) {
                        this.props.addProjectToUser(this.props.user.id, _moveKeys[0], this.props.isClient)
                    }
                    else return;
                }
                else {
                    this.props.addProjectToUser(this.props.user.id, _moveKeys, this.props.isClient);
                }

            }
            else {
                if (this.props.isClient) {
                    this.props.removeProjectFromUser(this.props.user.id, _moveKeys[0], this.props.isClient);
                }
                else {
                    this.props.removeProjectFromUser(this.props.user.id, _moveKeys, this.props.isClient);
                }

            }
            this.setState({ targetKeys: nextTargetKeys });
        }

        const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
            this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
        }
        return (
            <div>
                <div style={{ textAlign: "center" }}>
                    <h2>{this.props.user.name}</h2>
                </div>
                <div>
                    <span>Unassigned projects</span> <span style={{ float: "right" }}>Assigned projects</span>
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
                        titles={['Unassigned projects', 'Assigned projects']}
                        className={'test'}
                        rowHeight={32}
                        listStyle={{
                            width: '100%',
                            height: 800,
                        }}
                        operations={['Remove project', 'Assign/Add project']}
                        showSearch
                        notFoundContent={'not found'}
                        searchPlaceholder={'Search'}
                    />
                </div>
            </div>
        );
    }
}

export default UsersProjects;