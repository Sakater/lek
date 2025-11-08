import React, {use} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, Row, Card, Avatar} from 'antd';
import {
    CopyOutlined,
    DeleteTwoTone,
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    SettingTwoTone
} from "@ant-design/icons";
import type {Task as TaskType} from '../types';
import {TextEditor} from "../editor/TextEditor.tsx";
import {sanitizeHtml, sanitizeHtmlWithoutP} from "../utils/sanitizeHtml.ts";
import {DrawerContext} from "./DrawerContext";

type Props = {
    task: TaskType;
}

export function Task({task}: Props) {
    const {updateTask, deleteTask} = use(FileContext);
    const {openDrawer, setSelectedTaskId} = use(DrawerContext);
    const actions: React.ReactNode[] = [
        <EditOutlined key="edit" onClick={() => {
            openDrawer('taskFormOpen');
            setSelectedTaskId(task.id)
        }}/>,
        <CopyOutlined key={"duplicate"} />,
        <DeleteTwoTone key={"delete"} onClick={() => deleteTask(task.id)} className="icon-delete-2-tone"/>
    ];
    return (
        <>
            <Card actions={actions} style={{minWidth: 300, borderWidth: 1, borderColor: "#d9d9d9"}}>
                <Card.Meta
                    // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                    title={"Aufgabe " + sanitizeHtml(task.numeration)}
                    description={
                        <>
                            <p>{sanitizeHtml(task.question)}</p>
                        </>
                    }
                    style={{borderColor: "#d9d9d9"}}
                />
            </Card>
            {/*<Row className={'row task-container'}>*/}
            {/*    <Col span={3}>*/}
            {/*        <TextEditor*/}
            {/*            content={sanitizeHtml(task.numeration)}*/}
            {/*            onChange={e => updateTask(task.id, {numeration: sanitizeHtmlWithoutP(e)})}*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*    <Col span={18}>*/}
            {/*        <TextEditor*/}
            {/*            content={sanitizeHtml(task.question)}*/}
            {/*            onChange={e => {*/}
            {/*                updateTask(task.id, {question: sanitizeHtmlWithoutP(e)});*/}
            {/*                console.log('e: ', e);*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*    <Col span={1}>*/}
            {/*        <Button type="default" onClick={() => {*/}
            {/*            openDrawer('taskFormOpen');*/}
            {/*            setSelectedTaskId(task.id);*/}
            {/*        }} size={"middle"} icon={<SettingTwoTone/>}/>*/}
            {/*    </Col>*/}
            {/*    <Col span={1}>*/}
            {/*        <Button className="icon-delete-2-tone" icon={<DeleteTwoTone/>}*/}
            {/*                onClick={() => deleteTask(task.id)}>Delete</Button>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </>
    )
}