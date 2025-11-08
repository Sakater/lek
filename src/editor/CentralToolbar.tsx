import React, {useRef, useEffect} from 'react'
import {useEditorHub} from './EditorContext.tsx'
import {Button, ColorPicker, Select} from "antd"
import {BgColorsOutlined, BoldOutlined, FontColorsOutlined, ItalicOutlined, UnderlineOutlined} from "@ant-design/icons"
import {useEditorState} from "@tiptap/react"
import type {ColorPickerProps} from 'antd'
import {TextDecrease, TextIncrease} from '../assets';


export const CentralToolbar: React.FC = () => {
    const {activeEditor} = useEditorHub()

    // Behalte eine lokale Referenz zum Editor
    const editorRef = useRef(activeEditor)
    const savedSelection = useRef<{ from: number, to: number } | null>(null)

    // Update die Referenz, wenn activeEditor sich ändert
    useEffect(() => {
        if (activeEditor) {
            editorRef.current = activeEditor
        }
    }, [activeEditor])

    // Dynamisches Tracking der fontSize
    const editorState = useEditorState({
        editor: activeEditor,
        selector: ({editor}) => {
            if (!editor) return {
                fontSize: '16pt',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                textColor: '#000000',
                backgroundColor: 'transparent'
            }

            const fontSize = editor.getAttributes('textStyle').fontSize
            const textColor = editor.getAttributes('textStyle').color
            const backgroundColor = editor.getAttributes('textStyle').backgroundColor

            return {
                fontSize: fontSize || '16pt',
                isBold: editor.isActive('bold'),
                isItalic: editor.isActive('italic'),
                isUnderline: editor.isActive('underline'),
                textColor: textColor || '#000000',
                backgroundColor: backgroundColor || 'transparent'
            }
        }
    })

    const onBold: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        const editor = editorRef.current
        if (!editor) return
        editor.chain().focus().toggleBold().run()
    }

    const onItalic: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        const editor = editorRef.current
        if (!editor) return
        editor.chain().focus().toggleItalic().run()
    }

    const onUnderlined: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        const editor = editorRef.current
        if (!editor) return
        editor.chain().focus().toggleUnderline().run()
    }
    const onTextColorChange: ColorPickerProps['onChange'] = (color) => {
        const editor = editorRef.current
        if (!editor) return

        const hexColor = color.toHexString()
        editor.chain().focus().setColor(hexColor).run()
    }

    const onBackgroundColorChange: ColorPickerProps['onChange'] = (color) => {
        const editor = editorRef.current
        if (!editor) return

        const hexColor = color.toHexString()
        editor.chain().focus().setBackgroundColor(hexColor).run()
    }
    const setValueFontSize = (size: string) => {
        const editor = editorRef.current
        if (!editor) return

        // Wenn eine Selection gespeichert wurde, stelle sie wieder her
        if (savedSelection.current) {
            editor
                .chain()
                .focus()
                .setTextSelection(savedSelection.current)
                .setFontSize(size)
                .run()
        } else {
            // Sonst setze fontSize auf aktuelle Selection
            editor
                .chain()
                .focus()
                .setFontSize(size)
                .run()
        }

        // Reset der gespeicherten Selection
        savedSelection.current = null
    }

    const increaseFontSize = () => {
        const editor = editorRef.current
        if (!editor) return

        const currentFontSize = editor.getAttributes('textStyle').fontSize
        const defaultSize = 16
        const currentSize = currentFontSize
            ? parseInt(currentFontSize.replace('pt', ''))
            : defaultSize
        const newSize = currentSize + 2
        editor.chain().focus().setFontSize(`${newSize}pt`).run()
    }

    const decreaseFontSize = () => {
        const editor = editorRef.current
        if (!editor) return

        const currentFontSize = editor.getAttributes('textStyle').fontSize
        const defaultSize = 16
        const currentSize = currentFontSize
            ? parseInt(currentFontSize.replace('pt', ''))
            : defaultSize
        const newSize = Math.max(8, currentSize - 2)
        editor.chain().focus().setFontSize(`${newSize}pt`).run()
    }

    // Speichere die Selektion vor dem Öffnen des Selects
    const handleSelectOpen = (open: boolean) => {
        const editor = editorRef.current
        if (open && editor) {
            const selection = editor.state.selection
            savedSelection.current = {from: selection.from, to: selection.to}
        }
    }

    return (
        <div>
            <Button
                onMouseDown={onBold}
                icon={<BoldOutlined/>}
                type={editorState?.isBold ? 'primary' : 'default'}
            />
            <Button
                onMouseDown={onItalic}
                icon={<ItalicOutlined/>}
                type={editorState?.isItalic ? 'primary' : 'default'}
            />
            <Button
                onMouseDown={onUnderlined}
                icon={<UnderlineOutlined/>}
                type={editorState?.isUnderline ? 'primary' : 'default'}
            />

            <Select
                value={editorState?.fontSize}
                style={{width: 100}}
                onOpenChange={handleSelectOpen}
                onChange={(value) => {
                    setValueFontSize(value)
                }}
                options={[
                    {value: '8pt', label: '8pt'},
                    {value: '10pt', label: '10pt'},
                    {value: '12pt', label: '12pt'},
                    {value: '14pt', label: '14pt'},
                    {value: '16pt', label: '16pt'},
                    {value: '18pt', label: '18pt'},
                    {value: '20pt', label: '20pt'},
                    {value: '24pt', label: '24pt'},
                ]}
            />

            <Button
                onMouseDown={e => {
                    e.preventDefault()
                    increaseFontSize()
                }}
                icon={<TextIncrease fill={'black'}/>}
                style={{width: '40px'}}/>

            <Button
                onMouseDown={e => {
                    e.preventDefault()
                    decreaseFontSize()
                }}
                icon={<TextDecrease fill={'black'}/>}
                style={{width: '40px'}}/>
            <ColorPicker
                value={editorState?.textColor}
                onChange={onTextColorChange}
                showText={() => <FontColorsOutlined style={{color: 'black'}}/>}
            />

            {/* Hintergrundfarbe ColorPicker */}
            <ColorPicker
                value={editorState?.backgroundColor}
                onChange={onBackgroundColorChange}
                showText={() => <BgColorsOutlined style={{color: 'red'}}/>}
            />
        </div>
    )
}
