import jsPDF from "jspdf";
import {use, useRef} from "react";
import {Button, Col, Row} from "antd";
import {Form} from "./form/Form.tsx";
import {PDFFile} from "./view/PDFFile.tsx";
import {FileContext} from "./FileContext";

export function PDFCustomizer() {
    const {file} = use(FileContext);
    const reportTemplateRef = useRef<HTMLDivElement>(null as never);

    const handleGeneratePdf = async () => {
        if (!reportTemplateRef.current) return;

        const doc = new jsPDF({format: "a4", unit: "px"});

        // Warten bis Layout stabil ist (Framesprung)
        await new Promise(r => requestAnimationFrame(() => r(null)));

        const node = reportTemplateRef.current;
        const width = node.scrollWidth;

        doc.html(node, {
            x: 0,
            y: 0,
            width, // skaliert Inhalt passend und verhindert Clipping
            html2canvas: {
                scale: window.devicePixelRatio || 2,
                useCORS: true,
                windowWidth: width
            },
            callback(pdf) {
                pdf.save("document");
            }
        });
    };

    return (
        <Row gutter={24} className={"body-row"}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                <Form />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                <div style={{display: "flex", alignItems: "start", justifyContent: "center"}}>
                    <div className={"col avoid-break"} style={{display: "flex", justifyContent: "center"}} ref={reportTemplateRef}>
                        <PDFFile file={file} size={1.2} />
                    </div>
                </div>
            </Col>
            <Col>
                <Button onClick={handleGeneratePdf} type="primary" style={{marginTop: "20px"}}>
                    PDF generieren
                </Button>
            </Col>
        </Row>
    );
}