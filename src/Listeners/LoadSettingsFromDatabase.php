<?php

/**
 *  This file is part of fof/cookie-consent.
 *
 *  Copyright (c) FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace FoF\CookieConsent\Listeners;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class LoadSettingsFromDatabase
{
    /**
     * @var string
     */
    protected $packagePrefix = 'fof-cookie-consent.';
    /**
     * @var array
     */
    protected $fieldsToGet = [
        'consentText',
        'buttonText',
        'learnMoreLinkText',
        'learnMoreLinkUrl',
        'backgroundColor',
        'textColor',
        'buttonBackgroundColor',
        'buttonTextColor',
        'ccTheme',
    ];

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * LoadSettingsFromDatabase constructor.
     *
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Serializing $event
     */
    public function handle(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            foreach ($this->fieldsToGet as $field) {
                $value = $this->settings->get($this->packagePrefix.$field);

                if (isset($value) && !empty($value)) {
                    $event->attributes[$this->packagePrefix.$field] = $this->settings->get($this->packagePrefix.$field);
                }
            }
        }
    }
}
