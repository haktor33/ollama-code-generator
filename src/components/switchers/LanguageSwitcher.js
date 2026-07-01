import React from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { withTranslation } from 'react-i18next'
import { baseActions } from 'store/actions/base.actions';
import { Languages } from 'constants/system.constants';
import i18n from 'i18n'

const { Option } = Select;

const LanguageSwitcher = (props) => {

    const handleChange = (value) => {
        props.setLang(value)
    }

    return (
        <Select popupMatchSelectWidth={false} value={props.lang} size="small" onChange={handleChange}>
            {Object.keys(Languages).map(key => <Option key={key} value={Languages[key]}>{i18n.t(key.toLowerCase())}</Option>)}
        </Select>
    )
}

const mapStateToProps = (state) => {
    return { lang: state.base.lang };
};

const mapDispatchToProps = { setLang: baseActions.setLang };

export default compose(withTranslation(), connect(mapStateToProps, mapDispatchToProps))(LanguageSwitcher);