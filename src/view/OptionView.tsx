import React, {JSX, use} from "react";
import type {Option} from "../types";
import {FileContext} from "../FileContext";

type OptionViewProps = {
    option: Option;
    indexOption: number;
    totalLines: number;
    lines: number;

}

export function OptionView ({option,  indexOption, totalLines, lines}: OptionViewProps)  {
    const alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const { dynamicSize} = use(FileContext);
    const helpingLines = (totalLines: number, lines: number): JSX.Element[] =>
        Array.from({length: totalLines}, (_, index) => (
            <div key={index}
                 style={{
                     marginRight: `${dynamicSize(30)}pt`,
                     paddingTop: `${dynamicSize(5)}pt`
                 }}>
                {totalLines > 0 &&
                    Array.from({length: lines}, () => (
                        <div style={{
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
            <div style={{overflow: "hidden"}}>{option.name}

                {totalLines > 0 &&
                    helpingLines(totalLines, lines)}{
                    /*Array.from({length: totalLines}, (_, index) => (
                        <div key={index} style={{marginRight: "10%", marginTop: "5%"}}>
                            {lines > 0 &&
                                Array.from({length: lines}, (_) => (
                                    <div style={{borderBottom: "solid black 1px", marginBottom: "3%"}}></div>
                                ))}
                        </div>))*/}</div>
        </div>
    )
}