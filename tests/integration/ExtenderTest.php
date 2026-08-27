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
use FoF\CookieConsent\Category;
use FoF\CookieConsent\CategoryRegistry;
use FoF\CookieConsent\Extend\CookieConsent;
use PHPUnit\Framework\Attributes\Test;

/**
 * Other extensions declare the cookies they set through the `CookieConsent`
 * extender, so declining a category actually erases them.
 */
class ExtenderTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-cookie-consent');
    }

    private function registry(): CategoryRegistry
    {
        return $this->app()->getContainer()->make(CategoryRegistry::class);
    }

    #[Test]
    public function only_the_necessary_category_exists_by_default(): void
    {
        $this->assertSame(['necessary'], array_keys($this->registry()->all()));
    }

    #[Test]
    public function the_necessary_category_is_essential(): void
    {
        $this->assertTrue($this->registry()->all()['necessary']->essential);
    }

    #[Test]
    public function the_known_categories_carry_our_own_translations(): void
    {
        $yaml = \Symfony\Component\Yaml\Yaml::parseFile(__DIR__.'/../../resources/locale/en.yml');
        $categories = $yaml['fof-cookie-consent']['forum']['categories'];

        // Owned here so three extensions declaring `analytics` do not each
        // ship competing wording for the same section.
        foreach (['necessary', 'analytics', 'marketing'] as $key) {
            $this->assertArrayHasKey($key, $categories, "no translations for the `$key` category");
            $this->assertArrayHasKey('title', $categories[$key]);
            $this->assertArrayHasKey('description', $categories[$key]);
        }
    }

    #[Test]
    public function a_known_category_ignores_translation_keys_an_extension_supplies(): void
    {
        $this->extend(
            (new CookieConsent())->category('analytics', fn (Category $c) => $c
                ->cookie('_ga')
                ->translations('some-extension.forum.analytics.title'))
        );

        $compiled = $this->registry()->toArray()['analytics'];

        // Ours wins, so the section reads consistently however many
        // extensions contribute cookies to it.
        $this->assertNull($compiled['titleKey']);
    }

    #[Test]
    public function a_third_party_category_keeps_its_own_translations(): void
    {
        $this->extend(
            (new CookieConsent())->category('livechat', fn (Category $c) => $c
                ->cookie('_lc')
                ->translations('acme-livechat.forum.consent.title'))
        );

        $compiled = $this->registry()->toArray()['livechat'];

        $this->assertSame('acme-livechat.forum.consent.title', $compiled['titleKey']);
    }

    #[Test]
    public function an_extension_can_declare_a_category(): void
    {
        $this->extend(
            (new CookieConsent())->category('analytics', fn (Category $c) => $c->cookie('_ga'))
        );

        $categories = $this->registry()->all();

        $this->assertArrayHasKey('analytics', $categories);
        $this->assertSame(['_ga'], $categories['analytics']->cookies);
    }

    #[Test]
    public function a_category_declared_before_the_provider_registers_still_lands(): void
    {
        // Extenders run before service providers, so the extender cannot rely
        // on the container binding already existing.
        $this->extend(
            (new CookieConsent())->category('marketing', fn (Category $c) => $c->cookie('_fbp'))
        );

        $this->assertArrayHasKey('marketing', $this->registry()->all());
    }

    #[Test]
    public function two_extensions_may_contribute_to_the_same_category(): void
    {
        $this->extend(
            (new CookieConsent())->category('analytics', fn (Category $c) => $c->cookie('_ga')),
            (new CookieConsent())->category('analytics', fn (Category $c) => $c->cookie('_pk_id'))
        );

        $this->assertSame(['_ga', '_pk_id'], $this->registry()->all()['analytics']->cookies);
    }

    #[Test]
    public function declared_categories_are_serialized_to_the_forum(): void
    {
        $this->extend(
            (new CookieConsent())->category('analytics', fn (Category $c) => $c->cookie('_ga'))
        );

        $response = $this->send($this->request('GET', '/api'));
        $attributes = json_decode($response->getBody()->getContents(), true)['data']['attributes'];

        $categories = $attributes['fof-cookie-consent.categories'];

        $this->assertArrayHasKey('analytics', $categories);
        $this->assertFalse($categories['analytics']['readOnly']);
        $this->assertSame([['name' => '_ga']], $categories['analytics']['autoClear']['cookies']);
    }

    #[Test]
    public function the_necessary_category_is_serialized_as_read_only(): void
    {
        $response = $this->send($this->request('GET', '/api'));
        $attributes = json_decode($response->getBody()->getContents(), true)['data']['attributes'];

        $this->assertTrue($attributes['fof-cookie-consent.categories']['necessary']['readOnly']);
    }
}
