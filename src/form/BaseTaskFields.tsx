// BaseTaskFields.tsx
import React, {use} from 'react';
import {Button, Col, Row} from 'antd';
import {DeleteTwoTone, PlusCircleTwoTone} from '@ant-design/icons';
import {FileContext} from '../FileContext';
import {TextEditor} from '../editor/TextEditor';
import {sanitizeHtml, sanitizeHtmlWithoutP} from '../utils/sanitizeHtml';
import type {Task} from '../types';

type Props = {
    task: Task;
};

export function BaseTaskFields({task}: Props) {
    const {file, updateTask, updateOption, addOption, deleteOption,} = use(FileContext);

    return (
        <>
            <Row className={'row task-container'}>
                <Col span={3}>
                    <label>Num.</label>
                    <TextEditor
                        content={sanitizeHtml(task.numeration)}
                        onChange={e => updateTask(task.id, {numeration: sanitizeHtmlWithoutP(e)})}
                    />
                </Col>
                <Col span={18}>
                    <label>Frage</label>
                    <TextEditor
                        content={sanitizeHtml(task.question)}
                        onChange={e => {
                            updateTask(task.id, {question: sanitizeHtmlWithoutP(e)});
                            console.log('e: ', e);
                        }}
                        placeholder={"question"}
                    />
                </Col>
            </Row>
            <Button
                icon={<PlusCircleTwoTone/>}
                onClick={() =>
                    addOption(task.id)
                }
                disabled={task.options.length >= 10 || (task.type === 'Freitext' && task.options.length >= 1)}
            >
                {task.type === 'Freitext'?<>Hinweis</>:<>Option</>}
            </Button>

            {task.options.map((option) => (
                <Row key={option.id} gutter={8} style={{marginBottom: 8}}>
                    <Col flex="auto">
                        <TextEditor
                            content={option.name}
                            onChange={(e) => updateOption(task.id, option.id, sanitizeHtml(e))}
                            placeholder={'Option'}
                        />
                    </Col>
                    <Col>
                        <DeleteTwoTone onClick={() => deleteOption(task.id, option.id)}/>
                    </Col>
                </Row>
            ))}
        </>
    );
}
