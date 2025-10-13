import React, {JSX, use} from "react";
import type {Id, Option} from "../types";
import {FileContext} from "../FileContext";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";

type OptionViewProps = {
    option: Option;
    indexOption: number;
    totalLines: number;
    helpingLines: number;
    key?: Id

}

export function OptionView ({option,  indexOption, totalLines, helpingLines}: OptionViewProps)  {
    const alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const { dynamicSize} = use(FileContext);
    const drawHelpingLines = (totalLines: number, helpingLines: number): JSX.Element[] =>
        Array.from({length: totalLines}, (_, index) => (
            <div key={index}
                 style={{
                     marginRight: `${dynamicSize(30)}pt`,
                     paddingTop: `${dynamicSize(10)}pt`
                 }}>
                {totalLines > 0 &&
                    Array.from({length: helpingLines}, () => (
                        <div key={Math.random()}
                            style={{
                            borderBottom: "solid black 1px",
                            paddingBottom: `${dynamicSize(10)}pt`
                        }}></div>
                    ))}
            </div>))
    return (
        <div key={option.id} style={{
            textAlign: "left",
            paddingTop: "30pt",
            paddingLeft: `${dynamicSize(12)}pt`,
            display: "inline-grid",
            gridTemplateColumns: "10% auto",
            gridTemplateRows: "100%",
            fontSize: `${dynamicSize(12)}pt`
        }}>
            <div>{`${alphabet.at(indexOption)}) `}</div>
            <div style={{overflow: "hidden"}}>
            <div dangerouslySetInnerHTML={{__html: sanitizeHtml(option.name) || ""}}/>
                {totalLines > 0 &&
                    drawHelpingLines(totalLines, helpingLines)}
                {/*Array.from({length: totalLines}, (_, index) => (
                    <div key={index} style={{marginRight: "10%", marginTop: "5%"}}>
                        {helpingLines > 0 &&
                            Array.from({length: helpingLines}, (_) => (
                                <div style={{borderBottom: "solid black 1px", marginBottom: "3%"}}></div>
                            ))}
                    </div>))*/}
            </div>


        </div>
    )
}