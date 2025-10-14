import React, {ReactNode, useState} from 'react';
import type {DrawerContextType, DrawerState} from './index';
import {DrawerContext} from './index';
import type {Task} from "../../types";

type Props = {
    children: ReactNode;
};

export function DrawerContextProvider({children}: Props) {
    const [drawerState, setDrawerState] = useState<DrawerState>({
        taskOpen: false,
        taskTypeChoiceOpen: false,
        searchOpen: false,
        taskFormOpen: false,
    });
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const openDrawer = (drawer: keyof DrawerState) => {
        setDrawerState(prev => ({...prev, [drawer]: true}));
        console.log(`Opened drawer: ${drawer}`); // Debug-Ausgabe
        console.log('states: ', drawerState); // Debug-Ausgabe
    };

    const closeDrawer = (drawer: keyof DrawerState) => {
        setDrawerState(prev => ({...prev, [drawer]: false}));
    };

    const toggleDrawer = (drawer: keyof DrawerState) => {
        setDrawerState(prev => ({...prev, [drawer]: !prev[drawer]}));
    };

    const context: DrawerContextType = {
        drawerState,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        selectedTask,
        setSelectedTask
    };

    return (
        <DrawerContext value={context}>
            {children}
        </DrawerContext>
    );
}
