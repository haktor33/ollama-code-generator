import React, { Component } from 'react';
import { Select } from 'antd';
import { boundSetLang, boundSetTheme } from 'store/actions/system.actions'
import { connect } from 'react-redux'
import { Themes } from "constants/system.constants";

const { Option } = Select;

class themeSwitcher extends Component {

    render() {
        const { theme } = this.props;
        document.body.className = theme;

        return (
            <Switcher currentTheme={theme} setCurrentTheme={this.props.setTheme} />
        )
    }
}

const stateCreators = (state) => {
    return { theme: state.system.theme };
};

const actionCreators = {
    setLang: boundSetLang,
    setTheme: boundSetTheme
};

export default connect(stateCreators, actionCreators)(themeSwitcher);


const Switcher = (props) => {

    const options = Themes.map(function (item) {
        return <Option key={item.name} value={item.name}>{item.displayName}</Option>;
    });

    return (
        <Select defaultValue={props.currentTheme} size="small" onChange={(value) => {console.log(value)}}>
            {options}
        </Select>
    );
};