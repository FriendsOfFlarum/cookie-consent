# Cookie Consent by FriendsOfFlarum

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/friendsofflarum/cookie-consent/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/cookie-consent.svg)](https://packagist.org/packages/fof/cookie-consent) [![Total Downloads](https://img.shields.io/packagist/dt/fof/cookie-consent.svg)](https://packagist.org/packages/fof/cookie-consent) [![OpenCollective](https://img.shields.io/badge/opencollective-fof-blue.svg)](https://opencollective.com/fof/donate)

A [Flarum](https://flarum.org) extension. Adds a cookie consent banner, with accept, decline and configure options for your users.

## Features

- Accept and decline buttons, styled with equal weight by default
- Preferences dialog listing every cookie the forum stores, and why
- Flarum's own cookies declared out of the box
- Extender for other extensions to declare their cookies and gate their scripts
- Declining blocks tracking scripts before the browser loads them
- Optional catch-all to erase cookies no extension has declared
- Follows your forum theme, including dark mode
- All wording translatable

## Installation

```sh
composer require fof/cookie-consent:"*"
```

## Updating

```sh
composer update fof/cookie-consent
php flarum cache:clear
```

## Configuration

Enable the extension and the banner appears. Everything else is optional.

- **Layout and position** — shape of the banner and where it sits
- **Equal weight buttons** — on by default, so decline isn't visually buried
- **Colours** — blank inherits your forum theme. Set one to override it
- **Learn more link** — URL to your privacy policy
- **Erase undeclared cookies** — see below

To test, clear the `cc_cookie` cookie for your site, or use a private window.

## Cookie categories

Three categories are built in — `necessary`, `analytics` and `marketing`. Only `necessary` is used until an extension declares cookies for the others, so a forum running nothing that tracks shows a single section.

`necessary` covers Flarum's own cookies:

| Cookie | Purpose |
| --- | --- |
| `flarum_session` | Keeps you signed in |
| `flarum_remember` | Signs you back in on your next visit |
| `locale` | Your chosen display language |
| `cc_cookie` | Your cookie choice, so you aren't asked again |

These can't be declined and are never erased. Other categories appear when an installed extension declares them.

## Wording

Banner text isn't an admin setting — it lives in the language files so it can be translated. Override the keys with [FoF Linguist](https://github.com/FriendsOfFlarum/linguist) or a language pack:

```yml
fof-cookie-consent:
  forum:
    banner:
      description: We use cookies to make this site work.
      accept: Accept
      decline: Decline
```

## Undeclared cookies

Extensions that haven't adopted the extender are invisible to the category system. The **Erase cookies no extension has declared** setting handles those: on decline, any cookie nothing declared is erased.

It's blunt. An extension that hasn't adopted the extender will lose its cookies, which may break it. Use the allow list to spare anything it needs.

## Limitations

The extender covers third party `<script>` tags, which is what most trackers use. It won't help with:

- Cookies set by PHP — they're sent before any JavaScript runs
- Tracking pixels and iframes — not scripts, so not gated
- `localStorage` and IndexedDB — not cookies
- `HttpOnly` cookies — invisible to JavaScript, so the catch-all can't see them

Anything in that list needs a server-side consent check.

## Extending

If your extension sets cookies, or loads a script that does, declare it. Add this to your `extend.php`:

```php
(new Extend\Conditional())
    ->whenExtensionEnabled('fof-cookie-consent', fn () => [
        (new FoF\CookieConsent\Extend\CookieConsent())
            ->category('analytics', function (FoF\CookieConsent\Category $category) {
                $category
                    ->cookiePattern('^_ga', 'acme-analytics.forum.cookies.ga')
                    ->cookie('_gid', 'acme-analytics.forum.cookies.gid');
            })
            ->gate('analytics'),
    ]),
```

`Extend\Conditional` keeps it a soft dependency — without fof/cookie-consent installed, your extension behaves as before.

Add it to your `composer.json` so it boots first:

```json
"extra": {
    "flarum-extension": {
        "optional-dependencies": ["fof/cookie-consent"]
    }
}
```

### Declaring cookies

`category()` creates a category, or adds to one another extension already declared, so several extensions can share `analytics`.

| Method | Does |
| --- | --- |
| `cookie('_gid', $key)` | Declares one cookie, with a translation key describing it |
| `cookiePattern('^_pk_', $key)` | Same, for a family of cookies |
| `essential()` | Always on, can't be declined, never erased |
| `reloadOnReject()` | Reloads the page after rejection |
| `translations($title, $description)` | Names the category's own strings — third-party categories only |

Declared cookies are erased when the category is declined, and listed in the preferences dialog either way.

The description key is optional but worth supplying: without one the dialog shows the cookie name and an empty purpose.

`reloadOnReject()` is for scripts that can't cleanly undo themselves once loaded — most analytics libraries.

### Gating scripts

`gate()` holds your `<script>` tags until the category is accepted.

Tags you add to the document head are rewritten to `type="text/plain"` with a `data-category`. The browser treats them as data, so it never fetches the `src` and never runs them — no request, no cookie. On acceptance the consent library swaps the type back and the script runs.

Tags you've already marked `type="text/plain"` are left alone, so you can gate them yourself. JSON-LD, import maps and speculation rules are never gated.

### Categories and translations

`necessary`, `analytics` and `marketing` are defined here, translations included. Use those keys where they fit — several extensions contributing to `analytics` then share one section, rather than each shipping its own wording for it. Passing `translations()` on one of these does nothing; ours win.

Any other key is yours, and needs its own strings:

```php
->category('livechat', function (Category $category) {
    $category
        ->cookie('_lc', 'acme-livechat.forum.consent.cookies.lc')
        ->translations('acme-livechat.forum.consent.title', 'acme-livechat.forum.consent.description');
})
```

Cookie descriptions are always yours, whichever category they sit in — only you know what `_lc` does. Ship the strings with your extension:

```yml
acme-livechat:
  forum:
    consent:
      title: Live chat
      description: Powers the chat widget in the corner.
      cookies:
        lc: Keeps your chat session open between pages.
```

### Reacting to consent

If your JavaScript needs to run after a gated script loads, listen for the consent events:

```js
window.addEventListener('cc:onConsent', configure);
window.addEventListener('cc:onChange', configure);
```

[FoF Analytics](https://github.com/FriendsOfFlarum/analytics) uses all of the above if you want a working example.

## Links

- [Source code on GitHub](https://github.com/friendsofflarum/cookie-consent)
- [Report an issue](https://github.com/friendsofflarum/cookie-consent/issues)
- [Download via Packagist](https://packagist.org/packages/fof/cookie-consent)
