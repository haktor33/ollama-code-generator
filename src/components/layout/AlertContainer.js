import React, { useEffect } from 'react';
import { notification } from 'antd';
import { connect } from "react-redux";
import { alertActions } from 'store/actions/alert.actions';

const AlertContainer = (props) => {

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (props.alert.message) {
            const { type, header, message } = props.alert;
            api[type]({
                message: header,
                description: message
            });
            setTimeout(() => props.clearAlert(), 700)
        }
        //eslint-disable-next-line
    }, [props.alert.message]);

    return <>{contextHolder}</>;
}

const stateCreators = state => {
    return { alert: state.alert };
}
const actionCreators = { clearAlert: alertActions.clear }

export default connect(stateCreators, actionCreators)(AlertContainer);