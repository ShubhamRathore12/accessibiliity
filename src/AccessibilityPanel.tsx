import { gsap } from "gsap";
import React, { FC, useEffect, useRef, useState } from "react";
import { applySettings, loadSettings, saveSettings } from "./applySettings";
import { DEFAULT_SETTINGS, FONT_COLORS, STORAGE_EVENT, TEXT_CASE_OPTIONS } from "./constants";
import type { A11yPanelProps, A11ySettings } from "./types";

// ─── Static CSS (injected once) ───────────────────────────────────────────────
const PANEL_CSS = `
/* ── backdrop ── */
.ra11y-backdrop {
    position:fixed;inset:0;
    background:rgba(0,0,0,.45);
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
    z-index:9998;opacity:0;pointer-events:none;
}
.ra11y-backdrop.ra11y-visible { pointer-events:all; }

/* ── panel ── */
.ra11y-panel {
    position:fixed;
    bottom:0;left:0;right:0;
    width:100%;
    max-height:92vh;
    z-index:9999;
    display:flex;flex-direction:column;
    border-radius:20px 20px 0 0;
    overflow:hidden;
    box-shadow:0 -8px 40px rgba(0,0,0,.25);
    background:#fff;opacity:0;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    box-sizing:border-box;
}
/* desktop: bottom-right anchored panel */
@media (min-width:600px) {
    .ra11y-panel {
        left:auto;
        width:360px;
        max-height:calc(100vh - 120px);
        border-radius:16px;
        box-shadow:0 8px 40px rgba(0,0,0,.22),0 2px 8px rgba(0,0,0,.1);
    }
}

/* ── drag handle (mobile only) ── */
.ra11y-drag-handle {
    width:40px;height:4px;border-radius:2px;
    background:rgba(255,255,255,.5);
    margin:10px auto 4px;flex-shrink:0;
}
@media (min-width:600px) { .ra11y-drag-handle { display:none; } }

/* ── header ── */
.ra11y-header {
    flex-shrink:0;
    padding:16px 16px 0;
    background:var(--ra11y-header,var(--ra11y-accent,linear-gradient(120deg,#1b5e20 0%,#2e7d32 55%,#388e3c 100%)));
    color:#fff;
}
.ra11y-header-row {
    display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;
}
.ra11y-icon-circle {
    width:36px;height:36px;border-radius:50%;
    background:var(--ra11y-icon-bg,rgba(255,255,255,.18));
    display:flex;align-items:center;justify-content:center;
    margin-right:10px;flex-shrink:0;
}
.ra11y-title  { font-size:1rem;font-weight:700;line-height:1.2;margin:0; }
.ra11y-subtitle { font-size:.72rem;opacity:.75;margin:0;line-height:1.3; }

/* close button */
.ra11y-close-btn {
    width:32px;height:32px;border-radius:50%;border:none;cursor:pointer;
    background:rgba(255,255,255,.14);color:#fff;
    display:flex;align-items:center;justify-content:center;
    font-size:1.1rem;line-height:1;transition:background .18s;
    flex-shrink:0;
}
.ra11y-close-btn:hover { background:rgba(255,255,255,.28); }

/* tabs */
.ra11y-tabs { display:flex;gap:4px;margin-top:8px; }
.ra11y-tab {
    padding:6px 12px;border-radius:8px 8px 0 0;cursor:pointer;font-size:.78rem;
    color:rgba(255,255,255,.85);background:transparent;border:none;
    transition:all .18s;font-weight:400;font-family:inherit;
}
.ra11y-tab:hover { background:rgba(255,255,255,.15); }
.ra11y-tab.active {
    background:#fff;
    color:var(--ra11y-accent,#2e7d32);
    font-weight:700;
}

/* ── scrollable content ── */
.ra11y-content {
    flex:1;overflow-y:auto;overflow-x:hidden;
    padding:16px 16px 8px;
    background:#fff;
}
.ra11y-content::-webkit-scrollbar { width:4px; }
.ra11y-content::-webkit-scrollbar-track { background:#f0f0f0;border-radius:4px; }
.ra11y-content::-webkit-scrollbar-thumb { background:#c8e6c9;border-radius:4px; }

/* section label */
.ra11y-section-label {
    font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
    color:var(--ra11y-accent,#2e7d32);display:block;margin-bottom:8px;
}

/* counter row */
.ra11y-counter-row {
    display:flex;align-items:center;justify-content:space-between;
    background:#f8faf8;border:1px solid #e8f0e8;border-radius:10px;
    padding:10px 14px;margin-bottom:10px;
}
.ra11y-counter-label { font-size:.85rem;color:#374151;font-weight:500;min-width:110px; }
.ra11y-counter-controls { display:flex;align-items:center;gap:10px; }
.ra11y-icon-btn {
    width:30px;height:30px;border-radius:8px;border:none;cursor:pointer;
    background:#e8f0e8;
    color:var(--ra11y-accent,#2e7d32);
    font-size:1.1rem;font-weight:700;
    display:flex;align-items:center;justify-content:center;
    transition:all .18s;line-height:1;font-family:inherit;
}
.ra11y-icon-btn:hover {
    background:var(--ra11y-accent,#2e7d32);
    color:#fff;
}
.ra11y-counter-value {
    min-width:52px;text-align:center;font-weight:700;font-size:.85rem;
    border-radius:8px;padding:4px 8px;transition:all .2s;
}
.ra11y-counter-value.nonzero {
    color:var(--ra11y-accent,#2e7d32);
    background:linear-gradient(135deg,#e8f5e9,#c8e6c9);
}
.ra11y-counter-value.zero { color:#9e9e9e;background:#f5f5f5; }

/* style buttons */
.ra11y-style-btns { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px; }
.ra11y-style-btn {
    width:38px;height:38px;border-radius:8px;border:1.5px solid #ddd;
    background:#fafafa;color:#757575;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all .18s;font-family:inherit;
}
.ra11y-style-btn:hover,
.ra11y-style-btn.active {
    border-color:var(--ra11y-accent,#2e7d32);
    background:#e8f5e9;
    color:var(--ra11y-accent,#2e7d32);
}

/* chips */
.ra11y-chips { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px; }
.ra11y-chip {
    padding:5px 14px;border-radius:20px;font-size:.8rem;cursor:pointer;
    border:1px solid #ddd;background:#f0f0f0;color:#374151;
    transition:all .18s;font-family:inherit;
}
.ra11y-chip.active {
    background:var(--ra11y-accent,#2e7d32);
    color:#fff;
    border-color:var(--ra11y-accent,#2e7d32);
    font-weight:700;
}
.ra11y-chip:hover:not(.active) { background:#e0e0e0; }

/* color swatches */
.ra11y-swatches { display:flex;gap:10px;flex-wrap:wrap;padding-left:2px;margin-bottom:16px; }
.ra11y-swatch {
    width:34px;height:34px;border-radius:50%;cursor:pointer;
    transition:all .18s;border:2px solid #ddd;box-sizing:border-box;
    padding:0;
}
.ra11y-swatch:hover { transform:scale(1.15);border-color:var(--ra11y-accent,#2e7d32); }
.ra11y-swatch.active {
    border:3px solid var(--ra11y-accent,#2e7d32);
    box-shadow:0 0 0 3px rgba(46,125,50,.22);
}

/* toggle rows */
.ra11y-toggle-row {
    display:flex;align-items:center;justify-content:space-between;
    border-radius:10px;padding:10px 14px;margin-bottom:10px;
    border:1px solid #e8f0e8;background:#f8faf8;transition:all .2s;
}
.ra11y-toggle-row.checked { background:#f0f9f0;border-color:#c8e6c9; }
.ra11y-toggle-label { font-size:.85rem;color:#374151;font-weight:500; }
.ra11y-toggle-desc  { font-size:.72rem;color:#9e9e9e;display:block; }

/* toggle switch */
.ra11y-switch { position:relative;width:36px;height:20px;flex-shrink:0; }
.ra11y-switch input { opacity:0;width:0;height:0; }
.ra11y-switch-track {
    position:absolute;inset:0;border-radius:10px;background:#ccc;
    cursor:pointer;transition:background .2s;
}
.ra11y-switch-track::before {
    content:'';position:absolute;height:14px;width:14px;
    left:3px;top:3px;border-radius:50%;background:#fff;
    transition:transform .2s;
}
.ra11y-switch input:checked + .ra11y-switch-track {
    background:var(--ra11y-accent,#2e7d32);
}
.ra11y-switch input:checked + .ra11y-switch-track::before { transform:translateX(16px); }

/* ── footer ── */
.ra11y-footer {
    flex-shrink:0;display:flex;gap:10px;
    padding:12px 16px;
    border-top:1px solid #e8f0e8;background:#fafcfa;
}
.ra11y-btn {
    flex:1;padding:10px;border-radius:10px;font-size:.875rem;font-weight:600;
    cursor:pointer;border:none;transition:all .18s;font-family:inherit;
}
.ra11y-btn-reset {
    background:transparent;
    color:var(--ra11y-reset,#e53935);
    border:1.5px solid var(--ra11y-reset,#e53935);
}
.ra11y-btn-reset:hover {
    background:var(--ra11y-reset-hover,#ffeaea);
}
.ra11y-btn-done {
    background:var(--ra11y-done,var(--ra11y-accent,linear-gradient(120deg,#2e7d32,#388e3c)));
    color:#fff;
    box-shadow:0 2px 8px var(--ra11y-done-shadow,rgba(46,125,50,.35));
}
.ra11y-btn-done:hover {
    background:var(--ra11y-done-hover,var(--ra11y-accent,linear-gradient(120deg,#1b5e20,#2e7d32)));
}
`;

function injectPanelStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("react-a11y-panel-ui-styles")) return;
    const style = document.createElement("style");
    style.id = "react-a11y-panel-ui-styles";
    style.textContent = PANEL_CSS;
    document.head.appendChild(style);
}

// ─── Inline SVGs ──────────────────────────────────────────────────────────────
const SvgBold        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>;
const SvgItalic      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>;
const SvgAlignLeft   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>;
const SvgAlignCenter = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>;
const SvgAlignRight  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>;
const SvgClose       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const SvgA11y        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>;

const Toggle: FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <label className="ra11y-switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="ra11y-switch-track" />
    </label>
);

// ─── Panel ────────────────────────────────────────────────────────────────────

type Tab = "Typography" | "Colors" | "Display";
const TABS: Tab[] = ["Typography", "Colors", "Display"];

export const AccessibilityPanel: FC<A11yPanelProps & { open: boolean; onClose: () => void }> = ({
    open,
    onClose,
    storageKey = "a11y-settings",
    fabOffset = 28,
    fabSideOffset = 28,
    position = "bottom-right",
    accentColor,
    headerGradient,
    doneButtonGradient,
    doneButtonHoverGradient,
    resetColor,
    iconBgColor,
}) => {
    const [settings, setSettings] = useState<A11ySettings>({ ...DEFAULT_SETTINGS });
    const [activeTab, setActiveTab] = useState<Tab>("Typography");
    const [isClient, setIsClient] = useState(false);
    const [mounted, setMounted] = useState(false);

    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef    = useRef<HTMLDivElement>(null);
    const contentRef  = useRef<HTMLDivElement>(null);

    useEffect(() => {
        injectPanelStyles();
        setIsClient(true);
        setSettings(loadSettings(storageKey));
    }, [storageKey]);

    useEffect(() => {
        if (open) setMounted(true);
    }, [open]);

    // ── GSAP enter / exit ──
    useEffect(() => {
        if (!mounted) return;
        const bd = backdropRef.current;
        const pn = panelRef.current;
        if (!bd || !pn) return;

        const isMobile = window.innerWidth < 600;
        const isLeft = position.includes("left");
        const isTop  = position.includes("top");
        // Desktop: slide from the side the panel is on; Mobile: always slide from bottom
        const slideX = isLeft ? "-110%" : "110%";
        const slideY = isTop  ? "-100%" : "100%";

        if (open) {
            bd.classList.add("ra11y-visible");
            gsap.set(bd, { opacity: 0 });
            gsap.set(pn, {
                opacity: 0,
                ...(isMobile ? { y: "100%", x: 0 } : { x: slideX, y: 0 }),
            });
            gsap.to(bd, { opacity: 1, duration: 0.22, ease: "power1.out" });
            gsap.to(pn, {
                opacity: 1,
                ...(isMobile ? { y: "0%" } : { x: "0%" }),
                duration: 0.38,
                ease: "power3.out",
                onComplete: animateItems,
            });
        } else {
            const exitMobile = window.innerWidth < 600;
            gsap.to(bd, { opacity: 0, duration: 0.18, ease: "power1.in", onComplete: () => bd.classList.remove("ra11y-visible") });
            gsap.to(pn, {
                opacity: 0,
                ...(exitMobile ? { y: "100%" } : { x: slideX }),
                duration: 0.28,
                ease: "power3.in",
                onComplete: () => setMounted(false),
            });
        }
    }, [open, mounted, position]);

    const animateItems = () => {
        if (!contentRef.current) return;
        const items = Array.from(contentRef.current.querySelectorAll<HTMLElement>(".ra11y-anim"));
        if (items.length) {
            gsap.fromTo(items,
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.065, duration: 0.26, ease: "power2.out" }
            );
        }
    };

    useEffect(() => {
        if (open) setTimeout(animateItems, 20);
    }, [activeTab, open]);

    // Auto-save & apply
    useEffect(() => {
        if (!isClient) return;
        saveSettings(storageKey, settings);
        applySettings(settings);
        window.dispatchEvent(new Event(STORAGE_EVENT));
    }, [settings, isClient, storageKey]);

    const update = <K extends keyof A11ySettings>(k: K, v: A11ySettings[K]) =>
        setSettings((p) => ({ ...p, [k]: v }));
    const toggle = (k: keyof A11ySettings) =>
        setSettings((p) => ({ ...p, [k]: !p[k] }));

    const handleReset = () => {
        setSettings({ ...DEFAULT_SETTINGS });
        saveSettings(storageKey, { ...DEFAULT_SETTINGS });
        applySettings({ ...DEFAULT_SETTINGS });
        window.dispatchEvent(new Event(STORAGE_EVENT));
    };

    if (!isClient || !mounted) return null;

    // ── Desktop panel position: sits next to the FAB based on position prop ──
    const fabOffsetNum = typeof fabOffset === "number" ? fabOffset : parseInt(fabOffset as string, 10) || 28;
    const fabSideNum   = typeof fabSideOffset === "number" ? fabSideOffset : parseInt(fabSideOffset as string, 10) || 28;
    const isLeft  = position.includes("left");
    const isTop   = position.includes("top");
    const panelGap = fabOffsetNum + 52 + 12; // FAB height 52 + gap 12

    // CSS custom-property overrides injected inline on the panel element
    const cssVars: Record<string, string> = {};
    if (accentColor)              cssVars["--ra11y-accent"]       = accentColor;
    if (headerGradient)           cssVars["--ra11y-header"]       = headerGradient;
    if (doneButtonGradient)       cssVars["--ra11y-done"]         = doneButtonGradient;
    if (doneButtonHoverGradient)  cssVars["--ra11y-done-hover"]   = doneButtonHoverGradient;
    if (resetColor)               cssVars["--ra11y-reset"]        = resetColor;
    if (iconBgColor)              cssVars["--ra11y-icon-bg"]      = iconBgColor;
    if (accentColor)              cssVars["--ra11y-done-shadow"]  = accentColor + "59";

    return (
        <>
            {/* Backdrop */}
            <div ref={backdropRef} className="ra11y-backdrop" onClick={onClose} />

            {/* Panel */}
            <div
                ref={panelRef}
                className="ra11y-panel"
                role="dialog"
                aria-label="Accessibility Settings"
                aria-modal="true"
                style={{
                    ...(isTop  ? { top: panelGap }    : { bottom: panelGap }),
                    ...(isLeft ? { left: fabSideNum }  : { right: fabSideNum }),
                    ...(cssVars as React.CSSProperties),
                }}
            >
                {/* Drag handle — CSS hides on desktop via media query */}
                <div className="ra11y-drag-handle" />

                {/* Header */}
                <div className="ra11y-header">
                    <div className="ra11y-header-row">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div className="ra11y-icon-circle"><SvgA11y /></div>
                            <div>
                                <p className="ra11y-title">Accessibility</p>
                                <p className="ra11y-subtitle">Customize your experience</p>
                            </div>
                        </div>
                        <button className="ra11y-close-btn" onClick={onClose} aria-label="Close">
                            <SvgClose />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="ra11y-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                className={`ra11y-tab${activeTab === tab ? " active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div ref={contentRef} className="ra11y-content">

                    {/* ── Typography ── */}
                    {activeTab === "Typography" && (
                        <>
                            <div className="ra11y-anim">
                                <span className="ra11y-section-label">Size &amp; Spacing</span>
                                {(
                                    [
                                        { label: "Font Size",      key: "fontSize"      as const, min: 0 },
                                        { label: "Line Height",    key: "lineHeight"    as const, min: -50 },
                                        { label: "Letter Spacing", key: "letterSpacing" as const, min: -50 },
                                    ]
                                ).map(({ label, key, min }) => {
                                    const val = settings[key] as number;
                                    const atMin = val <= min;
                                    const atMax = val >= 100;
                                    return (
                                        <div key={key} className="ra11y-counter-row">
                                            <span className="ra11y-counter-label">{label}</span>
                                            <div className="ra11y-counter-controls">
                                                <button
                                                    className="ra11y-icon-btn"
                                                    onClick={() => update(key, Math.max(min, val - 10))}
                                                    disabled={atMin}
                                                    style={atMin ? { opacity: 0.35, cursor: "not-allowed" } : {}}
                                                >−</button>
                                                <span className={`ra11y-counter-value ${val !== 0 ? "nonzero" : "zero"}`}>
                                                    {val > 0 ? `+${val}` : val}%
                                                </span>
                                                <button
                                                    className="ra11y-icon-btn"
                                                    onClick={() => update(key, Math.min(100, val + 10))}
                                                    disabled={atMax}
                                                    style={atMax ? { opacity: 0.35, cursor: "not-allowed" } : {}}
                                                >+</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="ra11y-anim" style={{ marginTop: 14 }}>
                                <span className="ra11y-section-label">Style</span>
                                <div className="ra11y-style-btns">
                                    <button
                                        className={`ra11y-style-btn${settings.bold ? " active" : ""}`}
                                        onClick={() => toggle("bold")} title="Bold"
                                    ><SvgBold /></button>
                                    <button
                                        className={`ra11y-style-btn${settings.italic ? " active" : ""}`}
                                        onClick={() => toggle("italic")} title="Italic"
                                    ><SvgItalic /></button>
                                    {(["left", "center", "right"] as const).map((al, i) => {
                                        const Icon = [SvgAlignLeft, SvgAlignCenter, SvgAlignRight][i];
                                        return (
                                            <button
                                                key={al}
                                                className={`ra11y-style-btn${settings.textAlign === al ? " active" : ""}`}
                                                onClick={() => update("textAlign", al)}
                                                title={`Align ${al}`}
                                            ><Icon /></button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="ra11y-anim">
                                <span className="ra11y-section-label">Text Case</span>
                                <div className="ra11y-chips">
                                    {TEXT_CASE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            className={`ra11y-chip${settings.textCase === opt.value ? " active" : ""}`}
                                            onClick={() => update("textCase", opt.value)}
                                        >{opt.label}</button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Colors ── */}
                    {activeTab === "Colors" && (
                        <>
                            {(
                                [
                                    { label: "Font Color",       key: "fontColor"            as const },
                                    { label: "Title Color",      key: "titleColor"           as const },
                                    { label: "Title Background", key: "titleBackgroundColor" as const },
                                ]
                            ).map(({ label, key }) => (
                                <div key={key} className="ra11y-anim" style={{ marginBottom: 18 }}>
                                    <span className="ra11y-section-label">{label}</span>
                                    <div className="ra11y-swatches">
                                        {FONT_COLORS.map((c) => (
                                            <button
                                                key={c.value}
                                                className={`ra11y-swatch${settings[key] === c.value ? " active" : ""}`}
                                                style={{ backgroundColor: c.value }}
                                                title={c.name}
                                                aria-label={c.name}
                                                onClick={() => update(key, c.value)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* ── Display ── */}
                    {activeTab === "Display" && (
                        <>
                            <div className="ra11y-anim">
                                <span className="ra11y-section-label">Content</span>
                                {(
                                    [
                                        { label: "Highlight Titles", desc: "Yellow highlight on all headings", key: "highlightTitles" as const },
                                        { label: "Highlight Links",  desc: "Yellow highlight on all links",   key: "highlightLinks"  as const },
                                        { label: "Hide Images",      desc: "Remove all images from the page", key: "hideImages"      as const },
                                    ]
                                ).map(({ label, desc, key }) => (
                                    <div key={key} className={`ra11y-toggle-row${settings[key] ? " checked" : ""}`}>
                                        <div>
                                            <span className="ra11y-toggle-label">{label}</span>
                                            <span className="ra11y-toggle-desc">{desc}</span>
                                        </div>
                                        <Toggle checked={settings[key] as boolean} onChange={() => toggle(key)} />
                                    </div>
                                ))}
                            </div>
                            <div className="ra11y-anim" style={{ marginTop: 16 }}>
                                <span className="ra11y-section-label">Color Filter</span>
                                {(
                                    [
                                        { label: "Monochrome",    desc: "Grayscale filter",       key: "monochrome"   as const },
                                        { label: "High Contrast", desc: "Increase contrast",      key: "highContrast" as const },
                                        { label: "Low Contrast",  desc: "Soften visual contrast", key: "lowContrast"  as const },
                                    ]
                                ).map(({ label, desc, key }) => (
                                    <div key={key} className={`ra11y-toggle-row${settings[key] ? " checked" : ""}`}>
                                        <div>
                                            <span className="ra11y-toggle-label">{label}</span>
                                            <span className="ra11y-toggle-desc">{desc}</span>
                                        </div>
                                        <Toggle checked={settings[key] as boolean} onChange={() => toggle(key)} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div className="ra11y-footer">
                    <button className="ra11y-btn ra11y-btn-reset" onClick={handleReset}>Reset</button>
                    <button className="ra11y-btn ra11y-btn-done"  onClick={onClose}>Done</button>
                </div>
            </div>
        </>
    );
};
