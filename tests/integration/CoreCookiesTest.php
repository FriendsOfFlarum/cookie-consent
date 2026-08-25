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

use Flarum\Foundation\Config;
use Flarum\Http\CookieFactory;
use Flarum\Testing\integration\TestCase;
use FoF\CookieConsent\CategoryRegistry;
use PHPUnit\Framework\Attributes\Test;

/**
 * The banner should account for the cookies Flarum itself sets, so the
 * preferences modal can tell visitors what is stored and why — rather than
 * listing only whatever third-party extensions happen to declare.
 */
class CoreCookiesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-cookie-consent');
    }

    private function necessary(): array
    {
        return $this->app()->getContainer()->make(CategoryRegistry::class)->all()['necessary']->cookies;
    }

    #[Test]
    public function the_session_and_remember_cookies_are_declared(): void
    {
        $cookies = $this->necessary();

        $this->assertContains('flarum_session', $cookies);
        $this->assertContains('flarum_remember', $cookies);
    }

    #[Test]
    public function the_locale_cookie_is_declared(): void
    {
        // Core reads an unprefixed `locale` cookie to pick the display
        // language. It is necessary — losing it resets the visitor's language.
        $this->assertContains('locale', $this->necessary());
    }

    #[Test]
    public function the_consent_cookie_itself_is_declared(): void
    {
        $this->assertContains('cc_cookie', $this->necessary());
    }

    #[Test]
    public function core_cookies_honour_a_custom_cookie_prefix(): void
    {
        // `cookie.name` in config.php renames every core cookie, so the names
        // come from core's CookieFactory rather than being hardcoded.
        $config = new Config([
            'url'    => 'http://localhost',
            'cookie' => ['name' => 'discuss'],
        ]);

        $registry = new CategoryRegistry([], new CookieFactory($config));

        $this->assertContains('discuss_session', $registry->all()['necessary']->cookies);
        $this->assertContains('discuss_remember', $registry->all()['necessary']->cookies);
    }

    #[Test]
    public function necessary_cookies_are_never_erased(): void
    {
        $compiled = $this->app()->getContainer()->make(CategoryRegistry::class)->toArray();

        // They are declared for transparency in the preferences modal, but the
        // category is read-only so the library never clears them.
        $this->assertTrue($compiled['necessary']['readOnly']);
        $this->assertArrayNotHasKey('autoClear', $compiled['necessary']);
    }
}
