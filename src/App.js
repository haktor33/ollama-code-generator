import React from "react"
import MainLayout from "components/layout/MainLayout";
import { MainRoutes } from 'router/main.routes'


const App = () => {

    return (
        <MainLayout>
            {MainRoutes}
        </MainLayout>
    );
};
export default App;
