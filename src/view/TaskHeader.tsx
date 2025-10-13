import React from "react";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";
type Props= {
    numeration: string;
    question: string;
}

export function TaskHeader( {numeration, question}: Props) {
    return (
        <div className="task-header">
            <span className="task-numeration" dangerouslySetInnerHTML={{__html: sanitizeHtml(numeration)}}/>
            <p className="task-question" dangerouslySetInnerHTML={{__html: sanitizeHtml(question)}}/>
        </div>
    );
};
