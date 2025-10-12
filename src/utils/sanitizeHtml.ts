import DOMPurify from "dompurify";

const allowedHtml= {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['style'],
    ALLOWED_CSS_PROPERTIES: ['font-size', 'background-color'],
}

export const sanitizeHtml = (input:string|undefined) => {
    if (!input) return '';
    if (input.trim() === '<p></p>') return '';
    return DOMPurify.sanitize(input, allowedHtml);
}

export const sanitizeHtmlToInput = (input:string|undefined)=> {
    if (!input) return '';
    if (input.trim() === '<p></p>') return '';
    return DOMPurify.sanitize(input, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});
}