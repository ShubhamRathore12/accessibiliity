import type { A11ySettings } from "./types";
import { DEFAULT_SETTINGS } from "./constants";

const STYLE_ID = "react-a11y-panel-styles";

// Exclude the a11y panel itself from all overrides so the panel UI is never broken
const NOT = `:not(.ra11y-panel):not(.ra11y-panel *):not(.ra11y-fab):not(.ra11y-backdrop)`;

export function applySettings(settings: A11ySettings): void {
    if (typeof window === "undefined") return;

    // Remove previous injected styles
    document.getElementById(STYLE_ID)?.remove();

    let css = "";

    if (settings.fontSize !== 0) {
        const scale = 1 + settings.fontSize / 100; // e.g. +10 → 1.1, +20 → 1.2
        const tags = `h1${NOT},h2${NOT},h3${NOT},h4${NOT},h5${NOT},h6${NOT},p${NOT},span${NOT},a${NOT},li${NOT},td${NOT},th${NOT},label${NOT},button${NOT},input${NOT},textarea${NOT},select${NOT},div${NOT}`;
        css += `${tags} { font-size: calc(1em * ${scale}) !important; }\n`;
    }

    if (settings.lineHeight !== 0) {
        css += `body${NOT}, body *${NOT} { line-height: ${1 + settings.lineHeight / 100} !important; }\n`;
    }

    if (settings.letterSpacing !== 0) {
        css += `body${NOT}, body *${NOT} { letter-spacing: ${(settings.letterSpacing / 100) * 0.1}em !important; }\n`;
    }

    if (settings.fontColor !== DEFAULT_SETTINGS.fontColor) {
        css += `body${NOT}, body *${NOT} { color: ${settings.fontColor} !important; }\n`;
    }

    if (settings.textCase !== "initial") {
        css += `body *${NOT} { text-transform: ${settings.textCase} !important; }\n`;
    }

    if (settings.bold) {
        css += `body${NOT}, body *${NOT} { font-weight: 700 !important; }\n`;
    }

    if (settings.italic) {
        css += `body${NOT}, body *${NOT} { font-style: italic !important; }\n`;
    }

    if (settings.textAlign !== "left") {
        css += `body { text-align: ${settings.textAlign} !important; }\n`;
    }

    if (settings.titleColor !== DEFAULT_SETTINGS.titleColor) {
        css += `h1${NOT},h2${NOT},h3${NOT},h4${NOT},h5${NOT},h6${NOT} { color: ${settings.titleColor} !important; }\n`;
    }

    if (settings.titleBackgroundColor !== DEFAULT_SETTINGS.titleBackgroundColor) {
        css += `h1${NOT},h2${NOT},h3${NOT},h4${NOT},h5${NOT},h6${NOT} { background-color: ${settings.titleBackgroundColor} !important; padding: 4px 10px !important; }\n`;
    }

    if (settings.highlightTitles) {
        css += `h1${NOT},h2${NOT},h3${NOT},h4${NOT},h5${NOT},h6${NOT} { background-color: #FFFF00 !important; padding: 4px 10px !important; }\n`;
    }

    if (settings.highlightLinks) {
        css += `a${NOT} { background-color: #FFFF00 !important; padding: 2px 4px !important; }\n`;
    }

    if (settings.hideImages) {
        css += `img${NOT} { display: none !important; }\n`;
    }

    if (settings.monochrome) {
        css += `html { filter: grayscale(100%) !important; }\n`;
    } else if (settings.highContrast) {
        css += `html { filter: contrast(1.5) !important; }\n`;
    } else if (settings.lowContrast) {
        css += `html { filter: contrast(0.7) !important; }\n`;
    }

    if (css) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = css;
        document.head.appendChild(style);
    }
}

export function loadSettings(storageKey: string): A11ySettings {
    if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
    try {
        const raw = localStorage.getItem(storageKey);
        if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch { /* noop */ }
    return { ...DEFAULT_SETTINGS };
}

export function saveSettings(storageKey: string, settings: A11ySettings): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(settings));
}
