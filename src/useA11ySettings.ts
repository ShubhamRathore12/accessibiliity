import { useEffect } from "react";
import { applySettings, loadSettings } from "./applySettings";
import { STORAGE_EVENT } from "./constants";

/**
 * Drop into your app root (e.g. _app.tsx in Next.js) to auto-apply
 * saved accessibility settings on every page, including after navigation.
 *
 * @example
 * // _app.tsx
 * import { useA11ySettings } from "react-a11y-panel";
 * useA11ySettings();
 */
export function useA11ySettings(storageKey = "a11y-settings"): void {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const apply = () => applySettings(loadSettings(storageKey));

        // Apply on mount
        apply();

        // Re-apply when settings change (same tab)
        window.addEventListener(STORAGE_EVENT, apply);

        // Re-apply on cross-tab storage changes
        const onStorage = (e: StorageEvent) => {
            if (e.key === storageKey) apply();
        };
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener(STORAGE_EVENT, apply);
            window.removeEventListener("storage", onStorage);
        };
    }, [storageKey]);
}
