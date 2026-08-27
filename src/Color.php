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

use Closure;

class Color
{
    /**
     * Build the callback `registerLessConfigVar` applies to a stored colour.
     *
     * Colours are optional. Left unset — or set to something that is not a
     * colour — the variable falls back to the given Flarum theme variable, so
     * the banner follows the forum's light/dark scheme instead of carrying a
     * palette of its own.
     */
    public static function sanitizer(string $fallback): Closure
    {
        return fn ($value) => static::sanitize($value, $fallback);
    }

    /**
     * Build the callback for a colour's *hover* variant.
     *
     * Flarum derives button hovers by darkening the base colour; do the same
     * for an admin's chosen colour so hovering shades it rather than jumping
     * to an unrelated one. With no colour set, the matching Flarum variable is
     * used and Flarum's own hover applies.
     */
    public static function hoverSanitizer(string $fallback): Closure
    {
        return function ($value) use ($fallback) {
            $color = static::sanitize($value, '');

            return $color === '' ? $fallback : static::darken($color, 0.05);
        };
    }

    /**
     * Darken a hex colour by the given fraction, matching how Flarum's
     * `.Button--color-vars` mixin derives its hover state.
     */
    public static function darken(string $hex, float $amount): string
    {
        if (!preg_match('/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', $hex, $match)) {
            return $hex;
        }

        $digits = $match[1];

        if (strlen($digits) === 3) {
            $digits = $digits[0].$digits[0].$digits[1].$digits[1].$digits[2].$digits[2];
        }

        $channels = array_map(
            fn (string $pair) => max(0, (int) round(hexdec($pair) * (1 - $amount))),
            str_split($digits, 2)
        );

        return '#'.implode('', array_map(fn (int $c) => str_pad(dechex($c), 2, '0', STR_PAD_LEFT), $channels));
    }

    /**
     * Colour settings are admin-authored but are inserted directly into the
     * Less source, so anything that is not unambiguously a colour must be
     * rejected — a value such as `#fff; } body { display: none` would
     * otherwise escape its declaration.
     */
    public static function sanitize(?string $value, string $fallback = ''): string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return $fallback;
        }

        if (preg_match('/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $value)) {
            return $value;
        }

        if (preg_match('/^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)$/', $value)) {
            return $value;
        }

        return $fallback;
    }
}
