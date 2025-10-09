import React, {use} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, DatePicker, Input, Row} from 'antd';
import {Task} from "./Task.tsx";
import {PlusCircleTwoTone} from "@ant-design/icons";
import dayjs from 'dayjs';
import {TaskType} from "../types";

export function Form() {
    const {file, updateFile, addTask} = use(FileContext);

    return (
        <div className={'form-container'}>
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
                    <Button onClick={() => addTask(TaskType.MultipleChoice)} className={'plus-circle-2-tone'}
                            icon={<PlusCircleTwoTone/>}>Aufgabe</Button>
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