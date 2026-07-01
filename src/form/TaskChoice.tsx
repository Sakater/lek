import {Modal} from "antd";
import {PlusCircleTwoTone, SearchOutlined} from "@ant-design/icons";
import {DrawerContext} from "./DrawerContext";
import {use, useEffect, useState} from "react";
import {motion} from "framer-motion";
import "./TaskChoice.css";

type Props = {
    open: boolean;
    onClose: () => void;
};

const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {staggerChildren: 0.1, delayChildren: 0.15},
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

export function TaskChoice({open, onClose}: Props) {
    const {openDrawer} = use(DrawerContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={isMobile ? "100vw" : 480}
            centered={!isMobile}
            closable={true}
            className="task-choice-modal"
            style={isMobile ? {top: 0, maxWidth: "100vw", padding: 0, height: "100vh"} : undefined}
            destroyOnClose
        >
            <div className="task-choice-header">
                <h2>Aufgabe hinzufügen</h2>
                <p>Wähle, wie du eine neue Aufgabe erstellen möchtest</p>
            </div>

            <motion.div
                className="task-choice-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={open ? "open" : "closed"}
            >
                <motion.div
                    className="task-choice-card search-card"
                    variants={cardVariants}
                    whileHover={{y: -4, scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    onClick={() => {
                        openDrawer("searchOpen");
                        onClose();
                    }}
                >
                    <div className="task-choice-icon">
                        <SearchOutlined/>
                    </div>
                    <h3>Frage finden</h3>
                    <p>Suche nach vorhandenen Fragen und übernehme sie</p>
                </motion.div>

                <motion.div
                    className="task-choice-card create-card"
                    variants={cardVariants}
                    whileHover={{y: -4, scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    onClick={() => {
                        openDrawer("taskTypeChoiceOpen");
                        onClose();
                    }}
                >
                    <div className="task-choice-icon">
                        <PlusCircleTwoTone/>
                    </div>
                    <h3>Neue Frage erstellen</h3>
                    <p>Erstelle eine eigene Frage von Grund auf</p>
                </motion.div>
            </motion.div>
        </Modal>
    );
}
