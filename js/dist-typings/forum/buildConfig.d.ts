import type { CookieConsentConfig } from 'vanilla-cookieconsent';
type SettingReader = (key: string) => string | undefined;
/** Stands in for `app.translator.trans`. */
type Translator = (key: string) => string;
/** A category as serialized by the backend's CategoryRegistry. */
export type SerializedCategory = {
    enabled: boolean;
    readOnly: boolean;
    autoClear?: {
        cookies: {
            name: string;
        }[];
        reloadPage?: boolean;
    };
    /** Every cookie the category declares, erased or not — shown to visitors. */
    declaredCookies?: string[];
    /** Translation keys per cookie, supplied by the declaring extension. */
    descriptions?: Record<string, string>;
    /** Translation key for the category's own title. */
    titleKey?: string | null;
    /** Translation key for the category's own description. */
    descriptionKey?: string | null;
};
/**
 * Translate this extension's flat settings into a vanilla-cookieconsent config.
 *
 * Kept free of `app` and the DOM so it can be unit-tested directly; the caller
 * supplies a reader for `fof-cookie-consent.*` settings.
 *
 * Only a single, always-on `necessary` category is declared. This extension
 * shows a cookie notice with accept/decline rather than managing granular
 * consent, so there is nothing for a preferences modal to toggle.
 */
export default function buildConfig(get: SettingReader, trans: Translator, serialized?: Record<string, SerializedCategory>, onConsent?: () => void): CookieConsentConfig;
export {};
