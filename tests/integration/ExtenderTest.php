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
