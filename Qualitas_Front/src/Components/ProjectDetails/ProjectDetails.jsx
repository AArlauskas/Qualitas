import React from 'react';
import Transfer from 'react-virtualized-transfer';


export default class ProjectDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: [],
            targetKeys: [],
            dataSource: [],
        };
        this.getMock = this.getMock.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.getMock();
    }

    getMock() {
        const dataSource = [];
        const targetKeys = [];
        this.props.allUsers.forEach(user => {
            dataSource.push({
                key: user.id,
                title: user.firstname + " " + user.lastname,
            });
        });
        this.props.projectUsers.forEach(user => {
            targetKeys.push(user.id);
        });
        this.setState({
            dataSource,
            selectedKeys: [],
            targetKeys,
        });
    }

    filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
    }

    handleChange(nextTargetKeys, _direction, _moveKeys) {
        this.setState({ targetKeys: nextTargetKeys });
    }

    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    }

    render() {
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
                        onSelectChange={this.handleSelectChange}
                        filterOption={this.filterOption}
                        onChange={this.handleChange}
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