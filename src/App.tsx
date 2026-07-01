import './App.css'
import {useState} from "react";
import {FileContextProvider} from "./FileContext/FileContextProvider.tsx";
import {Route, Routes} from "react-router"
import {routesDefs} from "./routesDefs.tsx";
import {Sidebar} from "./navigation/Sidebar.tsx";
import "./navigation/Sidebar.css";

function App() {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    return (
        <FileContextProvider>
            <Sidebar expanded={sidebarExpanded} onToggle={setSidebarExpanded}/>
            <div className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
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
