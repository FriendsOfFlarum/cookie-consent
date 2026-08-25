<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Http\CookieFactory;
use FoF\CookieConsent\CategoryRegistry;

class CategoryProvider extends AbstractServiceProvider
{
    public function register(): void
    {
        // Extensions contribute to these through `Extend\CookieConsent`, whose
        // extenders may already have seeded them — extenders run before
        // providers register, so only bind a default when nothing is there.
        foreach (['fof-cookie-consent.categories', 'fof-cookie-consent.gated'] as $key) {
            if (!$this->container->bound($key)) {
                $this->container->instance($key, []);
            }
        }

        $this->container->singleton(CategoryRegistry::class, function ($container) {
            return new CategoryRegistry(
                $container->make('fof-cookie-consent.categories'),
                $container->make(CookieFactory::class)
            );
        });
    }
}
