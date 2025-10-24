import {Homepage} from "./Homepage.tsx";
import {PDFCustomizer} from "./PDFCustomizer.tsx";
import {PDFExportView} from "./view/PDFExportView.tsx";

export const routesDefs = [
    {
        path: '/',
        element: <Homepage/>
    },
    {
        path:'/editor',
        element: <PDFCustomizer/>
    },
    {
        path: '/export',
        element: <PDFExportView />
    }
]