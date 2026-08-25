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
 * A group of cookies a visitor can accept or decline as a unit.
 *
 * Extensions declare their own categories through `Extend\CookieConsent`;
 * this object is what they configure, and what is compiled into the shape
 * vanilla-cookieconsent expects.
 */
class Category
{
    /** @var string[] Exact cookie names to erase when the category is declined. */
    public array $cookies = [];

    /** @var string[] Regular expressions matching cookies to erase. */
    public array $patterns = [];

    /** Essential categories are always on and cannot be declined. */
    public bool $essential = false;

    /** Whether to reload once the category's scripts have been revoked. */
    public bool $reloadOnReject = false;

    public function __construct(
        public readonly string $key
    ) {
    }

    /**
     * Declare a cookie erased when the visitor declines this category.
     */
    public function cookie(string $name): self
    {
        $this->cookies[] = $name;

        return $this;
    }

    /**
     * Declare a regular expression matching cookies to erase — useful for
     * families such as Google Analytics' `_ga`, `_gat`, `_gid`.
     *
     * The expression is passed through as-is; do not include delimiters.
     */
    public function cookiePattern(string $pattern): self
    {
        $this->patterns[] = $pattern;

        return $this;
    }

    /**
     * Mark the category as strictly necessary. It is always enabled, cannot be
     * toggled off, and its cookies are never erased.
     */
    public function essential(bool $essential = true): self
    {
        $this->essential = $essential;

        return $this;
    }

    /**
     * Reload the page once this category is declined. Use when scripts cannot
     * cleanly undo themselves at runtime.
     */
    public function reloadOnReject(bool $reload = true): self
    {
        $this->reloadOnReject = $reload;

        return $this;
    }

    /**
     * Compile to the library's category shape.
     */
    public function toArray(): array
    {
        $names = array_merge(
            $this->cookies,
            array_map(fn (string $pattern) => "/$pattern/", $this->patterns)
        );

        $compiled = [
            'enabled'  => $this->essential,
            'readOnly' => $this->essential,
            // Listed whether or not they are erased, so the preferences modal
            // can tell visitors what this category stores.
            'declaredCookies' => $names,
        ];

        // An essential category is never cleared, so it carries no autoClear
        // block — the library ignores autoClear on read-only categories anyway.
        if ($this->essential || $names === []) {
            return $compiled;
        }

        $compiled['autoClear'] = [
            'cookies' => array_map(fn (string $name) => ['name' => $name], $names),
        ];

        if ($this->reloadOnReject) {
            $compiled['autoClear']['reloadPage'] = true;
        }

        return $compiled;
    }
}
