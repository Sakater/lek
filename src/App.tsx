import './App.css'
import {use} from "react";
import {FileContextProvider} from "./FileContext/FileContextProvider.tsx";
import {Route, Routes, useNavigate} from "react-router"
import {routesDefs} from "./routesDefs.tsx";
import {Button} from "antd";
import {HomeFilled} from "@ant-design/icons";
import {FileContext} from "./FileContext";

function App() {
    const {setOpenTemplateSearch} = use(FileContext);
    const navigate= useNavigate()
    return (
        <FileContextProvider>
            <div className={'App'}>
                <div className={'home-button'}>
                    <Button onClick={() => {
                        navigate('/')
                        setOpenTemplateSearch(false);
                    }} icon={<HomeFilled/>}/></div>
                <Routes>
                    {routesDefs.map(({path, element}) => (
                        <Route key={path} path={path} element={element}/>
                    ))}
                </Routes>
            </div>
        </FileContextProvider>

    )
}

export default App;
