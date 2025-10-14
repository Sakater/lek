import React, {use} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, Row} from 'antd';
import {DeleteTwoTone, SettingTwoTone} from "@ant-design/icons";
import type {Task as TaskType} from '../types';
import {TextEditor} from "../editor/TextEditor.tsx";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";
import {DrawerContext} from "./DrawerContext";

type Props = {
    task: TaskType;
}

export function Task({task}: Props) {
    const {updateTask, deleteTask} = use(FileContext);
    const {openDrawer, setSelectedTaskId} = use(DrawerContext);

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
                    <Button type="default" onClick={() => {
                        openDrawer('taskFormOpen');
                        setSelectedTaskId(task.id);
                    }} size={"middle"} icon={<SettingTwoTone/>}/>
                </Col>
                <Col span={1}>
                    <Button className="icon-delete-2-tone" icon={<DeleteTwoTone/>}
                            onClick={() => deleteTask(task.id)}>Delete</Button>
                </Col>
            </Row>
        </>
    )
}