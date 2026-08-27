/** The class vanilla-cookieconsent applies its dark palette behind. */
const DARK_CLASS = 'cc--darkmode';

/**
 * Keep the consent banner's theme in step with Flarum's.
 *
 * The library ships a complete dark palette behind `cc--darkmode`; Flarum
 * resolves its own light/dark/auto choice onto `data-theme` on <html>. Mirror
 * one onto the other rather than reimplementing the palette, so the banner
 * follows the forum — including when the visitor changes theme mid-session.
 */
export default function syncThemeMode(): () => void {
  const root = document.documentElement;

  const isDark = (): boolean => {
    const theme = root.getAttribute('data-theme');

    // Core resolves `auto` before writing the attribute, so its absence means
    // no choice has been applied yet — fall back to the system preference.
    if (theme) return theme.startsWith('dark');

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  };

  const apply = () => root.classList.toggle(DARK_CLASS, isDark());

  apply();

  const observer = new MutationObserver(apply);
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  // Not every environment exposes the listener API (older Safari uses
  // addListener; jsdom stubs matchMedia without either), so feature-detect.
  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  const listenable = typeof media?.addEventListener === 'function';

  if (listenable) media!.addEventListener('change', apply);

  return () => {
    observer.disconnect();

    if (listenable) media!.removeEventListener('change', apply);
  };
}
