/**
 * Keep the consent banner's theme in step with Flarum's.
 *
 * The library ships a complete dark palette behind `cc--darkmode`; Flarum
 * resolves its own light/dark/auto choice onto `data-theme` on <html>. Mirror
 * one onto the other rather than reimplementing the palette, so the banner
 * follows the forum — including when the visitor changes theme mid-session.
 */
export default function syncThemeMode(): () => void;
