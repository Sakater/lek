// BaseTaskFields.tsx

import {DeleteTwoTone, PlusCircleTwoTone} from '@ant-design/icons';
import {Button, Col, Row, Select} from 'antd';
import {use} from 'react';
import {VisibilityOff} from '../assets';
import {CentralToolbar} from '../editor/CentralToolbar.tsx';
import {TextEditor} from '../editor/TextEditor';
import {FileContext} from '../FileContext';
import {type Task, TaskType} from '../types';
import {sanitizeHtml, sanitizeHtmlWithoutP} from '../utils/sanitizeHtml';

type Props = {
    task: Task;
};

export function BaseTaskFields({ task }: Props) {
    const { updateTask, updateOption, addOption, deleteOption } = use(FileContext);

    return (
        <>
            <CentralToolbar />
            <Row className={'row task-container'}>
                <Col span={3}>
                    <label>Num.</label>
                    <TextEditor
                        content={sanitizeHtml(task.numeration)}
                        onChange={(e) =>
                            updateTask(task.id, { numeration: sanitizeHtmlWithoutP(e) })
                        }
                    />
                </Col>
                <Col span={18}>
                    <label>Frage</label>
                    <TextEditor
                        content={sanitizeHtml(task.question)}
                        onChange={(e) => {
                            updateTask(task.id, { question: sanitizeHtmlWithoutP(e) });
                            //console.log('e: ', e, "sanitized: ", sanitizeHtmlWithoutP(e));
                        }}
                        placeholder={'question'}
                    />
                </Col>
            </Row>
            <Button
                icon={<PlusCircleTwoTone />}
                onClick={() => addOption(task.id)}
                disabled={
                    task.options.length >= 10 ||
                    (task.type === TaskType.WRITE_IN && task.options.length >= 1)
                }
            >
                {task.type === TaskType.WRITE_IN ? <>Hinweis</> : <>Option</>}
            </Button>

            {task.options.map((option) => (
                <Row key={option.id} gutter={8} style={{ marginBottom: 8 }}>
                    <Col>
                        <Select
                            defaultValue={option.inputType}
                            optionLabelProp="label"
                            suffixIcon={null}
                            style={{ width: 80, cursor: 'pointer' }}
                            variant="borderless"
                            onChange={(e) => updateOption(task.id, option.id, { inputType: e })}
                        >
                            <Select.Option
                                value="checkbox"
                                label={
                                    <input
                                        type={'checkbox'}
                                        checked={false}
                                        style={{ cursor: 'pointer' }}
                                        readOnly
                                    />
                                }
                            >
                                <input
                                    type={'checkbox'}
                                    style={{ cursor: 'pointer' }}
                                    checked={false}
                                    readOnly
                                />
                            </Select.Option>
                            <Select.Option
                                value="radio"
                                label={
                                    <input
                                        type={'radio'}
                                        checked={false}
                                        style={{ cursor: 'pointer' }}
                                        readOnly
                                    />
                                }
                            >
                                <input
                                    type={'radio'}
                                    style={{ cursor: 'pointer' }}
                                    checked={false}
                                    readOnly
                                />
                            </Select.Option>
                            <Select.Option
                                value="hidden"
                                label={
                                    <div
                                        style={{
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <VisibilityOff />
                                    </div>
                                }
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <VisibilityOff />
                                </div>
                            </Select.Option>
                        </Select>
                    </Col>
                    <Col flex="auto">
                        <TextEditor
                            content={option.optionText}
                            onChange={(e) =>
                                updateOption(task.id, option.id, { optionText: sanitizeHtml(e) })
                            }
                            placeholder={'Option'}
                        />
                    </Col>
                    {task.type === TaskType.MAPPING ? (
                        <Col>
                            <Button
                                onClick={() =>
                                    updateOption(task.id, option.id, { optionType: 'source' })
                                }
                            >
                                l
                            </Button>
                            <Button
                                onClick={() =>
                                    updateOption(task.id, option.id, { optionType: 'target' })
                                }
                                color={option.optionType === 'target' ? 'blue' : undefined}
                            >
                                r
                            </Button>
                        </Col>
                    ) : null}
                    <Col>
                        <DeleteTwoTone onClick={() => deleteOption(task.id, option.id)} />
                    </Col>
                </Row>
            ))}
        </>
    );
}
