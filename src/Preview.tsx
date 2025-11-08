import {useState} from "react";
import type {File, Task} from "./types";
import {Button, Col, Row} from "antd";
import {PDFFile} from "./view/PDFFile.tsx";
import {ToPdf} from "./assets";
import {PDFExportView} from "./view/PDFExportView.tsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {DrawerContextProvider} from "./form/DrawerContext/DrawerContextProvider.tsx";

type Props= {
    file: File
}

export function Preview({file}:Props) {
    const [scale, setScale] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const [paginatedTasks, setPaginatedTasks] = useState<Task[][]>([]);

    const handlePaginationUpdate = (tasks: Task[][]) => {
        setPaginatedTasks(tasks);
    };

    const exportPDF = async () => {
        const container = document.getElementById('pdf-export-view');
        if (!container) return;

        setIsExporting(true);

        try {
            const pages = container.querySelectorAll('.pdf-page');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i] as HTMLElement;

                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    width: 794,
                    windowWidth: 794
                });

                const imgData = canvas.toDataURL('image/png');

                if (i > 0) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
            }

            pdf.save(`${file?.title || 'export'}.pdf`);
        } catch (error) {
            console.error('PDF Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };
    return (
        <DrawerContextProvider>
            <Row style={{ padding: '20px' }}>
        <Col xs={24} xxl={12}>
                    <div style={{ marginBottom: '20px' }}>
                        Zoom:
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.1"
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                            style={{ marginLeft: '10px', width: '200px' }}
                        />
                        {Math.round(scale * 100)}%
                    </div>

                    <PDFFile
                        file={file}
                        scale={scale}
                        onPaginationUpdate={handlePaginationUpdate}
                    />

                    <div style={{ marginTop: '20px' }}>
                        <Button
                            onClick={exportPDF}
                            type="primary"
                            loading={isExporting}
                            disabled={paginatedTasks.length === 0}
                        >
                            <ToPdf />{isExporting ? 'Generiere PDF...' : 'PDF exportieren'}
                        </Button>

                        {paginatedTasks.length > 0 && (
                            <span style={{ marginLeft: '10px', color: '#666' }}>
                                ({paginatedTasks.length} Seiten)
                            </span>
                        )}
                    </div>
                </Col>
            </Row>

            <PDFExportView
                file={file}
                paginatedTasks={paginatedTasks}
            />
        </DrawerContextProvider>
    );
    )
}