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

$settings = [
    'consentText'        => 'Change this text in your Flarum Admin Panel!',
    'buttonText'         => 'I Accept',
    'declineButtonText'  => 'Decline',
    'learnMoreLinkText'  => 'Learn More',
    'learnMoreLinkUrl'   => '',
    'backgroundColor'    => '#2b2b2b',
    'textColor'          => '#ffffff',
    'buttonBackgroundColor' => '#178e99',
    'buttonTextColor'    => '#ffffff',
    'layout'             => 'box',
    'position'           => 'bottom right',
    'equalWeightButtons' => '1',
];

$settingsExtender = new Extend\Settings();

foreach ($settings as $key => $default) {
    $settingsExtender = $settingsExtender
        ->default("fof-cookie-consent.$key", $default)
        ->serializeToForum("fof-cookie-consent.$key", "fof-cookie-consent.$key");
}

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\ServiceProvider())
        ->register(Providers\AssetProvider::class),

    $settingsExtender,
];
