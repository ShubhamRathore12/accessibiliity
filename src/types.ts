export interface A11ySettings {
    fontSize: number;             // -50 to 100 (%)
    lineHeight: number;           // -50 to 100 (%)
    letterSpacing: number;        // -50 to 100 (%)
    fontColor: string;            // hex
    textCase: "initial" | "uppercase" | "lowercase";
    bold: boolean;
    italic: boolean;
    textAlign: "left" | "center" | "right";
    titleColor: string;           // hex
    titleBackgroundColor: string; // hex
    highlightTitles: boolean;
    highlightLinks: boolean;
    hideImages: boolean;
    monochrome: boolean;
    highContrast: boolean;
    lowContrast: boolean;
}

export type A11yPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface A11yColorProps {
    /** Primary accent color (hex). Controls buttons, active states, labels. Default: "#2e7d32" */
    accentColor?: string;
    /** CSS gradient string for the panel header. Default: green gradient */
    headerGradient?: string;
    /** CSS gradient string for the Done button. Default: green gradient */
    doneButtonGradient?: string;
    /** CSS gradient string for Done button hover state */
    doneButtonHoverGradient?: string;
    /** Color for the Reset button text & border. Default: "#e53935" */
    resetColor?: string;
    /** Background color of the icon circle in the header. Default: "rgba(255,255,255,0.18)" */
    iconBgColor?: string;
}

export interface A11yPanelProps extends A11yColorProps {
    /** Storage key for localStorage. Default: "a11y-settings" */
    storageKey?: string;
    /** Offset of the FAB from the edge (px). Default: 28 */
    fabOffset?: string | number;
    /** Side offset of the FAB from the edge (px). Default: 28 */
    fabSideOffset?: string | number;
    /** Position of the FAB and panel. Default: "bottom-right" */
    position?: A11yPosition;
}

export interface A11yButtonProps extends A11yColorProps {
    /** Offset from the edge (px). Default: 28 */
    bottom?: string | number;
    /** Side offset from the edge (px). Default: 28 */
    right?: string | number;
    /** Position of the FAB button on screen. Default: "bottom-right" */
    position?: A11yPosition;
    /** Storage key passed to the panel. Default: "a11y-settings" */
    storageKey?: string;
}
