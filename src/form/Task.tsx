import React, {use} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, Input, Row} from 'antd';
import {DeleteTwoTone} from "@ant-design/icons";
import type {Task as TaskType} from '../types';
import {TaskOptionsCollapse} from "./TaskOptionsCollapse.tsx";

type Props = {
    task: TaskType;
}

export function Task({task}: Props) {
    const {updateTask, deleteTask} = use(FileContext);
    return (
        <>
            <Row className={'row task-container'}>
                <Col span={3}>
                    <div className={'task-numeration'}>
                        <Input type={'text'}
                               value={task.numeration}
                               onChange={e =>
                                   updateTask(task.id, {...task, numeration: e.target.value})
                               }
                        />
                    </div>
                </Col>
                <Col span={18}>
                    <Input
                        type="text"
                        value={task.question}
                        onChange={e =>
                            updateTask(task.id, {...task, question: e.target.value})
                        }
                    />
                </Col>
                <Col span={1}>
                    <Button className="icon-delete-2-tone" icon={<DeleteTwoTone/>}
                            onClick={() => deleteTask(task.id)}>Delete</Button>
                </Col>
            </Row>
            <Row gutter={24} className={'row task-option'}>
                <Col span={24}>
                    <TaskOptionsCollapse task={task}/>
                </Col>
            </Row>
        </>
    )
}