import { createContext } from 'react';
import type {Task} from "../../types";

export type DrawerState = {
    taskOpen: boolean;
    taskTypeChoiceOpen: boolean;
    searchOpen: boolean;
    taskFormOpen: boolean;
};

export type DrawerContextType = {
    drawerState: DrawerState;
    openDrawer: (drawer: keyof DrawerState) => void;
    closeDrawer: (drawer: keyof DrawerState) => void;
    toggleDrawer: (drawer: keyof DrawerState) => void;
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
};

// Dummy-Defaultwerte für TypeScript
export const DrawerContext = createContext<DrawerContextType>({
    drawerState: {
        taskOpen: false,
        taskTypeChoiceOpen: false,
        searchOpen: false,
        taskFormOpen: false,
    },
    openDrawer: () => {},
    closeDrawer: () => {},
    toggleDrawer: () => {},
    selectedTask: null,
    setSelectedTask: () => {},
});
