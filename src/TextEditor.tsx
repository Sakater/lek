import React, { useEffect, useRef, useState } from 'react';
import { Button, Space } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons';
import { execCommand, queryCommandState, saveSelection, applyColor } from './utils';

type FormatCommand = 'bold' | 'italic' | 'underline';

interface HtmlEditorProps {
    value?: string;
    onChange?: (html: string) => void;
}

export const TextEditor: React.FC<HtmlEditorProps> = ({ value = '', onChange }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const lastHtml = useRef<string>('');
    const savedRange = useRef<Range | null>(null);

    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    const [textColor, setTextColor] = useState<string>('#000000');
    const [bgColor, setBgColor] = useState<string>('#ffff00');

    useEffect(() => {
        execCommand('styleWithCSS', 'true');
    }, []);

    const updateButtonStates = () => {
        setActiveFormats({
            bold: queryCommandState('bold'),
            italic: queryCommandState('italic'),
            underline: queryCommandState('underline'),
        });
    };

    const handleInput = () => {
        const html = editorRef.current?.innerHTML ?? '';
        if (html !== lastHtml.current) {
            onChange?.(html);
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
        execCommand('insertHTML', text);
    };

    const executeFormat = (command: FormatCommand) => {
        execCommand(command);
        editorRef.current?.focus();
        updateButtonStates();
        handleInput();
    };

    const applyTextColor = (color: string) => {
        applyColor('foreColor', color, savedRange.current);
        editorRef.current?.focus();
        updateButtonStates();
        handleInput();
        savedRange.current = null;
    };

    const applyBgColor = (color: string) => {
        applyColor('hiliteColor', color, savedRange.current);
        editorRef.current?.focus();
        updateButtonStates();
        handleInput();
        savedRange.current = null;
    };

    return (
        <div>
            <Space style={{ marginBottom: 8, flexWrap: 'wrap' }}>
                <Button
                    size="small"
                    type={activeFormats.bold ? 'primary' : 'default'}
                    onClick={() => executeFormat('bold')}
                    style={{ width: 40 }}
                >
                    <BoldOutlined />
                </Button>
                <Button
                    size="small"
                    type={activeFormats.italic ? 'primary' : 'default'}
                    onClick={() => executeFormat('italic')}
                    style={{ width: 40 }}
                >
                    <ItalicOutlined />
                </Button>
                <Button
                    size="small"
                    type={activeFormats.underline ? 'primary' : 'default'}
                    onClick={() => executeFormat('underline')}
                    style={{ width: 40 }}
                >
                    <UnderlineOutlined />
                </Button>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                    <span style={{ fontSize: 12 }}>Textfarbe</span>
                    <input
                        type="color"
                        aria-label="Textfarbe"
                        value={textColor}
                        onMouseDown={() => (savedRange.current = saveSelection())}
                        onChange={(e) => {
                            setTextColor(e.target.value);
                            applyTextColor(e.target.value);
                        }}
                        style={{ width: 28, height: 24, padding: 0, border: '1px solid #d9d9d9' }}
                    />
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12 }}>Hintergrund</span>
                    <input
                        type="color"
                        aria-label="Hintergrundfarbe"
                        value={bgColor}
                        onMouseDown={() => (savedRange.current = saveSelection())}
                        onChange={(e) => {
                            setBgColor(e.target.value);
                            applyBgColor(e.target.value);
                        }}
                        style={{ width: 28, height: 24, padding: 0, border: '1px solid #d9d9d9' }}
                    />
                </label>
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
                    borderRadius: 6,
                    padding: '8px 12px',
                    minHeight: 100,
                    outline: 'none',
                }}
            />
        </div>
    );
};
