import React, {use, useState} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, DatePicker, Input, Row} from 'antd';
import {Task} from "./Task.tsx";
import {PlusCircleTwoTone} from "@ant-design/icons";
import dayjs from 'dayjs';
import {TaskChoice} from "./TaskChoice.tsx";
import {TextEditor} from "../TextEditor.tsx";

export function Form() {
    const {file, updateFile} = use(FileContext);
    const [taskOpen, setTaskOpen] = useState(false);
    const [content, setContent] = useState('');

    return (
        <div className={'form-container'}><TextEditor value={content} onChange={setContent}/>
            <Row gutter={24} className={'row'}>
                <Col xs={12} sm={12} md={6} xl={6}>

                    <Input
                        type={"text"}
                        value={file?.author}
                        onChange={e => updateFile({author: e.target.value})}
                        placeholder={"Autor"}
                    />
                </Col>
                <Col xs={18} sm={18} md={18} xl={12}>
                    <Input
                        type={"text"}
                        value={file?.title}
                        onChange={e => updateFile({title: e.target.value})}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} xl={6}>
                    <DatePicker
                        style={{width: '100%'}}
                        value={file?.date ? dayjs(file.date, 'DD.MM.YY') : null}
                        format="DD.MM.YY"
                        onChange={d => updateFile({date: d ? d.format('DD.MM.YY') : ''})}
                    />
                </Col>

            </Row>
            <Row className={'row'} style={{width: '100%', justifyContent: 'center'}}>
                <Col>
                    <Button onClick={() => setTaskOpen(true)} className={'plus-circle-2-tone'}
                            icon={<PlusCircleTwoTone/>}>Aufgabe</Button>
                    <TaskChoice open={taskOpen} onClose={() => setTaskOpen(false)}/>
                </Col>
            </Row>
            {file?.tasks.map(task => (
                <div key={task.id}>
                    <Task task={task}/>
                </div>

            ))}
        </div>
    );
}