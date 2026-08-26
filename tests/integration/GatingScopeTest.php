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

use Flarum\Frontend\Document;
use Flarum\Testing\integration\TestCase;
use FoF\CookieConsent\Extend\CookieConsent;
use PHPUnit\Framework\Attributes\Test;

/**
 * Gating must only touch the scripts of the extension that asked for it.
 *
 * The document head also carries core's own — the FontAwesome kit, the XSLT
 * polyfill — and holding those behind consent breaks the forum for anyone who
 * declines.
 */
class GatingScopeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-cookie-consent');
    }

    #[Test]
    public function a_script_added_before_the_gating_extension_is_left_alone(): void
    {
        $this->extend(
            (new \Flarum\Extend\Frontend('forum'))
                ->content(function (Document $document) {
                    $document->head[] = '<script src="https://kit.fontawesome.com/abc.js" defer></script>';
                }, 100),
            (new CookieConsent())->gate('analytics')
        );

        $html = (string) $this->send($this->request('GET', '/'))->getBody();

        $this->assertStringContainsString('kit.fontawesome.com/abc.js', $html);
        $this->assertStringNotContainsString('data-category="analytics" src="https://kit.fontawesome.com', $html);
    }

    #[Test]
    public function core_scripts_are_never_gated(): void
    {
        $this->extend((new CookieConsent())->gate('analytics'));

        $html = (string) $this->send($this->request('GET', '/'))->getBody();

        // Whatever core puts in the head must still execute.
        $this->assertStringNotContainsString('type="text/plain"', $html);
    }
}
