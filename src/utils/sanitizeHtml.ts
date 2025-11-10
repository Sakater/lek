import DOMPurify from "dompurify";
import type {FormEvent} from "react";

const allowedHtml= {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'p', 'br', 'span', 'li', 'ul', 'ol', 'dl', 'dd', 'dt'],
    ALLOWED_ATTR: ['style'],
    ALLOWED_CSS_PROPERTIES: ['font-size', 'background-color'],
}
const allowedHtmlWithoutP= {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'br', 'span', 'li', 'ul', 'ol', 'dl', 'dd', 'dt'],
    ALLOWED_ATTR: ['style'],
    ALLOWED_CSS_PROPERTIES: ['font-size', 'background-color'],
}

export const sanitizeHtml = (input:string|undefined|FormEvent<HTMLDivElement>):string => {
    if (!input) return '';
    if (typeof input==="string"){
    if (input.trim() === '<p></p>') return '';
    return DOMPurify.sanitize(input, allowedHtml);
    }
    else return ''
}

export const sanitizeHtmlWithoutP = (input:string|undefined|FormEvent<HTMLDivElement>):string => {
    if (!input) return '';
    if (typeof input==="string"){
        if ( input.trim() === '<p></p>') return '';
        return DOMPurify.sanitize(input, allowedHtmlWithoutP);
    }
    else return ''

}

export const sanitizeHtmlToRaw = (input:string|undefined):string=> {
    if (!input) return '';
    if (input.trim() === '<p></p>') return '';
    return DOMPurify.sanitize(input, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});
}