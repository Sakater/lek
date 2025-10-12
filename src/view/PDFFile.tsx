import React, {use} from "react";
import {FileContext} from "../FileContext";
import {Col, Row} from "antd";
import {TasksView} from "./TasksView.tsx";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";
import type {File} from "../types";

type Props = {
    file: File | null;
    size: number;

}

export function PDFFile({file, size}: Props) {
    const {dynamicSize} = use(FileContext);

    const value = size;
    const border = (number: number) => number > 1 ? "2px solid black" : "";
    const pdfContainer = {
        maxHeight: `${297 / value}mm`,
        minHeight: `${297 / value}mm`,
        height: `${297 / value}mm`,
        maxWidth: `${210 / value}mm`,
        minWidth: `${210 / value}mm`,
        width: `${210 / value}mm`,
        display: "flex",
        paddingTop: "0px",
        border: `${border(size)}`,
        overflow: "hidden",
        alignItems: "start",
        alignContent: "unset"
    }


    /*const showTask = (indexTask: number): boolean => {
        return indexTask >= ((currentPage - 1) * file?.tasksPerPage) && indexTask < currentPage * file?.tasksPerPage
    }*/

    return (

        <div style={{
            ...pdfContainer,
            textAlign: "start",
            flexDirection: "column",
            alignContent: "center",
            overflow: "scroll"
        }}>
            <div style={{textAlign: "center", paddingTop: `${dynamicSize(15)}pt`, width: '100%'}}>
                <Row justify="center">
                    <Col span={6} style={{fontSize: `${dynamicSize(13)}pt`, paddingTop: '10px'}}
                         dangerouslySetInnerHTML={{__html: sanitizeHtml(file?.author) || ""}}/>
                    <Col span={12} style={{fontSize: `${dynamicSize(16)}pt`}}
                         dangerouslySetInnerHTML={{__html: sanitizeHtml(file?.title) || ""}}/>
                    <Col span={6} style={{
                        fontSize: `${dynamicSize(13)}pt`,
                        paddingTop: '10px',
                        paddingLeft: '20px',
                        display: 'flex',
                        alignItems: 'center',
                    }} dangerouslySetInnerHTML={{__html: 'Datum: ' + sanitizeHtml(file?.date) || ""}}/>

                </Row>

            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "auto",
                gridTemplateRows: "auto",
                paddingTop: `${dynamicSize(5)}px`,
                fontSize: `${dynamicSize(14)}pt`
            }}>
                {file?.tasks.map((task, index) => (
                    <div className="avoid-break">
                        <TasksView key={task.id} task={task} size={size}/>
                    </div>
                ))}
            </div>
        </div>
    );


}

export default React.memo(PDFFile);