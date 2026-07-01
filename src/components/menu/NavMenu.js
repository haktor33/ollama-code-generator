import React from "react";
import { Link } from "react-router-dom"
import { Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, } from '@ant-design/icons';
import i18n from "i18n";

const NavMenu = () => {

    return <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}
        items={[
            {
                key: '1',
                icon: <UserOutlined />,
                label: <Link to="/">{i18n.t("pages.home")}</Link>,
            },
            {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: <Link to="/Contact">{i18n.t("pages.contact")}</Link>,
            },
            {
                key: '3',
                icon: <UploadOutlined />,
                label: <Link to="/ReduxTestPage">{i18n.t("test")}</Link>,
            },
        ]}
    />
}

export default NavMenu;