//PdfContext/index.tsx
import { createContext, useRef, ReactNode } from 'react';
import jsPDF from 'jspdf';

type PdfContextType = {
    contentRef: React.RefObject<HTMLDivElement>;
    savePdf: (filename?: string) => void;
}

export const PdfContext = createContext<PdfContextType>({
    contentRef: { current: null },
    savePdf: () => {}
});

type Props = {
    children: ReactNode;
}

export function PdfProvider({ children }: Props) {
    const contentRef = useRef<HTMLDivElement>(null);

    const savePdf = (filename: string = 'worksheet.pdf') => {
        if (!contentRef.current) {
            console.error('Content reference not found');
            return;
        }

        const doc = new jsPDF({ unit: 'px', format: 'a4' });

        doc.html(contentRef.current, {
            callback: (doc) => {
                doc.save(filename);
            },
            x: 10,
            y: 10,
            width: 420, // A4 width in px minus margins
            windowWidth: 800
        });
    };

    return (
        <PdfContext value={{ contentRef, savePdf }}>
            {children}
        </PdfContext>
    );
}
