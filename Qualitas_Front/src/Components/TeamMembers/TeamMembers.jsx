import React, { Component } from 'react';
import Transfer from 'react-virtualized-transfer';

class TeamMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: [],
            targetKeys: [],
            dataSource: [],
        };
        const dataSource = [];
        const targetKeys = [];
        let filteredUsers = this.props.users.filter(user => user.isArchived === false).filter(user => user.teamId === null || user.teamId === this.props.team.id);
        filteredUsers.forEach(user => {
            dataSource.push({
                key: user.id,
                title: user.firstname + " " + user.lastname
            });
        });
        this.props.team.Users.forEach(user => {
            console.log(user);
            if (user.IsArchived === false) {
                targetKeys.push(user.id);
            }
        });
        this.state = {
            selectedKeys: [],
            targetKeys: targetKeys,
            dataSource: dataSource,
        };
        console.log(this.state);
    }
    filterOption = (inputValue, option) => {
        return option.description.indexOf(inputValue) > -1;
    }

    handleChange = (nextTargetKeys, _direction, _moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
        if (_direction === "right") {
            this.props.addTeamMembers(this.props.team.id, _moveKeys);
        }
        else {
            this.props.removeTeamMembers(this.props.team.id, _moveKeys);
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
                    titles={['Unassigned users', 'Assigned users']}
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

export default TeamMembers;