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
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Settings())
        ->default('fof-cookie-consent.consentText', 'Change this text in your Flarum Admin Panel!')
        ->default('fof-cookie-consent.buttonText', 'I Accept')
        ->default('fof-cookie-consent.declineButtonText', 'Decline')
        ->default('fof-cookie-consent.learnMoreLinkText', 'Learn More')
        ->default('fof-cookie-consent.learnMoreLinkUrl', '')
        ->default('fof-cookie-consent.backgroundColor', Color::BACKGROUND)
        ->default('fof-cookie-consent.textColor', Color::TEXT)
        ->default('fof-cookie-consent.buttonBackgroundColor', Color::BUTTON_BACKGROUND)
        ->default('fof-cookie-consent.buttonTextColor', Color::BUTTON_TEXT)
        ->default('fof-cookie-consent.layout', 'box')
        ->default('fof-cookie-consent.position', 'bottom right')
        ->default('fof-cookie-consent.equalWeightButtons', '1')
        ->serializeToForum('fof-cookie-consent.consentText', 'fof-cookie-consent.consentText')
        ->serializeToForum('fof-cookie-consent.buttonText', 'fof-cookie-consent.buttonText')
        ->serializeToForum('fof-cookie-consent.declineButtonText', 'fof-cookie-consent.declineButtonText')
        ->serializeToForum('fof-cookie-consent.learnMoreLinkText', 'fof-cookie-consent.learnMoreLinkText')
        ->serializeToForum('fof-cookie-consent.learnMoreLinkUrl', 'fof-cookie-consent.learnMoreLinkUrl')
        ->serializeToForum('fof-cookie-consent.layout', 'fof-cookie-consent.layout')
        ->serializeToForum('fof-cookie-consent.position', 'fof-cookie-consent.position')
        ->serializeToForum('fof-cookie-consent.equalWeightButtons', 'fof-cookie-consent.equalWeightButtons')
        ->serializeToForum('fof-cookie-consent.backgroundColor', 'fof-cookie-consent.backgroundColor')
        ->serializeToForum('fof-cookie-consent.textColor', 'fof-cookie-consent.textColor')
        ->serializeToForum('fof-cookie-consent.buttonBackgroundColor', 'fof-cookie-consent.buttonBackgroundColor')
        ->serializeToForum('fof-cookie-consent.buttonTextColor', 'fof-cookie-consent.buttonTextColor')
        // Registering the colours as Less config vars means core recompiles the
        // stylesheet whenever one is saved.
        ->registerLessConfigVar('fof-cookie-consent-background-color', 'fof-cookie-consent.backgroundColor', Color::sanitizer(Color::BACKGROUND))
        ->registerLessConfigVar('fof-cookie-consent-text-color', 'fof-cookie-consent.textColor', Color::sanitizer(Color::TEXT))
        ->registerLessConfigVar('fof-cookie-consent-button-background-color', 'fof-cookie-consent.buttonBackgroundColor', Color::sanitizer(Color::BUTTON_BACKGROUND))
        ->registerLessConfigVar('fof-cookie-consent-button-text-color', 'fof-cookie-consent.buttonTextColor', Color::sanitizer(Color::BUTTON_TEXT)),
];
