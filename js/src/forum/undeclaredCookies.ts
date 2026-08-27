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
export function candidatePaths(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);

  return segments.reduce(
    (paths: string[], segment) => [...paths, `${paths[paths.length - 1] === '/' ? '' : paths[paths.length - 1]}/${segment}`],
    ['/']
  );
}

/** Parse `document.cookie` into the set of names it holds. */
function names(jar: string): string[] {
  return Array.from(
    new Set(
      jar
        .split(';')
        .map((pair) => pair.split('=')[0].trim())
        .filter(Boolean)
    )
  );
}

/**
 * Build a matcher for one declared entry. A name wrapped in slashes is a
 * pattern; a malformed one is ignored rather than throwing, so a bad
 * declaration cannot break consent handling for the whole forum.
 */
function matcher(declared: string): (name: string) => boolean {
  const pattern = declared.match(/^\/(.*)\/$/);

  if (!pattern) return (name) => name === declared;

  try {
    const expression = new RegExp(pattern[1]);

    return (name) => expression.test(name);
  } catch (e) {
    return () => false;
  }
}

/**
 * The cookies currently set that no category has declared.
 *
 * @param jar `document.cookie`, passed in so this stays pure and testable.
 * @param declared Every declared cookie name or `/pattern/`.
 */
export function findUndeclared(jar: string, declared: string[]): string[] {
  const matchers = declared.map(matcher);

  return names(jar).filter((name) => !matchers.some((matches) => matches(name)));
}
