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

use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Schema;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\ServiceProvider())
        ->register(Providers\CategoryProvider::class),

    (new Extend\ApiResource(ForumResource::class))
        ->fields(fn () => [
            // The declared categories, compiled into the shape the frontend
            // library expects. Only `necessary` exists until an extension
            // declares more through `Extend\CookieConsent`.
            Schema\Arr::make('fof-cookie-consent.categories')
                ->get(fn () => resolve(CategoryRegistry::class)->toArray()),
        ]),

    (new Extend\Settings())
        ->default('fof-cookie-consent.learnMoreLinkUrl', '')
        ->default('fof-cookie-consent.layout', 'box')
        ->default('fof-cookie-consent.position', 'bottom right')
        ->default('fof-cookie-consent.equalWeightButtons', '1')
        ->default('fof-cookie-consent.sweepUndeclared', '')
        ->default('fof-cookie-consent.allowedCookies', '')
        ->serializeToForum('fof-cookie-consent.learnMoreLinkUrl', 'fof-cookie-consent.learnMoreLinkUrl')
        ->serializeToForum('fof-cookie-consent.layout', 'fof-cookie-consent.layout')
        ->serializeToForum('fof-cookie-consent.position', 'fof-cookie-consent.position')
        ->serializeToForum('fof-cookie-consent.equalWeightButtons', 'fof-cookie-consent.equalWeightButtons')
        ->serializeToForum('fof-cookie-consent.sweepUndeclared', 'fof-cookie-consent.sweepUndeclared')
        ->serializeToForum('fof-cookie-consent.allowedCookies', 'fof-cookie-consent.allowedCookies')
        ->serializeToForum('fof-cookie-consent.backgroundColor', 'fof-cookie-consent.backgroundColor')
        ->serializeToForum('fof-cookie-consent.textColor', 'fof-cookie-consent.textColor')
        ->serializeToForum('fof-cookie-consent.buttonBackgroundColor', 'fof-cookie-consent.buttonBackgroundColor')
        ->serializeToForum('fof-cookie-consent.buttonTextColor', 'fof-cookie-consent.buttonTextColor')
        // Registering the colours as Less config vars means core recompiles the
        // stylesheet whenever one is saved.
        ->registerLessConfigVar('fof-cookie-consent-background-color', 'fof-cookie-consent.backgroundColor', Color::sanitizer('var(--body-bg)'))
        ->registerLessConfigVar('fof-cookie-consent-text-color', 'fof-cookie-consent.textColor', Color::sanitizer('var(--text-color)'))
        ->registerLessConfigVar('fof-cookie-consent-button-background-color', 'fof-cookie-consent.buttonBackgroundColor', Color::sanitizer('var(--button-primary-bg)'))
        ->registerLessConfigVar('fof-cookie-consent-button-text-color', 'fof-cookie-consent.buttonTextColor', Color::sanitizer('var(--button-primary-color)'))
        // Hovering shades the admin's own colour rather than jumping to
        // Flarum's; unset, Flarum's precomputed hover applies.
        ->registerLessConfigVar('fof-cookie-consent-button-hover-color', 'fof-cookie-consent.buttonBackgroundColor', Color::hoverSanitizer('var(--button-primary-bg-hover)')),
];
