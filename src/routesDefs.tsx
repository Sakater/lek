import {Homepage} from "./Homepage.tsx";
import {PDFCustomizer} from "./PDFCustomizer.tsx";
import {Overview} from "./pages/Overview.tsx";

export const routesDefs = [
    {
        path: '/',
        element: <Homepage/>
    },
    {
        path: '/editor',
        element: <PDFCustomizer/>
    },
    {
        path: '/overview',
        element: <Overview/>
    },
];
