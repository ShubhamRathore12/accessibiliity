import type { A11ySettings } from "./types";

export const DEFAULT_SETTINGS: A11ySettings = {
    fontSize: 0,
    lineHeight: 0,
    letterSpacing: 0,
    fontColor: "#000000",
    textCase: "initial",
    bold: false,
    italic: false,
    textAlign: "left",
    titleColor: "#000000",
    titleBackgroundColor: "#FFFFFF",
    highlightTitles: false,
    highlightLinks: false,
    hideImages: false,
    monochrome: false,
    highContrast: false,
    lowContrast: false,
};

export const FONT_COLORS = [
    { name: "Black",  value: "#000000" },
    { name: "White",  value: "#FFFFFF" },
    { name: "Red",    value: "#E53935" },
    { name: "Blue",   value: "#1565C0" },
    { name: "Green",  value: "#2E7D32" },
    { name: "Yellow", value: "#F9A825" },
    { name: "Brown",  value: "#6D4C41" },
    { name: "Gray",   value: "#757575" },
];

export const TEXT_CASE_OPTIONS = [
    { label: "Initial",   value: "initial"   as const },
    { label: "UPPERCASE", value: "uppercase" as const },
    { label: "lowercase", value: "lowercase" as const },
];

export const STORAGE_EVENT = "a11y-settings-changed";
