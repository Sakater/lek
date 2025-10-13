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

        // Fonts laden lassen und einen Frame warten
        try {
            // @ts-ignore
            if (document.fonts?.ready) await document.fonts.ready;
        } catch {}
        await new Promise(r => requestAnimationFrame(() => r(null)));

        const node =
            (reportTemplateRef.current.querySelector("[data-pdf-root]") as HTMLElement) ??
            reportTemplateRef.current;

        const doc = new jsPDF({format: "a4", unit: "px"});
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.html(node, {
            x: 0,
            y: 0,
            width: pageWidth,
            pagebreak: {mode: ["css", "legacy"]},
            html2canvas: {
                scale: window.devicePixelRatio || 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                windowWidth: node.scrollWidth || pageWidth
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