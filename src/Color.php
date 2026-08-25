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
    public const BACKGROUND = '#2b2b2b';
    public const TEXT = '#ffffff';
    public const BUTTON_BACKGROUND = '#178e99';
    public const BUTTON_TEXT = '#ffffff';

    /**
     * Build the callback `registerLessConfigVar` applies to a stored colour,
     * falling back to the setting's shipped default when the value is unusable.
     */
    public static function sanitizer(string $fallback): Closure
    {
        return fn ($value) => static::sanitize($value, $fallback);
    }

    /**
     * Colour settings are admin-authored but are inserted directly into the
     * Less source, so anything that is not unambiguously a colour must be
     * rejected — a value such as `#fff; } body { display: none` would
     * otherwise escape its declaration.
     */
    public static function sanitize(?string $value, string $fallback = 'transparent'): string
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
