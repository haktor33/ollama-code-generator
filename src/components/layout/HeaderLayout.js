import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import LanguageSwitcher from "components/switchers/LanguageSwitcher";

const { Header } = Layout;

const HeaderLayout = (props) => {

    return (
        <Header className="page-header" style={{ padding: 0, background: props.colorBgContainer, }}>
            <div>
            {React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => props.setCollapsed(!props.collapsed),
            })}
            <LanguageSwitcher/>
            </div>
        </Header>
    );

}

export default HeaderLayout;