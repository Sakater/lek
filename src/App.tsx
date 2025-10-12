import './App.css'
import React from "react";
import {FileContextProvider} from "./FileContext/FileContextProvider.tsx";
import {Homepage} from "./Homepage.tsx";

function App() {
    return (
        <FileContextProvider>
            <div className={'App'}>
                <Homepage/>
            </div>
        </FileContextProvider>

    )
}

export default App;
