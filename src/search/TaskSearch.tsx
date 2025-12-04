import {Button, Card, Col, Drawer, Empty, Pagination, Row, Spin} from "antd";
import {use, useState} from "react";
import {searchTasks} from '../services/taskService.ts';
import {TaskView} from "../view/TaskView.tsx";
import type {Task, TaskRequest} from "../types"; // TaskRequest importieren!
import {FileContext} from "../FileContext";
import {GenericSearchBar} from "./GenericSearchBar.tsx";
import {taskSearchConfig} from "./SearchConfigs.ts";
import {PlusOutlined} from '@ant-design/icons';

type Props = {
    open: boolean;
    onClose: () => void;
}

export function TaskSearch({open, onClose}: Props) {
    const {addTask} = use(FileContext);

    // 1. State für die gefundenen Tasks + Loading State
    const [foundTasks, setFoundTasks] = useState<Task[]>([]);
    const [pageVariables, setPageVariables] = useState<{
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastRequest, setLastRequest] = useState<TaskRequest | null>(null);

    // 2. Wrapper Funktion für die Suche
    const handleSearch = async (request: TaskRequest) => {
        setLoading(true);
        setLastRequest(request);
        try {
            const results = await searchTasks(request);

            setFoundTasks(results?.content || []);
            setPageVariables({
                totalElements: results?.page?.totalElements ?? 0,
                totalPages: results?.page?.totalPages ?? 0,
                number: results?.page?.number ?? 0,
                size: results?.page?.size ?? (request.size ?? 20),
            });
        } catch (error) {
            console.error("Fehler bei der Suche:", error);
            setFoundTasks([]);
            setPageVariables(null);
        } finally {
            setLoading(false);
        }
    };
    const deleteFromSearch=(task:Task)=>{
        setFoundTasks((prevTasks)=>prevTasks.filter(t=>t.id!==task.id));
    }


    const handlePageChange = (page: number, pageSize?: number) => {
        if (!lastRequest) return;
        const newRequest: TaskRequest = {
            ...lastRequest,
            page: page - 1, // Antd Pagination ist 1-basiert, Backend evtl. 0-basiert
            size: pageSize ?? lastRequest.size,
        };
        void handleSearch(newRequest);
    };

    const addFromSearch = (task: Task) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {numeration, id, type, ...patch} = task;
        addTask(task.type, patch);
        // Optional: Feedback geben ("Hinzugefügt")
    };

    return (
        <div>
            <Drawer
                title={'Frage finden'}
                placement={'top'}
                // closable={true} // Besser true lassen, falls User abbrechen will
                onClose={onClose}
                open={open}
                key={'top'}
                height={'80%'}
                // Extra Props für besseres Styling
                styles={{body: {paddingBottom: 80}}}
            >
                {/* SearchBar triggert jetzt handleSearch */}
                <div style={{marginBottom: 24}}>
                    <GenericSearchBar
                        config={taskSearchConfig}
                        onSearch={handleSearch}
                    />
                </div>

                {/* Lade-Indikator */}
                {loading && <div style={{textAlign: 'center', padding: 20}}><Spin/></div>}

                {/* Ergebnis-Liste */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                    {!loading && foundTasks.length === 0 ?
                        <Empty description="Keine Aufgaben gefunden" image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                        : <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
                            <Pagination
                                current={(pageVariables?.number ?? 0) + 1}
                                pageSize={pageVariables?.size}
                                total={pageVariables?.totalElements}
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                showSizeChanger={true}
                                pageSizeOptions={['10', '20', '50', '100']}
                                responsive={true}
                                showLessItems={true}
                            />
                            <div style={{color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px'}}>
                                {pageVariables && `${Math.min((pageVariables.number * pageVariables.size) + 1, pageVariables.totalElements)}-${Math.min((pageVariables.number + 1) * pageVariables.size, pageVariables.totalElements)} von ${pageVariables.totalElements} Treffern`}
                            </div>
                        </div>
                    }
                    <Row gutter={24} >
                    {foundTasks.map(task => (
                        <Col xs={24} xl={12}>
                        <div style={{padding:"15px", display:"flex", justifyContent:"space-evenly"}}><Card
                            key={task.id}
                            size="small"
                            hoverable
                            style={{width:"810px", overflowY:"auto"}}
                            // Aktionen direkt in die Card integrieren sieht oft besser aus
                            extra={<Button
                                type="primary"
                                //icon={<PlusOutlined/>}
                                onClick={() => {
                                    addFromSearch(task);
                                    deleteFromSearch(task);
                                }}
                            >
                                Übernehmen
                            </Button>}
                        >
                            {/* Deine TaskView rendert den Inhalt */}
                            <TaskView task={task} scroll />
                        </Card></div></Col>
                    ))}
                    </Row>

                    {!loading && foundTasks.length > 0 ?
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
                            <Pagination
                                current={(pageVariables?.number ?? 0) + 1}
                                pageSize={pageVariables?.size}
                                total={pageVariables?.totalElements}
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                showSizeChanger={true}
                                pageSizeOptions={['10', '20', '50', '100']}
                                responsive={true}
                                showLessItems={true}
                            />
                            <div style={{color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px'}}>
                                {pageVariables && `${Math.min((pageVariables.number * pageVariables.size) + 1, pageVariables.totalElements)}-${Math.min((pageVariables.number + 1) * pageVariables.size, pageVariables.totalElements)} von ${pageVariables.totalElements} Treffern`}
                            </div>
                        </div> : null}
                </div>
            </Drawer>
        </div>
    )
}
