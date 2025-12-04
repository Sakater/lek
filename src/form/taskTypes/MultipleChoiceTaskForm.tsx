// MultipleChoiceTaskForm.tsx
import {use, useState} from 'react';
import {Button, Drawer, InputNumber} from 'antd';
import {FileContext} from '../../FileContext';
import {TaskView} from '../../view/TaskView';
import type {MultipleChoiceTask, Task} from '../../types';
import {BaseTaskFields} from '../BaseTaskFields';
import {UploadTaskForm} from "../UploadTaskForm.tsx";
import {UploadOutlined} from "@ant-design/icons";

type Props = {
    task: MultipleChoiceTask;
    open: boolean;
    onClose: () => void;
};

export function MultipleChoiceTaskForm({task, open, onClose}: Props) {
    const {updateTask} = use(FileContext);
    const [uploadFormOpen, setUploadFormOpen] = useState(false);

    return (
        <Drawer
            title="Multiple-Choice-Aufgabe Task bearbeiten"
            placement="top"
            open={open}
            onClose={onClose}
            height={'80%'}
            extra={
                <Button
                    type="primary"
                    className="header-upload-btn"
                    onClick={() => {
                        setUploadFormOpen(true);
                    }}
                    icon={<UploadOutlined/>}
                >
                    <span className="btn-text">Upload</span>
                </Button>
            }
        >
            <div className={'task-form-grid'}>
                <div>

                    <BaseTaskFields task={task}/>

                    <div style={{marginTop: 16}}>
                        <label>Optionen pro Zeile: </label>
                        <InputNumber
                            min={1}
                            max={10}
                            value={task.optionsInARow}
                            onChange={(value) => {
                                if (value !== null) {
                                    updateTask(task.id, {...task, optionsInARow: value} as Partial<Task>);
                                }
                            }}
                        />
                    </div>
                </div>
                <TaskView task={task} scroll/>
            </div>
            {uploadFormOpen ?
                <UploadTaskForm task={task} open={uploadFormOpen} onClose={() => setUploadFormOpen(false)}/> : null}
        </Drawer>
    );
}
