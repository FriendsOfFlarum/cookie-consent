<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent\Tests\unit;

use FoF\CookieConsent\Category;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
    #[Test]
    public function a_category_carries_its_key_and_cookies(): void
    {
        $category = (new Category('analytics'))->cookie('_ga')->cookie('_gid');

        $this->assertSame('analytics', $category->key);
        $this->assertSame(['_ga', '_gid'], $category->cookies);
    }

    #[Test]
    public function cookies_may_be_declared_as_patterns(): void
    {
        $this->assertSame(['^_ga'], (new Category('analytics'))->cookiePattern('^_ga')->patterns);
    }

    #[Test]
    public function a_category_is_optional_by_default(): void
    {
        $this->assertFalse((new Category('analytics'))->essential);
    }

    #[Test]
    public function essential_categories_cannot_be_declined(): void
    {
        $this->assertTrue((new Category('necessary'))->essential()->essential);
    }

    #[Test]
    public function a_cookie_may_carry_its_own_translation_key(): void
    {
        $category = (new Category('analytics'))
            ->cookie('_gid', 'fof-analytics.forum.cookies._gid')
            ->cookiePattern('^_ga', 'fof-analytics.forum.cookies._ga');

        $this->assertSame([
            '_gid'   => 'fof-analytics.forum.cookies._gid',
            '/^_ga/' => 'fof-analytics.forum.cookies._ga',
        ], $category->descriptions);
    }

    #[Test]
    public function a_cookie_without_a_key_has_no_description(): void
    {
        $this->assertSame([], (new Category('analytics'))->cookie('_gid')->descriptions);
    }

    #[Test]
    public function a_third_party_category_may_name_its_own_title_and_description(): void
    {
        // `analytics` and friends are translated by this extension; anything
        // else keeps whatever its author supplied.
        $category = (new Category('livechat'))
            ->translations('acme-livechat.forum.consent.title', 'acme-livechat.forum.consent.description');

        $this->assertSame('acme-livechat.forum.consent.title', $category->titleKey);
        $this->assertSame('acme-livechat.forum.consent.description', $category->descriptionKey);
    }

    #[Test]
    public function translation_keys_are_compiled_for_the_frontend(): void
    {
        $compiled = (new Category('livechat'))
            ->cookie('_gid', 'fof-analytics.forum.cookies._gid')
            ->translations('acme-livechat.forum.consent.title')
            ->toArray();

        $this->assertSame('acme-livechat.forum.consent.title', $compiled['titleKey']);
        $this->assertSame(['_gid' => 'fof-analytics.forum.cookies._gid'], $compiled['descriptions']);
    }

    #[Test]
    public function it_compiles_to_the_libraries_category_shape(): void
    {
        $compiled = (new Category('analytics'))->cookie('_ga')->cookiePattern('^_gat')->toArray();

        $this->assertFalse($compiled['enabled']);
        $this->assertFalse($compiled['readOnly']);
        $this->assertSame([['name' => '_ga'], ['name' => '/^_gat/']], $compiled['autoClear']['cookies']);
    }

    #[Test]
    public function an_essential_category_compiles_as_read_only_without_auto_clear(): void
    {
        $compiled = (new Category('necessary'))->essential()->cookie('flarum_session')->toArray();

        $this->assertTrue($compiled['enabled']);
        $this->assertTrue($compiled['readOnly']);

        // Never erased...
        $this->assertArrayNotHasKey('autoClear', $compiled);

        // ...but still listed, so the preferences modal can show visitors what
        // the forum stores and why.
        $this->assertSame(['flarum_session'], $compiled['declaredCookies']);
    }

    #[Test]
    public function an_optional_category_also_lists_its_cookies(): void
    {
        $compiled = (new Category('analytics'))->cookie('_ga')->cookiePattern('^_gat')->toArray();

        $this->assertSame(['_ga', '/^_gat/'], $compiled['declaredCookies']);
    }

    #[Test]
    public function it_can_be_asked_to_reload_the_page_once_scripts_are_revoked(): void
    {
        $compiled = (new Category('analytics'))->cookie('_ga')->reloadOnReject()->toArray();

        $this->assertTrue($compiled['autoClear']['reloadPage']);
    }
}
