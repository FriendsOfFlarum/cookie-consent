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

use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * The banner should inherit the forum's theme rather than carrying its own
 * palette, so it follows light/dark automatically. Admins may still override
 * individual colours; when they do not, nothing is emitted and Flarum's own
 * theme-aware variables apply.
 */
class ThemeIntegrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-cookie-consent');
    }

    private function lessConfig(): array
    {
        return $this->app()->getContainer()->make('flarum.less.config');
    }

    #[Test]
    public function colours_are_unset_by_default_so_the_forum_theme_applies(): void
    {
        $config = $this->lessConfig();
        $callback = $config['fof-cookie-consent-background-color']['callback'];

        // Unset falls back to the forum's own theme variable, which switches
        // between light and dark, rather than a hardcoded colour.
        $this->assertSame('var(--body-bg)', $callback(null));
        $this->assertSame('var(--body-bg)', $callback(''));
    }

    #[Test]
    public function an_admin_colour_is_still_honoured(): void
    {
        $callback = $this->lessConfig()['fof-cookie-consent-background-color']['callback'];

        $this->assertSame('#123456', $callback('#123456'));
    }

    #[Test]
    public function an_unsafe_colour_is_dropped_rather_than_injected(): void
    {
        $callback = $this->lessConfig()['fof-cookie-consent-background-color']['callback'];

        // Falling back to the theme variable is safer than emitting
        // `transparent`, which would leave the banner unreadable.
        $this->assertSame('var(--body-bg)', $callback('#fff; } body { display: none'));
    }

    #[Test]
    public function no_colour_settings_are_seeded_with_defaults(): void
    {
        $settings = $this->app()->getContainer()->make(\Flarum\Settings\SettingsRepositoryInterface::class);

        foreach (['backgroundColor', 'textColor', 'buttonBackgroundColor', 'buttonTextColor'] as $key) {
            $this->assertNull($settings->get("fof-cookie-consent.$key"), "$key should have no default");
        }
    }
}
