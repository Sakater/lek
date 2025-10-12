import jsPDF from "jspdf";
import {use, useRef} from "react";
import {Button, Col, Row} from "antd";
import {Form} from "./form/Form.tsx";
import {PDFFile} from "./view/PDFFile.tsx";
import {FileContext} from "./FileContext";

export function PDFCustomizer() {
    const {file} = use(FileContext);
    const handleGeneratePdf = () => {
        const doc = new jsPDF({
            format: 'a4',
            unit: 'px',

        });

        // Adding the fonts.

        doc.html(reportTemplateRef.current, {
            async callback(doc) {
                await doc.save('document');
            },
        });
    };
    const reportTemplateRef = useRef(null as never);

    return (
        <Row gutter={24} className={'body-row'}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}><Form/></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                <div style={{display: "flex", alignItems: "start", justifyContent: "center"}}>
                    {/*pdf-viewer*/}
                    <div className={"col avoid-break"} style={{display: "flex", justifyContent: "center"}}
                         ref={reportTemplateRef}
                    >
                        <PDFFile file={file} size={1.2}/>
                    </div>
                </div>
            </Col>
            <Col>
                <Button onClick={handleGeneratePdf} type="primary" style={{marginTop: '20px'}}>PDF
                    generieren</Button>
            </Col>
        </Row>
    )
}