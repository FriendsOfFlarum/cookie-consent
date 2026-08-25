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
 * The 2.0 migration maps the retired `ccTheme` values onto the new
 * layout/position settings. These tests protect the upgrade path: an existing
 * forum must keep a banner that looks as close as possible to the old one.
 */
class MigrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-cookie-consent');
    }

    /** @return callable */
    private function migration()
    {
        $migration = include __DIR__.'/../../migrations/2026_08_25_000000_migrate_theme_to_layout.php';

        return $migration['up'];
    }

    private function seedTheme(string $theme): void
    {
        $db = $this->database();

        $db->table('settings')->where('key', 'fof-cookie-consent.ccTheme')->delete();
        $db->table('settings')->insert(['key' => 'fof-cookie-consent.ccTheme', 'value' => $theme]);
    }

    private function storedSetting(string $key): ?string
    {
        return $this->database()->table('settings')->where('key', "fof-cookie-consent.$key")->value('value');
    }

    #[Test]
    public function blocky_theme_becomes_a_box_layout(): void
    {
        $this->prepareDatabase([]);
        $this->seedTheme('blocky');

        ($this->migration())($this->database()->getSchemaBuilder());

        $this->assertSame('box', $this->storedSetting('layout'));
    }

    #[Test]
    public function classic_theme_becomes_a_cloud_layout(): void
    {
        $this->prepareDatabase([]);
        $this->seedTheme('classic');

        ($this->migration())($this->database()->getSchemaBuilder());

        $this->assertSame('cloud', $this->storedSetting('layout'));
    }

    #[Test]
    public function no_css_theme_disables_the_bundled_stylesheet(): void
    {
        $this->prepareDatabase([]);
        $this->seedTheme('no_css');

        ($this->migration())($this->database()->getSchemaBuilder());

        $this->assertSame('1', $this->storedSetting('disableCss'));
    }

    #[Test]
    public function the_retired_theme_setting_is_removed(): void
    {
        $this->prepareDatabase([]);
        $this->seedTheme('blocky');

        ($this->migration())($this->database()->getSchemaBuilder());

        $this->assertNull($this->storedSetting('ccTheme'));
    }

    #[Test]
    public function an_unrecognised_theme_falls_back_to_box(): void
    {
        $this->prepareDatabase([]);
        $this->seedTheme('something-custom');

        ($this->migration())($this->database()->getSchemaBuilder());

        $this->assertSame('box', $this->storedSetting('layout'));
    }
}
