import {type ReactNode, useState} from 'react';
import type {DrawerContextType, DrawerState} from './index';
import {DrawerContext} from './index';

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
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
    const openDrawer = (drawer: keyof DrawerState) => {
        setDrawerState(prev => ({...prev, [drawer]: true}));
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
        selectedTaskId,
        setSelectedTaskId
    };

    return (
        <DrawerContext value={context}>
            {children}
        </DrawerContext>
    );
}
