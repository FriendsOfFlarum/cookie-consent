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

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\ServiceProvider())
        ->register(Providers\AssetProvider::class),

    (new Extend\Settings())
        ->serializeToForum('fof-cookie-consent.consentText', 'fof-cookie-consent.consentText')
        ->serializeToForum('fof-cookie-consent.buttonText', 'fof-cookie-consent.buttonText')
        ->serializeToForum('fof-cookie-consent.learnMoreLinkText', 'fof-cookie-consent.learnMoreLinkText')
        ->serializeToForum('fof-cookie-consent.learnMoreLinkUrl', 'fof-cookie-consent.learnMoreLinkUrl')
        ->serializeToForum('fof-cookie-consent.backgroundColor', 'fof-cookie-consent.backgroundColor')
        ->serializeToForum('fof-cookie-consent.textColor', 'fof-cookie-consent.textColor')
        ->serializeToForum('fof-cookie-consent.buttonBackgroundColor', 'fof-cookie-consent.buttonBackgroundColor')
        ->serializeToForum('fof-cookie-consent.buttonTextColor', 'fof-cookie-consent.buttonTextColor')
        ->serializeToForum('fof-cookie-consent.ccTheme', 'fof-cookie-consent.ccTheme'),
];
