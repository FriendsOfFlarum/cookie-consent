<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent\Extend;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Frontend\Document;
use FoF\CookieConsent\Category;
use FoF\CookieConsent\ScriptGate;
use Illuminate\Contracts\Container\Container;

/**
 * Declare the cookies an extension sets, so visitors can decline them.
 *
 * ```php
 * (new Extend\CookieConsent())
 *     ->category('analytics', fn (Category $category) => $category
 *         ->cookiePattern('^_ga')
 *         ->cookie('_gid'))
 *     ->gate('analytics'),
 * ```
 *
 * Cookies in a declined category are erased by the browser, and any script
 * tags the extension adds to the document head are held inert until the
 * visitor consents.
 */
class CookieConsent implements ExtenderInterface
{
    private array $categories = [];
    private array $gated = [];

    /**
     * Declare a category of cookies, or add to one another extension declared.
     *
     * @param string                    $key       A category name, e.g. `analytics` or `marketing`.
     * @param callable(Category): mixed $configure Receives the category to configure.
     */
    public function category(string $key, callable $configure): self
    {
        $this->categories[$key][] = $configure;

        return $this;
    }

    /**
     * Hold this extension's `<script>` tags until the given category is
     * accepted. Tags already marked `type="text/plain"` are left alone, so an
     * extension may gate its own scripts explicitly instead.
     */
    public function gate(string $category): self
    {
        $this->gated[] = $category;

        return $this;
    }

    public function extend(Container $container, ?Extension $extension = null): void
    {
        if ($this->categories !== []) {
            // Extenders run before service providers register, and in an order
            // that is not guaranteed between extensions, so the binding may not
            // exist yet. Seed it rather than relying on `extend()`, which is a
            // silent no-op against an unbound key.
            $existing = $container->bound('fof-cookie-consent.categories')
                ? $container->make('fof-cookie-consent.categories')
                : [];

            foreach ($this->categories as $key => $configurators) {
                $existing[$key] = array_merge($existing[$key] ?? [], $configurators);
            }

            $container->instance('fof-cookie-consent.categories', $existing);
        }

        foreach ($this->gated as $category) {
            $container->resolving('flarum.frontend.forum', function ($frontend) use ($category) {
                // Snapshot the head before and after the other content
                // callbacks run, so only entries added while this category is
                // active are gated. Runs last (lowest priority) for that reason.
                $frontend->content(function (Document $document) use ($category) {
                    foreach ($document->head as $i => $content) {
                        if (is_string($content)) {
                            $document->head[$i] = ScriptGate::gate($content, $category);
                        }
                    }
                }, -100);
            });
        }
    }
}
