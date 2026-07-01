import {use} from "react";
import {useNavigate} from "react-router";
import {FileContext} from "../FileContext";
import {SearchOutlined, FileSearchOutlined, PlusOutlined, AppstoreOutlined} from "@ant-design/icons";
import {motion} from "framer-motion";
import "./Overview.css";

export function Overview() {
    const navigate = useNavigate();
    const {setOpenTemplateSearch} = use(FileContext);

    const cards = [
        {
            icon: <PlusOutlined/>,
            color: "blue",
            title: "Neues Dokument",
            desc: "Erstelle ein neues Arbeitsblatt von Grund auf",
            onClick: () => navigate("/editor"),
        },
        {
            icon: <SearchOutlined/>,
            color: "green",
            title: "Fragen durchsuchen",
            desc: "Finde vorhandene Fragen und übernehme sie",
            onClick: () => navigate("/editor"),
        },
        {
            icon: <FileSearchOutlined/>,
            color: "purple",
            title: "Dokumente durchsuchen",
            desc: "Suche nach vorhandenen Dokumenten",
            onClick: () => {
                setOpenTemplateSearch(true);
                navigate("/");
            },
        },
        {
            icon: <AppstoreOutlined/>,
            color: "orange",
            title: "Zum Editor",
            desc: "Wechsle direkt in den Editor",
            onClick: () => navigate("/editor"),
        },
    ];

    return (
        <div className="overview-page">
            <motion.div
                className="overview-hero"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, ease: "easeOut"}}
            >
                <h1>Übersicht</h1>
                <p>Wähle eine Aktion, um direkt loszulegen</p>
            </motion.div>

            <div className="overview-grid">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        className="overview-card"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.1 + i * 0.08, duration: 0.4, ease: "easeOut"}}
                        whileHover={{y: -4}}
                        onClick={card.onClick}
                    >
                        <div className={`overview-card-icon ${card.color}`}>
                            {card.icon}
                        </div>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
