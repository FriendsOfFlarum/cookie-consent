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
use FoF\CookieConsent\CategoryRegistry;
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
    /**
     * Content priorities bracketing the declaring extension's own callbacks,
     * which run at the default priority of 0.
     */
    private const BEFORE_EXTENSION_CONTENT = 100;
    private const AFTER_EXTENSION_CONTENT = -100;

    protected array $categories = [];
    protected array $gated = [];

    /**
     * Declare a category of cookies, or add to one another extension declared.
     *
     * @param string                    $key       A category name, e.g. `analytics` or `marketing`.
     * @param callable(Category): mixed $configure Receives the category to configure.
     */
    public function category(string $key, callable $configure): static
    {
        $this->categories[$key][] = $configure;

        return $this;
    }

    /**
     * Hold this extension's `<script>` tags until the given category is
     * accepted. Tags already marked `type="text/plain"` are left alone, so an
     * extension may gate its own scripts explicitly instead.
     */
    public function gate(string $category): static
    {
        $this->gated[] = $category;

        return $this;
    }

    public function extend(Container $container, ?Extension $extension = null): void
    {
        if ($this->categories !== []) {
            $container->extend(CategoryRegistry::DECLARATIONS, function (array $declarations) {
                foreach ($this->categories as $key => $configurators) {
                    $declarations[$key] = array_merge($declarations[$key] ?? [], $configurators);
                }

                return $declarations;
            });
        }

        foreach ($this->gated as $category) {
            $container->resolving('flarum.frontend.forum', function ($frontend) use ($category) {
                // Snapshot the head before the extension's own content
                // callbacks run...
                $before = [];

                $frontend->content(function (Document $document) use (&$before) {
                    $before = $document->head;
                }, self::BEFORE_EXTENSION_CONTENT);

                // ...and gate only what appeared since. The head also carries
                // core's scripts — the FontAwesome kit, the XSLT polyfill —
                // which must keep working for visitors who decline.
                $frontend->content(function (Document $document) use ($category, &$before) {
                    foreach ($document->head as $i => $content) {
                        if (is_string($content) && !in_array($content, $before, true)) {
                            $document->head[$i] = ScriptGate::gate($content, $category);
                        }
                    }
                }, self::AFTER_EXTENSION_CONTENT);
            });
        }
    }
}
