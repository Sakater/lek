import { Button, Drawer, Empty, Pagination, Spin } from 'antd';
import { use, useState } from 'react';
import { FileContext } from '../FileContext';
import { searchFiles } from '../services/fileService.ts';
import type { File, FileRequest } from '../types';
import { GenericSearchBar } from './GenericSearchBar.tsx';
import { fileSearchConfig } from './SearchConfigs.ts';
import { FolderOutlined } from '@ant-design/icons';
import './Search.css';

export function FileSearch() {
    const { updateFile, setOpenTemplateSearch, setOpenCustomizer, openTemplateSearch } =
        use(FileContext);

    const [foundFiles, setFoundFiles] = useState<File[]>([]);
    const [pageVariables, setPageVariables] = useState<{
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastRequest, setLastRequest] = useState<FileRequest | null>(null);

    const handleSearch = async (request: FileRequest) => {
        setLoading(true);
        setLastRequest(request);
        try {
            const results = await searchFiles(request);

            setFoundFiles(results?.content || []);
            setPageVariables({
                totalElements: results?.page?.totalElements ?? 0,
                totalPages: results?.page?.totalPages ?? 0,
                number: results?.page?.number ?? 0,
                size: results?.page?.size ?? request.size ?? 20,
            });
        } catch (error) {
            console.error('Fehler bei der Suche:', error);
            setFoundFiles([]);
            setPageVariables(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        if (!lastRequest) return;
        const newRequest: FileRequest = {
            ...lastRequest,
            page: page - 1,
            size: pageSize ?? lastRequest.size,
        };
        void handleSearch(newRequest);
    };

    const selectFile = (file: File) => {
        updateFile(file);
        setOpenTemplateSearch(false);
        setOpenCustomizer(true);
    };

    const renderHeader = () => (
        <div className="search-drawer-header">
            <div className="search-drawer-header-left">
                <div className="search-drawer-header-icon">
                    <FolderOutlined />
                </div>
                <span className="search-drawer-header-title">Dokumente suchen</span>
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
            onClose={() => setOpenTemplateSearch(false)}
            open={openTemplateSearch}
            width={window.innerWidth <= 768 ? '100vw' : '55%'}
            className="search-drawer"
            styles={{ body: { paddingBottom: 24 } }}
        >
            <GenericSearchBar config={fileSearchConfig} onSearch={handleSearch} />

            {loading && (
                <div className="search-loading">
                    <Spin size="large" />
                </div>
            )}

            {!loading && foundFiles.length === 0 && (
                <div className="search-empty">
                    <Empty description="Keine Dokumente gefunden" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            )}

            <div className="search-results">
                {foundFiles.map((file) => (
                    <div key={file.id} className="search-result-card">
                        <div className="search-result-card-badge file">
                            <FolderOutlined />
                        </div>
                        <div className="search-result-card-content">
                            <div className="search-result-card-title">{file.title}</div>
                            <div className="search-result-card-meta">
                                {file.createdBy && <span>{file.createdBy}</span>}
                                {file.date && <span>{file.date}</span>}
                                {file.subject?.length > 0 && <span>{file.subject.join(', ')}</span>}
                                {file.grade && <span>Klasse {file.grade}</span>}
                                {file.level && <span>Level {file.level}</span>}
                            </div>
                        </div>
                        <div className="search-result-card-action">
                            <Button type="primary" size="small" onClick={() => selectFile(file)}>
                                Auswählen
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {pageVariables && foundFiles.length > 0 && (
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
