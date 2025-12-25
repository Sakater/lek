import {Button, Drawer, Form, Input, InputNumber, Select, type SelectProps} from 'antd';
import {saveTask} from '../services/taskService.ts';
import {Subject, type Task} from '../types';

type Props = {
    task: Task;
    open: boolean;
    onClose: () => void;
};

export function UploadTaskForm({ task, open, onClose }: Props) {
    //service for mapping upload to task fields would goes here
    const [form] = Form.useForm();
    const subjectList: SelectProps['options'] = Object.values(Subject).map((subject) => ({
        label: subject,
        value: subject,
    }));
    const handleFormSubmit = (values: Record<string, unknown>) => {
        // Beispiel: Merge mit bestehendem Task und an Save-Funktion geben
        const payload: Partial<Task> = { ...task, ...values };
        save(payload);
        onClose();
    };
    // Platzhalter für Persistenz / Service-Aufruf
    const save = (payload: Partial<Task>) => {
        // Implementierung: API-Aufruf, Context-Update, etc.
        saveTask(payload).then((r) => console.log('Task saved!', r));
    };
    return (
        <Drawer
            title="Lückentext-Aufgabe bearbeiten"
            placement="top"
            open={open}
            onClose={onClose}
            height={'100%'}
        >
            <Form
                form={form}
                name={'uploadTask'}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={handleFormSubmit}
                initialValues={{
                    subject: Subject.Ahlak,
                    level: 1,
                    grade: 1,
                }}
            >
                <Form.Item
                    name={'subject'}
                    label={'Fach'}
                    rules={[{ required: true, message: 'Fach ist erforderlich' }]}
                >
                    <Select defaultValue={Subject.Ahlak} options={subjectList} />
                </Form.Item>
                <Form.Item
                    name={'topic'}
                    label={'Thema'}
                    rules={[{ required: true, message: 'Thema ist erforderlich' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'grade'}
                    label={'Klassenstufe'}
                    rules={[{ required: true, message: 'Klassenstufe ist erforderlich' }]}
                >
                    <InputNumber max={9} min={1} />
                </Form.Item>
                <Form.Item
                    name={'level'}
                    label={'Schwierigkeitsgrad'}
                    rules={[{ required: true, message: 'Schwierigkeitsgrad ist erforderlich' }]}
                >
                    <Select
                        defaultValue={'Leicht'}
                        options={[
                            { label: 'Leicht', value: 1 },
                            { label: 'Mittel', value: 2 },
                            {
                                label: 'Schwierig',
                                value: 3,
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name={'points'}
                    label={'Punkte'}
                    rules={[{ required: true, message: 'Punkte sind erforderlich' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name={'createdBy'}
                    label={'Erstellt von / Author'}
                    rules={[{ required: false, message: 'sind erforderlich' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4 }}>
                    <Button type="primary" htmlType="submit">
                        Upload
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
}
