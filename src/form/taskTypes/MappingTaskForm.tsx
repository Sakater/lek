// MultipleChoiceTaskForm.tsx

import {UploadOutlined} from '@ant-design/icons';
import {Button, Drawer} from 'antd';
import {useState} from 'react';
import type {MappingTask} from '../../types';
import {TaskView} from '../../view/TaskView';
import {BaseTaskFields} from '../BaseTaskFields';
import {UploadTaskForm} from '../UploadTaskForm.tsx';

type Props = {
    task: MappingTask;
    open: boolean;
    onClose: () => void;
};

export function MappingTaskForm({ task, open, onClose }: Props) {
    const [uploadFormOpen, setUploadFormOpen] = useState(false);
    return (
        <Drawer
            title="Zuordnung Task bearbeiten"
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
                    icon={<UploadOutlined />}
                >
                    <span className="btn-text">Upload</span>
                </Button>
            }
        >
            <div className={'task-form-grid'}>
                <div>
                    <BaseTaskFields task={task} />
                </div>
                <TaskView task={task} scroll />
            </div>
            {uploadFormOpen ? (
                <UploadTaskForm
                    task={task}
                    open={uploadFormOpen}
                    onClose={() => setUploadFormOpen(false)}
                />
            ) : null}
        </Drawer>
    );
}
