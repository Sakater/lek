import type {Id, Task as TaskType} from '../types';
import {OptionView} from "./OptionView.tsx";
import React, {JSX, use} from "react";
import {FileContext} from "../FileContext";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";

type Props = {
    task: TaskType,
    key?: Id
}

export function TasksView({task}: Props) {
    const {size, dynamicSize} = use(FileContext);
    const value = size;
    const pageWidth = {
        maxWidth: `${210 / value}mm`,
        minWidth: `${210 / value}mm`,
        width: `${210 / value}mm`
    }

    const helpingLines = (totalLines: number, lines: number): JSX.Element[] =>
        Array.from({length: totalLines}, (_, index) => (
            <div key={index}
                 style={{
                     marginLeft: `${dynamicSize(10)}%`,
                     marginRight: `${dynamicSize(10)}%`,
                     paddingTop: `${dynamicSize(15)}pt`
                 }}>
                {totalLines > 0 &&
                    Array.from({length: lines}, () => (
                        <div style={{
                            borderBottom: "solid black 1px",
                            paddingBottom: `${dynamicSize(10)}pt`
                        }}></div>
                    ))}
            </div>))

    //100% der Seitenbreite wird nach der Anzahl der Spalten aufgeteilt.
    const gridTemplateColumns = (((100 / task.optionsInARow) | 0) + "% ").repeat(task.optionsInARow);

    return (


        <div key={task.id}
             style={{
                 display: "inline-grid",
                 gridTemplateRows: "10% auto", ...pageWidth,
                 overflowWrap: "break-word"
             }}>
            <div key={task.id}
                 style={{
                     display: "inline-grid",
                     gridTemplateColumns: "10% auto", ...pageWidth,
                     overflowWrap: "break-word"
                 }}>
                <div
                    style={{
                        ...pageWidth,
                        fontSize: `${dynamicSize(14)}pt`,
                        paddingTop: `${dynamicSize(25)}pt`,
                        paddingLeft: `${dynamicSize(15)}pt`
                    }}
                    dangerouslySetInnerHTML={{__html: sanitizeHtml(task.numeration)}}
                />
                <div
                    style={{
                        ...pageWidth,
                        fontSize: `${dynamicSize(14)}pt`,
                        paddingTop: `${dynamicSize(25)}pt`,
                        paddingLeft: `${dynamicSize(15)}pt`
                    }}
                    dangerouslySetInnerHTML={{__html: sanitizeHtml(task.question)}}
                />
            </div>

            {task.totalLines > 0 && task.options.length === 0 &&
                <div style={{
                    paddingTop: `${dynamicSize(30)}pt`,
                    ...pageWidth
                }}>{task.options.length === 0 && task.totalLines > 0 &&
                    helpingLines(task.totalLines, task.lines)}</div>}


            <div style={{
                display: "inline-grid",
                gridTemplateColumns: gridTemplateColumns,
                gridTemplateRows: "auto",
                paddingTop: `${dynamicSize(15)}pt`

            }}>
                {/*Options*/

                    task.options.map((option, indexOption) => (
                        <OptionView option={option}
                                    totalLines={task.totalLines} lines={task.lines}
                                    indexOption={indexOption}
                                    key={option.id}
                        />
                    ))}
            </div>
        </div>
    )
}