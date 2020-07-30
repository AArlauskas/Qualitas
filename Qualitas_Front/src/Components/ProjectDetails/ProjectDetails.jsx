import React from 'react';
import Transfer from 'react-virtualized-transfer';


export default class ProjectDetails extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = [];
        const targetKeys = [];
        this.props.users.forEach(user => {
            dataSource.push({
                key: user.id,
                title: user.firstname + " " + user.lastname,
            });
        });
        this.props.project.Users.forEach(user => {
            targetKeys.push(user.id);
        });
        console.log(dataSource);
        console.log(targetKeys);
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
                this.props.addProjectMembers(this.props.project.id, _moveKeys);
            }
            else {
                this.props.removeProjectMembers(this.props.project.id, _moveKeys);
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
                    <span>Unassigned users</span> <span style={{ float: "right" }}>Assigned users</span>
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
                        titles={['Unassigned users', 'Assigned users']}
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