import type {SelectProps} from 'antd';
import {Button, Card, Col, Drawer, Row, Select,} from "antd";
import React, {use, useEffect, useState} from "react";
import {searchFiles} from '../services/taskService.ts';
import type {File} from "../types";
import {TaskType} from "../types";
import {Subject} from "../types";
import {FileContext} from "../FileContext";
import {PDFFile} from "../view/PDFFile.tsx";


export function FileSearch() {
    const {updateFile, setOpenTemplateSearch, setOpenCustomizer, openTemplateSearch} = use(FileContext);
    const [inputValue, setInputValue] = useState<string[]>([]);
    const [templates, setTemplates] = useState<File[]>();

    const options: SelectProps['options'] = Object.values(TaskType).map(type => ({
        label: '[Aufgabentyp] ' + type,
        value: type
    }))
    const subjectList: SelectProps['options'] = Object.values(Subject).map(subject => ({
        label: '[Fach] ' + subject,
        value: subject
    }));
    options.push(...subjectList);

    console.log('FileSearch -> openTemplateSearch: ', openTemplateSearch)

    useEffect(() => {
        if (inputValue.length === 0) {
            setTemplates([]); // Ergebnisse ausblenden, wenn keine Suchbegriffe
            return;
        }
        if (inputValue.length === 0 || !inputValue[0]) return;
        searchFiles(inputValue).then(setTemplates);
    }, [inputValue]);

    return (
        <div>
            {openTemplateSearch.toString()}
            <Drawer
                title={'Dokumente finden'}
                placement={'top'}
                closable={false}
                onClose={() => {
                    setOpenTemplateSearch(false);
                }}
                open={openTemplateSearch}
                key={'top'}
                height={'80%'}>
                {/*<Input placeholder="Suchbegriff eingeben..." style={{marginBottom: '20px'}}/>*/}
                <Select
                    mode="tags"
                    style={{width: '100%'}}
                    placeholder="Suchbegriffe eingeben und Enter drücken"
                    onChange={(value: string[]) => setInputValue(value)}
                    options={options}
                />
                {templates?.map(template => {
                    return (
                        <Row>
                            <Col>
                                <Card>

                                    <PDFFile file={template} size={1.5}/>
                                </Card>
                            </Col>
                            <Col>
                                <Button type="default" onClick={() => {
                                    updateFile(template);
                                    setOpenTemplateSearch(false);
                                    setOpenCustomizer(true)
                                }}/>
                            </Col>
                        </Row>
                    )
                })}

            </Drawer>
        </div>
    )
}