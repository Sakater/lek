import {Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {TaskType} from "../types";
import {use, useEffect, useState} from "react";
import {FileContext} from "../FileContext";
import {EditNote, Puzzle, Quiz, ListIcon, MappingIcon} from "../assets";
import {DrawerContext} from "./DrawerContext";
import {motion} from "framer-motion";
import "./TaskTypeChoice.css";

type Props = {
    open: boolean;
    onClose: () => void;
};

const taskTypes = [
    {
        type: TaskType.MULTIPLE_CHOICE,
        label: "Multiple-Choice",
        desc: "Erstelle eine Multiple-Choice Aufgabe",
        icon: () => <Quiz/>,
        className: "multiple-choice",
    },
    {
        type: TaskType.WRITE_IN,
        label: "Freitext",
        desc: "Freitext-Aufgabe mit eigenen Antworten",
        icon: () => <EditNote/>,
        className: "write-in",
    },
    {
        type: TaskType.MIXED,
        label: "Aufgabenmix",
        desc: "Kombiniere Multiple-Choice und Freitext",
        icon: () => (
            <span style={{display: "flex", alignItems: "center", gap: 2}}>
                <EditNote width={18} height={18}/>
                <PlusOutlined style={{fontSize: 12, color: "inherit"}}/>
                <Quiz width={18} height={18}/>
            </span>
        ),
        className: "mixed",
    },
    {
        type: TaskType.FILL_IN_THE_BLANKS,
        label: "Lückentext",
        desc: "Lücken im Text ausfüllen lassen",
        icon: () => <Puzzle/>,
        className: "fill-blanks",
    },
    {
        type: TaskType.LISTING,
        label: "Auflistung",
        desc: "Begriffe auflisten lassen",
        icon: () => <ListIcon/>,
        className: "listing",
    },
    {
        type: TaskType.MAPPING,
        label: "Zuordnung",
        desc: "Wörter und Texte einander zuordnen",
        icon: () => <MappingIcon/>,
        className: "mapping",
    },
];

const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {staggerChildren: 0.07, delayChildren: 0.15},
    },
};

const cardVariants = {
    hidden: {opacity: 0, y: 20, scale: 0.95},
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {duration: 0.35, ease: "easeOut" as const},
    },
};

export function TaskTypeChoice({open, onClose}: Props) {
    const {addTask} = use(FileContext);
    const {setSelectedTaskId, openDrawer} = use(DrawerContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleTaskCreation = (taskType: TaskType) => {
        const newTask = addTask(taskType);
        setSelectedTaskId(newTask.id);
        openDrawer("taskFormOpen");
        onClose();
    };

    useEffect(() => {
        setSelectedTaskId(null);
    }, []);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={isMobile ? "100vw" : 700}
            centered={!isMobile}
            closable={true}
            className="task-type-modal"
            style={isMobile ? {top: 0, maxWidth: "100vw", padding: 0, height: "100vh"} : undefined}
            destroyOnClose
        >
            <div className="task-type-modal-header">
                <h2>Art der Aufgabe wählen</h2>
                <p>Wähle den passenden Aufgabentyp für deine Frage</p>
            </div>

            <motion.div
                className="task-type-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={open ? "open" : "closed"}
            >
                {taskTypes.map(({type, label, desc, icon: Icon, className}) => (
                    <motion.div
                        key={type}
                        className={`task-type-card ${className}`}
                        variants={cardVariants}
                        whileHover={{y: -4, scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        onClick={() => handleTaskCreation(type)}
                    >
                        <div className="task-type-card-icon">
                            {Icon()}
                        </div>
                        <h4>{label}</h4>
                        <p>{desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </Modal>
    );
}
