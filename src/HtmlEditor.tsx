import React, { useEffect, useRef, useState } from 'react';
import { Button, Space } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons';

type FormatCommand = 'bold' | 'italic' | 'underline';

interface HtmlEditorProps {
    value?: string;
    onChange?: (html: string) => void;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({ value = '', onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const lastHtml = useRef<string>('');

    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    const executeCommand = (command: FormatCommand) => {
        document.execCommand(command, false, undefined);
        editorRef.current?.focus();
        updateButtonStates();
    };

    const updateButtonStates = () => {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
        });
    };

    const handleInput = () => {
        const html = editorRef.current?.innerHTML ?? '';
        if (html !== lastHtml.current && onChange) {
            onChange(html);
            lastHtml.current = html;
        }
    };

    useEffect(() => {
        const onSelChange = () => updateButtonStates();
        document.addEventListener('selectionchange', onSelChange);
        return () => document.removeEventListener('selectionchange', onSelChange);
    }, []);

    useEffect(() => {
        if (!editorRef.current) return;
        const el = editorRef.current;
        if (el.innerHTML !== value) {
            el.innerHTML = value ?? '';
            lastHtml.current = el.innerHTML;
        }
    }, [value]);

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain') ?? '';
        document.execCommand('insertHTML', false, text);
    };

    return (
        <div>
            <Space style={{ marginBottom: 8 }}>
                <Button
                    size="small"
                    type={activeFormats.bold ? 'primary' : 'default'}
                    onClick={() => executeCommand('bold')}
                    style={{width:'40px'}}
                >
                    <BoldOutlined />
                </Button>
                <Button
                    size="small"
                    type={activeFormats.italic ? 'primary' : 'default'}
                    onClick={() => executeCommand('italic')}
                    style={{width:'40px'}}
                >
                    <ItalicOutlined />
                </Button>
                <Button
                    size="small"
                    type={activeFormats.underline ? 'primary' : 'default'}
                    onClick={() => executeCommand('underline')}
                    style={{width:'40px'}}
                >
                    <UnderlineOutlined />
                </Button>
            </Space>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onPaste={handlePaste}
                onMouseUp={updateButtonStates}
                onKeyUp={updateButtonStates}
                style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    minHeight: '100px',
                    outline: 'none',
                }}
            />
        </div>
    );
};
