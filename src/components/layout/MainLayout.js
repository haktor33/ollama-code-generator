import React, {useState} from 'react';
import {Layout, theme} from 'antd';
import "styles/layout.css";
//import NavMenu from 'components/menu/NavMenu';
import AlertContainer from './AlertContainer';
import HeaderLayout from './HeaderLayout';
import {withTranslation} from 'react-i18next';

const {Content, Footer} = Layout;

const MainLayout = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const {token: {colorBgContainer},} = theme.useToken();

    return (
        <Layout hasSider>
            {/*<Sider trigger={null} collapsible collapsed={collapsed} className="page-sider">*/}
            {/*    <div className="logo" />*/}
            {/*    <NavMenu />*/}
            {/*</Sider>*/}
            <Layout className="site-layout">
                <HeaderLayout {...{collapsed, setCollapsed, colorBgContainer}} />
                <Content className="page-content" style={{background: colorBgContainer,}}>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        {props.children}
                    </React.Suspense>
                    <AlertContainer/>
                </Content>
                <Footer className="page-footer">
                    2025 Created by Haktor
                </Footer>
            </Layout>
        </Layout>
    );
};

export default withTranslation()(MainLayout);
