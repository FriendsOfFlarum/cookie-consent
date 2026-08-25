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
        // Extensions contribute to these through `Extend\CookieConsent`.
        $this->container->instance('fof-cookie-consent.categories', []);
        $this->container->instance('fof-cookie-consent.gated', []);

        $this->container->singleton(CategoryRegistry::class, function ($container) {
            return new CategoryRegistry(
                $container->make('fof-cookie-consent.categories'),
                $container->make(CookieFactory::class)
            );
        });
    }

}
