import React, {use, useState} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, Row} from 'antd';
import {DeleteTwoTone, SettingTwoTone} from "@ant-design/icons";
import type {Task as TaskType} from '../types';
import {TaskOptionsCollapse} from "./TaskOptionsCollapse.tsx";
import {TextEditor} from "../editor/TextEditor.tsx";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";

type Props = {
    task: TaskType;
}

export function Task({task}: Props) {
    const {updateTask, deleteTask} = use(FileContext);
    const [open, setOpen] = useState(false);

    return (
        <>
            <Row className={'row task-container'}>
                <Col span={3}>
                    <TextEditor
                        content={sanitizeHtml(task.numeration)}
                        onChange={e => updateTask(task.id, {numeration: sanitizeHtml(e)})}
                    />
                </Col>
                <Col span={18}>
                    <TextEditor
                        content={sanitizeHtml(task.question)}
                        onChange={e => updateTask(task.id, {question: sanitizeHtml(e)})}
                    />
                </Col>
                <Col span={1}>
                    <Button type="default" onClick={() => setOpen(true)} size={"middle"} icon={<SettingTwoTone/>}/>
                </Col>
                <Col span={1}>
                    <Button className="icon-delete-2-tone" icon={<DeleteTwoTone/>}
                            onClick={() => deleteTask(task.id)}>Delete</Button>
                </Col>
            </Row>
            <Row gutter={24} className={'row task-option'}>
                <Col span={24}>
                    <TaskOptionsCollapse task={task} onClose={() => setOpen(false)} open={open}/>
                </Col>
            </Row>
        </>
    )
}