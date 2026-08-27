/**
 * Finding cookies nothing has declared.
 *
 * Extensions that adopt `Extend\CookieConsent` declare what they set, so the
 * category system can manage it. Anything else is invisible to that system —
 * this diffs the browser's actual cookie jar against everything declared, so
 * undeclared cookies can be handled rather than silently ignored.
 *
 * Only cookies readable from JavaScript are found. Flarum's own session and
 * remember cookies are HttpOnly and never appear here, which is the desired
 * outcome: they are necessary and must not be touched.
 */
/**
 * Every path a cookie visible from `location.pathname` could be scoped to.
 *
 * A cookie is only deleted when the delete is issued at the exact path it was
 * set on, and `document.cookie` exposes names but never paths. A server that
 * omits `Path` — Clockwork does — gets the request URI's directory instead of
 * `/`, so erasing at `/` alone silently misses it. Walking the hierarchy
 * covers every path the current URL could have produced.
 */
export declare function candidatePaths(pathname: string): string[];
/**
 * The cookies currently set that no category has declared.
 *
 * @param jar `document.cookie`, passed in so this stays pure and testable.
 * @param declared Every declared cookie name or `/pattern/`.
 */
export declare function findUndeclared(jar: string, declared: string[]): string[];
