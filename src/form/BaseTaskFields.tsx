// BaseTaskFields.tsx
import {use} from 'react';
import {Button, Col, Row} from 'antd';
import {DeleteTwoTone, PlusCircleTwoTone} from '@ant-design/icons';
import {FileContext} from '../FileContext';
import {TextEditor} from '../editor/TextEditor';
import {sanitizeHtml, sanitizeHtmlWithoutP} from '../utils/sanitizeHtml';
import {type Task, TaskType} from '../types';
import {CentralToolbar} from "../editor/CentralToolbar.tsx";

type Props = {
    task: Task;
};

export function BaseTaskFields({task}: Props) {
    const {updateTask, updateOption, addOption, deleteOption} = use(FileContext);

    return (
        <>
            <CentralToolbar/>
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
                            //console.log('e: ', e, "sanitized: ", sanitizeHtmlWithoutP(e));
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
                disabled={task.options.length >= 10 || (task.type === TaskType.WRITE_IN && task.options.length >= 1)}
            >
                {task.type === TaskType.WRITE_IN ? <>Hinweis</> : <>Option</>}
            </Button>

            {task.options.map((option) => (
                <Row key={option.id} gutter={8} style={{marginBottom: 8}}>
                    <Col flex="auto">
                        <TextEditor
                            content={option.optionText}
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
