// BaseTaskFields.tsx
import React, {use} from 'react';
import {Button, Col, Row} from 'antd';
import {DeleteTwoTone, PlusCircleTwoTone} from '@ant-design/icons';
import {FileContext} from '../FileContext';
import {TextEditor} from '../editor/TextEditor';
import {sanitizeHtml} from '../utils/sanitizeHtml';
import type {Task} from '../types';
import {TaskType} from "../types";

type Props = {
    task: Task;
};

export function BaseTaskFields({task}: Props) {
    const {file, updateOption, addOption,deleteOption,} = use(FileContext);

    return (
        <>
            <Button
                icon={<PlusCircleTwoTone/>}
                onClick={() =>
                    addOption(task.id)
                }
                disabled={task.options.length >= 10}
            >
                Option
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
