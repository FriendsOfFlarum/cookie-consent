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
 * The colour settings reach the stylesheet as Less variables registered
 * through `Extend\Settings::registerLessConfigVar`. Core recompiles the CSS
 * when any registered variable is saved, so the banner reflects changes
 * without a manual cache clear.
 */
class LessVariablesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-cookie-consent');
    }

    /** @return array<string, array{key: string, callback: mixed}> */
    private function lessConfig(): array
    {
        return $this->app()->getContainer()->make('flarum.less.config');
    }

    #[Test]
    public function colour_settings_are_registered_as_less_variables(): void
    {
        $config = $this->lessConfig();

        foreach ([
            'fof-cookie-consent-background-color'        => 'fof-cookie-consent.backgroundColor',
            'fof-cookie-consent-text-color'              => 'fof-cookie-consent.textColor',
            'fof-cookie-consent-button-background-color' => 'fof-cookie-consent.buttonBackgroundColor',
            'fof-cookie-consent-button-text-color'       => 'fof-cookie-consent.buttonTextColor',
        ] as $variable => $setting) {
            $this->assertArrayHasKey($variable, $config, "Missing Less variable $variable");
            $this->assertSame($setting, $config[$variable]['key']);
        }
    }

    #[Test]
    public function colour_values_are_sanitized_before_reaching_less(): void
    {
        $config = $this->lessConfig();
        $callback = $config['fof-cookie-consent-background-color']['callback'];

        $this->assertSame('#2b2b2b', $callback('#2b2b2b'));

        // An unsafe value falls back to the shipped default rather than
        // `transparent`, so the banner stays legible instead of losing its
        // background entirely.
        $this->assertSame('#2b2b2b', $callback('#fff; } body { display: none'));
        $this->assertSame('#2b2b2b', $callback('url(https://evil.example/x.png)'));
    }

    #[Test]
    public function a_missing_colour_falls_back_to_a_safe_value(): void
    {
        $config = $this->lessConfig();
        $callback = $config['fof-cookie-consent-text-color']['callback'];

        $this->assertSame('#ffffff', $callback(null));
    }
}
