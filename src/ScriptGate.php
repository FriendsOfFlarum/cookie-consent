<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent;

/**
 * Holds `<script>` tags inert until the visitor accepts a category.
 *
 * vanilla-cookieconsent activates a script marked `type="text/plain"` and
 * tagged with an accepted `data-category`, swapping the type back so the
 * browser runs it. Until then the browser neither fetches nor executes it —
 * so declining genuinely prevents third-party requests, rather than only
 * clearing up afterwards.
 */
class ScriptGate
{
    /**
     * Script types that are data, not code. The browser never executes these,
     * so gating them would only break whatever reads them.
     */
    private const DATA_TYPES = [
        'application/json',
        'application/ld+json',
        'importmap',
        'speculationrules',
        'text/plain',
    ];

    /**
     * Mark every executable script in `$html` as belonging to `$category`.
     *
     * Scripts that are already gated, or that hold data rather than code, are
     * returned untouched — so an extension may gate its own scripts explicitly
     * and this becomes a no-op.
     */
    public static function gate(string $html, string $category): string
    {
        if (stripos($html, '<script') === false) {
            return $html;
        }

        $attribute = htmlspecialchars($category, ENT_QUOTES, 'UTF-8');

        return preg_replace_callback(
            '/<script\b([^>]*)>/i',
            function (array $match) use ($attribute): string {
                $attributes = $match[1];

                if (self::shouldSkip($attributes)) {
                    return $match[0];
                }

                // Drop any existing type; the library restores the script by
                // removing the `text/plain` type it finds here.
                $attributes = preg_replace('/\s+type\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $attributes);

                return '<script type="text/plain" data-category="'.$attribute.'"'.$attributes.'>';
            },
            $html
        );
    }

    /**
     * Whether a script tag should be left as-is: already gated, or carrying
     * data rather than executable code.
     */
    private static function shouldSkip(string $attributes): bool
    {
        if (preg_match('/\bdata-category\s*=/i', $attributes)) {
            return true;
        }

        if (! preg_match('/\btype\s*=\s*("([^"]*)"|\'([^\']*)\'|([^\s>]+))/i', $attributes, $type)) {
            return false;
        }

        $value = strtolower(trim($type[2] ?? $type[3] ?? $type[4] ?? ''));

        return in_array($value, self::DATA_TYPES, true);
    }
}
