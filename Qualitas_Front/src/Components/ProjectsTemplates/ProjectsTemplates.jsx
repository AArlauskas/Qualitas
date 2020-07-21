import React, { Component } from 'react';
import Transfer from 'react-virtualized-transfer';


class ProjectsTemplates extends Component {
    constructor(props) {
        super(props);
        const dataSource = [];
        const targetKeys = [];
        this.props.templates.forEach(template => {
            dataSource.push({
                key: template.id,
                title: template.name,
            });
        });
        this.props.project.EvaluationTemplates.forEach(template => {
            targetKeys.push(template.id);
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
                this.props.addTemplate(this.props.project.id, _moveKeys);
            }
            else {
                this.props.removeTemplate(this.props.project.id, _moveKeys);
            }
            this.setState({ targetKeys: nextTargetKeys });
        }

        const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
            this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
        }
        return (
            <div>
                <div style={{ textAlign: "center" }}>
                    <h2>Project's name: {this.props.project.name}</h2>
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
                        titles={['Unassigned templates', 'Assigned templates']}
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

export default ProjectsTemplates;