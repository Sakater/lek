import {sanitizeHtmlWithoutP} from "../utils/sanitizeHtml.ts";

type Props = {
    numeration: string;
    question: string;
}

export function TaskHeader({numeration, question}: Props) {
    return (
        <div className="task-header">
            <div className="task-numeration" dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(numeration)}}/>
            <div className="task-question" dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(question)}}/>
        </div>
    );
};
