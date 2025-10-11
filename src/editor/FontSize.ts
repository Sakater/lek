import { Extension } from '@tiptap/core'
import {TextStyle} from '@tiptap/extension-text-style'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType
            unsetFontSize: () => ReturnType
        }
    }
}

export const FontSize = Extension.create({
    name: 'fontSize',

    addOptions() {
        return {}
    },

    // Hängt das Attribut 'fontSize' an den bestehenden 'textStyle'-Mark.
    addGlobalAttributes() {
        return [
            {
                types: ['textStyle', TextStyle.toString()],
                attributes: {
                    fontSize: {
                        default: null as string | null,
                        parseHTML: element => element.style.fontSize || null,
                        renderHTML: attrs => (attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {}),
                    },
                },
            },
        ]
    },

    addCommands() {
        return {
            setFontSize:
                size =>
                    ({ chain }) =>
                        chain().setMark('textStyle', { fontSize: size }).run(),

            unsetFontSize:
                () =>
                    ({ chain }) =>
                        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        }
    },
})
