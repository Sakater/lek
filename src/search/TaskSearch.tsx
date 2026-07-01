import { Button, Drawer, Empty, Pagination, Spin } from 'antd';
import { use, useState } from 'react';
import { FileContext } from '../FileContext';
import { searchTasks } from '../services/taskService.ts';
import type { Task, TaskRequest } from '../types';
import { TaskType } from '../types';
import { TaskView } from '../view/TaskView.tsx';
import { GenericSearchBar } from './GenericSearchBar.tsx';
import { taskSearchConfig } from './SearchConfigs.ts';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchOutlined } from '@ant-design/icons';
import './Search.css';

const typeBadgeClass: Record<TaskType, string> = {
    [TaskType.MULTIPLE_CHOICE]: 'multiple-choice',
    [TaskType.WRITE_IN]: 'write-in',
    [TaskType.MIXED]: 'mixed',
    [TaskType.FILL_IN_THE_BLANKS]: 'fill-blanks',
    [TaskType.LISTING]: 'listing',
    [TaskType.MAPPING]: 'mapping',
};

const typeBadgeLabel: Record<TaskType, string> = {
    [TaskType.MULTIPLE_CHOICE]: 'MC',
    [TaskType.WRITE_IN]: 'Text',
    [TaskType.MIXED]: 'Mix',
    [TaskType.FILL_IN_THE_BLANKS]: 'Lücke',
    [TaskType.LISTING]: 'Liste',
    [TaskType.MAPPING]: 'Zuord.',
};

type Props = { open: boolean; onClose: () => void };

export function TaskSearch({ open, onClose }: Props) {
    const { addTask } = use(FileContext);

    const [foundTasks, setFoundTasks] = useState<Task[]>([]);
    const [pageVariables, setPageVariables] = useState<{
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastRequest, setLastRequest] = useState<TaskRequest | null>(null);

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
                size: results?.page?.size ?? request.size ?? 20,
            });
        } catch (error) {
            console.error('Fehler bei der Suche:', error);
            setFoundTasks([]);
            setPageVariables(null);
        } finally {
            setLoading(false);
        }
    };
    const deleteFromSearch = (task: Task) => {
        setFoundTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        if (!lastRequest) return;
        const newRequest: TaskRequest = {
            ...lastRequest,
            page: page - 1,
            size: pageSize ?? lastRequest.size,
        };
        void handleSearch(newRequest);
    };

    const addFromSearch = (task: Task) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { numeration, id, type, ...patch } = task;
        addTask(task.type, patch);
    };

    const renderHeader = () => (
        <div className="search-drawer-header">
            <div className="search-drawer-header-left">
                <div className="search-drawer-header-icon">
                    <SearchOutlined />
                </div>
                <span className="search-drawer-header-title">Fragen suchen</span>
                {pageVariables && (
                    <span className="search-drawer-header-count">
                        {pageVariables.totalElements} Treffer
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <Drawer
            title={renderHeader()}
            placement="right"
            onClose={onClose}
            open={open}
            width={window.innerWidth <= 768 ? '100vw' : '55%'}
            className="search-drawer"
            styles={{ body: { paddingBottom: 24 } }}
        >
            <GenericSearchBar config={taskSearchConfig} onSearch={handleSearch} />

            {loading && (
                <div className="search-loading">
                    <Spin size="large" />
                </div>
            )}

            {!loading && foundTasks.length === 0 && (
                <div className="search-empty">
                    <Empty description="Keine Aufgaben gefunden" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            )}

            <AnimatePresence mode="popLayout">
                <div className="search-results">
                    {foundTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="search-result-card">
                                <div className={`search-result-card-badge ${typeBadgeClass[task.type]}`}>
                                    {typeBadgeLabel[task.type]}
                                </div>
                                <div className="search-result-card-content">
                                    <div className="search-result-card-title">
                                        <TaskView task={task} scroll />
                                    </div>
                                </div>
                                <div className="search-result-card-action">
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            addFromSearch(task);
                                            deleteFromSearch(task);
                                        }}
                                    >
                                        Übernehmen
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>

            {pageVariables && foundTasks.length > 0 && (
                <div className="search-pagination-wrapper">
                    <Pagination
                        current={(pageVariables.number ?? 0) + 1}
                        pageSize={pageVariables.size}
                        total={pageVariables.totalElements}
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageChange}
                        showSizeChanger={true}
                        pageSizeOptions={['10', '20', '50', '100']}
                        responsive={true}
                        showLessItems={true}
                        size="small"
                    />
                    <div className="search-pagination-info">
                        {`${Math.min(pageVariables.number * pageVariables.size + 1, pageVariables.totalElements)}-${Math.min((pageVariables.number + 1) * pageVariables.size, pageVariables.totalElements)} von ${pageVariables.totalElements} Treffern`}
                    </div>
                </div>
            )}
        </Drawer>
    );
}
