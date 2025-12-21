import {use, useState} from 'react';
import {Button, Drawer, InputNumber, Select} from 'antd';
import {FileContext} from '../../FileContext';
import {TaskView} from '../../view/TaskView';
import type {Task, WriteInTask} from '../../types';
import {BaseTaskFields} from '../BaseTaskFields';
import {UploadTaskForm} from "../UploadTaskForm.tsx";
import {UploadOutlined} from "@ant-design/icons";

type Props = {
    task: WriteInTask;
    open: boolean;
    onClose: () => void;
};

export function WriteInTaskForm({task, open, onClose}: Props) {
    const {updateTask} = use(FileContext);
    const [uploadFormOpen, setUploadFormOpen] = useState(false);

    return (
        <Drawer
            title="Freitext-Aufgabe Task bearbeiten"
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
            className={"ant-drawer-title"}
            styles={{
                body: {
                    overflow: 'hidden',
                    padding: 0,
                    height: '100%'
                }
            }}
        >
            <div className={'task-form-grid'} style={{
                height: '100%',
                overflow: 'hidden'
            }}>
                <div style={{
                    overflowY: 'auto',
                    padding: '24px'
                }}>
                    <BaseTaskFields task={task}/>

                    <div style={{marginTop: 16}}>
                        <label>Hilfslinien pro Zeile: </label>
                        <Select

                            defaultValue={0}
                            style={{width: 140}}
                            options={[
                                {value: 0, label: 'Keine Hilfslinien'},
                                {value: 1, label: '1 Hilfslinie'},
                                {value: 2, label: '2 Hilfslinien'},
                                {value: 3, label: '3 Hilfslinien'},
                            ]}
                            onChange={(value: number) => updateTask(task.id, {helpingLines: value})}
                        />
                    </div>

                    <div style={{marginTop: 16}}>
                        <label>Anzahl an Gesamtzeilen: </label>
                        <InputNumber
                            min={1}
                            max={20}
                            value={task.totalLines}
                            onChange={(value) => {
                                if (value !== null) {
                                    updateTask(task.id, {totalLines: value} as Partial<Task>);
                                }
                            }}
                        />
                    </div>
                </div>
                <div style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    padding: '24px'
                }}>
                    <TaskView task={task} scroll={true}/>
                </div>
            </div>
            {uploadFormOpen ?
                <UploadTaskForm task={task} open={uploadFormOpen} onClose={() => setUploadFormOpen(false)}/> : null}
        </Drawer>
    );
}
