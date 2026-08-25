<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent\Tests\integration;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class SettingsTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-cookie-consent');
    }

    #[Test]
    public function default_settings_are_registered(): void
    {
        $settings = $this->app()->getContainer()->make(SettingsRepositoryInterface::class);

        $this->assertSame('I Accept', $settings->get('fof-cookie-consent.buttonText'));
        $this->assertSame('Decline', $settings->get('fof-cookie-consent.declineButtonText'));
        $this->assertSame('box', $settings->get('fof-cookie-consent.layout'));
        $this->assertSame('bottom right', $settings->get('fof-cookie-consent.position'));
    }

    #[Test]
    public function settings_are_serialized_to_the_forum(): void
    {
        $response = $this->send($this->request('GET', '/api'));

        $data = json_decode($response->getBody()->getContents(), true);
        $attributes = $data['data']['attributes'];

        $this->assertArrayHasKey('fof-cookie-consent.consentText', $attributes);
        $this->assertArrayHasKey('fof-cookie-consent.declineButtonText', $attributes);
        $this->assertArrayHasKey('fof-cookie-consent.layout', $attributes);
        $this->assertArrayHasKey('fof-cookie-consent.position', $attributes);
        $this->assertArrayHasKey('fof-cookie-consent.equalWeightButtons', $attributes);
    }

    #[Test]
    public function removed_theme_setting_is_no_longer_serialized(): void
    {
        $response = $this->send($this->request('GET', '/api'));

        $data = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayNotHasKey('fof-cookie-consent.ccTheme', $data['data']['attributes']);
    }
}
