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
    'consentText'           => 'Change this text in your Flarum Admin Panel!',
    'buttonText'            => 'I Accept',
    'declineButtonText'     => 'Decline',
    'learnMoreLinkText'     => 'Learn More',
    'learnMoreLinkUrl'      => '',
    'backgroundColor'       => '#2b2b2b',
    'textColor'             => '#ffffff',
    'buttonBackgroundColor' => '#178e99',
    'buttonTextColor'       => '#ffffff',
    'layout'                => 'box',
    'position'              => 'bottom right',
    'equalWeightButtons'    => '1',
];

/**
 * Colour settings, mapped to the Less variable each is exposed through.
 * Registering them with `registerLessConfigVar` means core recompiles the
 * stylesheet whenever one is saved.
 */
$colors = [
    'fof-cookie-consent-background-color'        => 'backgroundColor',
    'fof-cookie-consent-text-color'              => 'textColor',
    'fof-cookie-consent-button-background-color' => 'buttonBackgroundColor',
    'fof-cookie-consent-button-text-color'       => 'buttonTextColor',
];

$settingsExtender = new Extend\Settings();

foreach ($settings as $key => $default) {
    $settingsExtender = $settingsExtender
        ->default("fof-cookie-consent.$key", $default)
        ->serializeToForum("fof-cookie-consent.$key", "fof-cookie-consent.$key");
}

foreach ($colors as $variable => $key) {
    $settingsExtender = $settingsExtender->registerLessConfigVar(
        $variable,
        "fof-cookie-consent.$key",
        fn ($value) => Color::sanitize($value, $settings[$key])
    );
}

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    $settingsExtender,
];
