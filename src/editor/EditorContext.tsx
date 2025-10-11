import React, { createContext, useContext, useMemo, useState } from 'react'
import type { Editor } from '@tiptap/react'

type EditorContextValue = {
    activeEditor: Editor | null
    setActiveEditor: (editor: Editor | null) => void
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined)

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeEditor, setActiveEditor] = useState<Editor | null>(null)
    const value = useMemo(() => ({ activeEditor, setActiveEditor }), [activeEditor])
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export const useEditorHub = () => {
    const ctx = useContext(EditorContext)
    if (!ctx) throw new Error('useEditorHub must be used within EditorProvider')
    return ctx
}

