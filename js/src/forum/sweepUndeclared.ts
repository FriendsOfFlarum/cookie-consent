import { findUndeclared } from './undeclaredCookies';

/** The library's own consent record — erasing it would forget the answer. */
const CONSENT_COOKIE = 'cc_cookie';

type SweepOptions = {
  /** `document.cookie` at the moment of the sweep. */
  jar: string;
  /** Every cookie name or `/pattern/` some category declared. */
  declared: string[];
  /** Admin-listed names or `/patterns/` to spare. */
  allowed: string[];
  /** Paths to attempt deletion at — see `candidatePaths`. */
  paths: string[];
  /** Erases one cookie at one path; injected so this stays pure and testable. */
  erase: (name: string, path: string) => void;
};

/**
 * Erase cookies that no extension declared.
 *
 * The category system can only manage what extensions declare through
 * `Extend\CookieConsent`. This is the catch-all for everything else: on
 * decline, anything undeclared is erased.
 *
 * That is deliberately aggressive — an extension that has not adopted the
 * extender loses its cookies, which may break it. The allow-list is the escape
 * hatch: an admin can spare a cookie that is genuinely necessary while its
 * author catches up.
 */
export default function sweepUndeclared({ jar, declared, allowed, paths, erase }: SweepOptions): void {
  // The consent cookie is spared unconditionally rather than relying on it
  // being declared — a misconfiguration must not make the banner forget the
  // visitor's answer and reappear on every page.
  const spared = [...declared, ...allowed, CONSENT_COOKIE];

  // A cookie is only removed when the delete is issued at the path it was set
  // on, which `document.cookie` does not reveal — so every candidate is tried.
  findUndeclared(jar, spared).forEach((name) => paths.forEach((path) => erase(name, path)));
}
