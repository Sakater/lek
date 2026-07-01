import {use, useState} from "react";
import {FileContext} from "./FileContext";
import {AddNotes, DocumentSearch} from "./assets";
import {FileSearch} from "./search/FileSearch.tsx";
import {useNavigate} from "react-router";
import {motion} from "framer-motion";
import "./Homepage.css";

export function Homepage() {
    const {openTemplateSearch, setOpenTemplateSearch} = use(FileContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const cardVariants = {
        hidden: {opacity: 0, y: 30},
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {delay: 0.2 + i * 0.15, duration: 0.5, ease: "easeOut" as const}
        })
    };

    return (
        <div className="homepage">
            <nav className="homepage-nav">
                <span className="homepage-nav-logo">TestWriter</span>
                <div className="homepage-nav-links">
                    <button className="homepage-nav-link active" onClick={() => {
                        setOpenTemplateSearch(false);
                        navigate('/');
                    }}>Start</button>
                    <button className="homepage-nav-link" onClick={() => navigate('/editor')}>Editor</button>
                </div>
                <button className="homepage-hamburger" onClick={() => setMenuOpen(p => !p)} aria-label="Menü">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
            </nav>

            <div className={`homepage-mobile-menu ${menuOpen ? 'open' : ''}`}>
                <button className="homepage-mobile-link" onClick={() => { setMenuOpen(false); setOpenTemplateSearch(false); navigate('/'); }}>Start</button>
                <button className="homepage-mobile-link" onClick={() => { setMenuOpen(false); navigate('/editor'); }}>Editor</button>
            </div>

            {!openTemplateSearch ? (
                <>
                    <motion.div
                        className="homepage-hero"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, ease: "easeOut"}}
                    >
                        <div className="homepage-hero-icon">
                            <svg viewBox="0 -960 960 960">
                                <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80Zm0-160h320v-80H320v80ZM560-40 400-200h160v-80q0-50 21-93t57-73q36-30 81.5-47t90.5-17q33 0 65 8t59 24v-322q0-33-23.5-56.5T840-880H120q-33 0-56.5 23.5T40-800v480q0 33 23.5 56.5T120-240h200v200h240v40Z"/>
                            </svg>
                        </div>
                        <h1>TestWriter</h1>
                        <p>Erstelle professionelle Arbeitsblätter und Tests mit Leichtigkeit</p>
                        <div className="homepage-hero-divider"/>
                    </motion.div>

                    <div className="homepage-cards">
                        <motion.div
                            className="homepage-card"
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            whileHover={{y: -6, boxShadow: "0 20px 40px -5px rgba(0,0,0,0.15)"}}
                            transition={{type: "spring", stiffness: 300, damping: 20}}
                            onClick={() => setOpenTemplateSearch(true)}
                        >
                            <div className="homepage-card-icon primary">
                                <DocumentSearch/>
                            </div>
                            <h3>Vorhandene Dokumente</h3>
                            <p>Suche nach vorhandenen Dokumenten, übernehme sie und passe sie nach Bedarf an</p>
                            <div className="homepage-card-arrow">
                                <svg viewBox="0 -960 960 960">
                                    <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                                </svg>
                            </div>
                        </motion.div>

                        <motion.div
                            className="homepage-card"
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            whileHover={{y: -6, boxShadow: "0 20px 40px -5px rgba(0,0,0,0.15)"}}
                            transition={{type: "spring", stiffness: 300, damping: 20}}
                            onClick={() => navigate('/editor')}
                        >
                            <div className="homepage-card-icon secondary">
                                <AddNotes/>
                            </div>
                            <h3>Neues Dokument erstellen</h3>
                            <p>Erstelle ein neues Dokument und gestalte es von Grund auf neu</p>
                            <div className="homepage-card-arrow">
                                <svg viewBox="0 -960 960 960">
                                    <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                                </svg>
                            </div>
                        </motion.div>
                    </div>
                </>
            ) : (
                <FileSearch/>
            )}
        </div>
    );
}
