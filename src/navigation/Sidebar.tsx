import {use, useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router";
import {FileContext} from "../FileContext";
import {SearchOutlined, FileSearchOutlined} from "@ant-design/icons";
import {TaskSearch} from "../search/TaskSearch.tsx";
import "./Sidebar.css";

type SidebarLink = {
    icon: React.ReactNode;
    label: string;
    path?: string;
    action?: () => void;
};

type Props = {
    expanded: boolean;
    onToggle: (expanded: boolean) => void;
};

export function Sidebar({expanded, onToggle}: Props) {
    const {setOpenTemplateSearch} = use(FileContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [taskSearchOpen, setTaskSearchOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setMobileOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) setMobileOpen(false);
    }, [location.pathname]);

    const navLinks: SidebarLink[] = [
        {
            icon: (
                <svg viewBox="0 -960 960 960">
                    <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                </svg>
            ),
            label: "Start",
            path: "/",
        },
        {
            icon: (
                <svg viewBox="0 -960 960 960">
                    <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80Zm0-160h320v-80H320v80ZM560-40 400-200h160v-80q0-50 21-93t57-73q36-30 81.5-47t90.5-17q33 0 65 8t59 24v-322q0-33-23.5-56.5T840-880H120q-33 0-56.5 23.5T40-800v480q0 33 23.5 56.5T120-240h200v200h240v40Z"/>
                </svg>
            ),
            label: "Editor",
            path: "/editor",
        },
        {
            icon: (
                <svg viewBox="0 -960 960 960">
                    <path d="M120-120v-80l80-80v160h-80Zm140 0v-240l80-80v320h-80Zm140 0v-320l80 80v240h-80Zm140 0v-240l80 80v320h-80Zm140 0v-400l80-80v480h-80ZM120-367v-113l280-280 160 160 280-280v113L560-487 400-647 120-367Z"/>
                </svg>
            ),
            label: "Übersicht",
            path: "/overview",
        },
    ];

    const searchLinks: SidebarLink[] = [
        {
            icon: <SearchOutlined/>,
            label: "Fragen suchen",
            action: () => setTaskSearchOpen(true),
        },
        {
            icon: <FileSearchOutlined/>,
            label: "Dokumente suchen",
            action: () => {
                setOpenTemplateSearch(true);
                navigate("/");
            },
        },
    ];

    const handleNav = (link: SidebarLink) => {
        if (link.action) {
            link.action();
        } else if (link.path) {
            navigate(link.path);
        }
    };

    const isActive = (path?: string) => {
        if (!path) return false;
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {isMobile && mobileOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}/>
            )}

            {isMobile && (
                <button className="sidebar-hamburger" onClick={() => setMobileOpen(p => !p)} aria-label="Menü">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
            )}

            <aside
                className={`sidebar ${!isMobile && expanded ? "expanded" : ""} ${!isMobile && !expanded ? "collapsed" : ""} ${isMobile && mobileOpen ? "mobile-open" : ""}`}
            >
                <div className="sidebar-header">
                    <div className="sidebar-logo">TW</div>
                    <span className="sidebar-brand">TestWriter</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Navigation</div>
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            className={`sidebar-link ${isActive(link.path) ? "active" : ""}`}
                            onClick={() => handleNav(link)}
                        >
                            <span className="sidebar-link-icon">{link.icon}</span>
                            <span className="sidebar-link-label">{link.label}</span>
                        </button>
                    ))}

                    <div className="sidebar-divider"/>

                    <div className="sidebar-section-label">Suche</div>
                    {searchLinks.map((link) => (
                        <button
                            key={link.label}
                            className="sidebar-link"
                            onClick={() => handleNav(link)}
                        >
                            <span className="sidebar-link-icon">{link.icon}</span>
                            <span className="sidebar-link-label">{link.label}</span>
                        </button>
                    ))}
                </nav>

                {!isMobile && (
                    <div className="sidebar-footer">
                        <button className="sidebar-toggle-btn" onClick={() => onToggle(!expanded)}>
                            <svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor">
                                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
                            </svg>
                            <span className="sidebar-toggle-label">Einklappen</span>
                        </button>
                    </div>
                )}
            </aside>

            <TaskSearch open={taskSearchOpen} onClose={() => setTaskSearchOpen(false)}/>
        </>
    );
}
