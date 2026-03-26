import { gsap } from "gsap";
import React, { FC, useEffect, useRef, useState } from "react";
import { AccessibilityPanel } from "./AccessibilityPanel";
import type { A11yButtonProps } from "./types";

const BTN_CSS = `
.ra11y-fab {
    position:fixed;display:flex;align-items:center;justify-content:center;
    width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;
    background:var(--ra11y-fab-bg,linear-gradient(135deg,#2e7d32 0%,#388e3c 100%));
    color:#fff;z-index:1200;
    box-shadow:0 4px 16px var(--ra11y-fab-shadow,rgba(46,125,50,.45));
    transition:transform .2s ease,box-shadow .2s ease;
    font-family:inherit;opacity:0;
}
.ra11y-fab:hover {
    transform:scale(1.1)!important;
    box-shadow:0 6px 22px var(--ra11y-fab-shadow,rgba(46,125,50,.55));
}
.ra11y-fab::before {
    content:'';position:absolute;inset:-4px;border-radius:50%;
    border:2px solid var(--ra11y-fab-ring,rgba(46,125,50,.35));
    animation:ra11y-fab-pulse 2.2s ease-out infinite;
}
@keyframes ra11y-fab-pulse {
    0%   { transform:scale(1); opacity:.65; }
    100% { transform:scale(1.55); opacity:0; }
}
`;

function injectFabStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("react-a11y-fab-styles")) return;
    const s = document.createElement("style");
    s.id = "react-a11y-fab-styles";
    s.textContent = BTN_CSS;
    document.head.appendChild(s);
}

const SvgA11y: FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
    </svg>
);

export const AccessibilityButton: FC<A11yButtonProps> = ({
    bottom = 28,
    right = 28,
    position = "bottom-right",
    storageKey = "a11y-settings",
    accentColor,
    headerGradient,
    doneButtonGradient,
    doneButtonHoverGradient,
    resetColor,
    iconBgColor,
}) => {
    const [open, setOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        injectFabStyles();
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !btnRef.current) return;
        gsap.set(btnRef.current, { scale: 0 });
        gsap.to(btnRef.current, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)", delay: 0.6 });
    }, [isClient]);

    const handleOpen = () => {
        setOpen(true);
        if (btnRef.current) {
            gsap.to(btnRef.current, { scale: 0.88, duration: 0.1, yoyo: true, repeat: 1 });
        }
    };

    if (!isClient) return null;

    // Position the FAB based on the position prop
    const offsetNum = typeof bottom === "number" ? bottom : parseInt(bottom as string, 10) || 28;
    const sideNum   = typeof right  === "number" ? right  : parseInt(right  as string, 10) || 28;

    const fabPos: React.CSSProperties = {};
    if (position.includes("bottom")) fabPos.bottom = offsetNum; else fabPos.top = offsetNum;
    if (position.includes("right"))  fabPos.right  = sideNum;  else fabPos.left = sideNum;

    const fabStyle: React.CSSProperties = {
        ...fabPos,
        ...(accentColor ? {
            "--ra11y-fab-bg": accentColor,
            "--ra11y-fab-shadow": accentColor + "73",
            "--ra11y-fab-ring": accentColor + "59",
        } as React.CSSProperties : {}),
    };

    return (
        <>
            <button
                ref={btnRef}
                className="ra11y-fab"
                style={fabStyle}
                onClick={handleOpen}
                aria-label="Open accessibility settings"
                title="Accessibility Settings"
            >
                <SvgA11y />
            </button>
            <AccessibilityPanel
                open={open}
                onClose={() => setOpen(false)}
                storageKey={storageKey}
                fabOffset={bottom}
                fabSideOffset={right}
                position={position}
                accentColor={accentColor}
                headerGradient={headerGradient}
                doneButtonGradient={doneButtonGradient}
                doneButtonHoverGradient={doneButtonHoverGradient}
                resetColor={resetColor}
                iconBgColor={iconBgColor}
            />
        </>
    );
};
