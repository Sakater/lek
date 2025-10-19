import DOMPurify from "dompurify";

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

export const sanitizeHtml = (input:string|undefined):string => {
    if (!input) return '';
    if (input.trim() === '<p></p>') return '';
    return DOMPurify.sanitize(input, allowedHtml);
}

export const sanitizeHtmlWithoutP = (input:string|undefined):string => {
    if (!input) return '';
    if (input.trim() === '<p></p>') return '';
    return DOMPurify.sanitize(input, allowedHtmlWithoutP);
}

export const sanitizeHtmlToRaw = (input:string|undefined):string=> {
    if (!input) return '';
    if (input.trim() === '<p></p>') return '';
    return DOMPurify.sanitize(input, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});
}