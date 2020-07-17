import React, { Component } from 'react';
import Transfer from 'react-virtualized-transfer';

class TemplateProjects extends Component {
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
        this.props.template.projects.forEach(project => {
            targetKeys.push(project.id);
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
                this.props.addProjectToTemplate(this.props.template.id, _moveKeys);
            }
            else {
                this.props.removeProjectFromTemplate(this.props.template.id, _moveKeys);
            }
            this.setState({ targetKeys: nextTargetKeys });
        }

        const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
            this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
        }
        return (
            <div>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <h2>Template name: {this.props.template.name}</h2>
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
            </div>
        );
    }
}

export default TemplateProjects;