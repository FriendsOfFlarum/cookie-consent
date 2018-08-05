<?php

/*
 * This file is part of Reflar.
 *
 * (c) Reflar
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Zaptech\CConsent\Listener;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class AddPusherApi
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Serializing::class, [$this, 'addAttributes']);
    }

    /**
     * @param Serializing $event
     */
    public function addAttributes(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['consentText'] = $this->settings->get('cookie-consent.consentText');
            $event->attributes['buttonText'] = $this->settings->get('cookie-consent.buttonText');
            $event->attributes['learnMoreLinkText'] = $this->settings->get('cookie-consent.learnMoreLinkText');
            $event->attributes['learnMoreLinkUrl'] = $this->settings->get('cookie-consent.learnMoreLinkUrl');
            $event->attributes['backgroundColor'] = $this->settings->get('cookie-consent.backgroundColor');
            $event->attributes['buttonBackgroundColor'] = $this->settings->get('cookie-consent.buttonBackgroundColor');
            $event->attributes['ccTheme'] = $this->settings->get('cookie-consent.ccTheme');
        }
    }
}