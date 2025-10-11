import React, {useEffect} from 'react'
import {EditorContent, useEditor} from '@tiptap/react'
import {StarterKit} from '@tiptap/starter-kit'
import {useEditorHub} from './EditorContext.tsx'
import {BackgroundColor, Color, FontSize, TextStyle} from '@tiptap/extension-text-style'

type EditorContentProps = React.ComponentProps<typeof EditorContent>

type Props = {
    content?: string
    onChange?: (content: string) => void
    outputFormat?: 'html' | 'json' | 'text'
} & Omit<EditorContentProps, 'editor'>

export const TextEditor: React.FC<Props> = ({
                                                content = '',
                                                onChange,
                                                outputFormat = 'html',
                                                ...editorContentProps
                                            }) => {
    const { setActiveEditor } = useEditorHub()
    const editor = useEditor({
        extensions: [StarterKit, FontSize, TextStyle, Color, BackgroundColor],
        content,
        onUpdate: ({ editor }) => {
            if (onChange) {
                let updatedContent: string
                switch (outputFormat) {
                    case 'json':
                        updatedContent = JSON.stringify(editor.getJSON())
                        break
                    case 'text':
                        updatedContent = editor.getText()
                        break
                    case 'html':
                    default:
                        updatedContent = editor.getHTML()
                        break
                }
                onChange(updatedContent)
            }
        }
    })

    useEffect(() => {
        if (!editor) return
        const onFocus = () => setActiveEditor(editor)
        const onBlur = () => setActiveEditor(null)
        editor.on('focus', onFocus)
        editor.on('blur', onBlur)
        return () => {
            editor.off('focus', onFocus)
            editor.off('blur', onBlur)
            setActiveEditor(null)
        }
    }, [editor, setActiveEditor])

    return <EditorContent editor={editor} className={`antd-custom-input ${editorContentProps.className || ''}`} {...editorContentProps}/>
}
