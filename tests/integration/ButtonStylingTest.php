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
use Less_Parser;
use PHPUnit\Framework\Attributes\Test;

/**
 * The banner's buttons should behave like every other button on the forum,
 * including their hover and active states. Flarum precomputes those variants
 * per theme, so they are inherited rather than reinvented.
 */
class ButtonStylingTest extends TestCase
{
    /** Compile the forum stylesheet with the colour variables left unset. */
    private function compile(array $overrides = []): string
    {
        $vars = array_merge([
            'fof-cookie-consent-background-color'        => 'var(--body-bg)',
            'fof-cookie-consent-text-color'              => 'var(--text-color)',
            'fof-cookie-consent-button-background-color' => 'var(--button-primary-bg)',
            'fof-cookie-consent-button-text-color'       => 'var(--button-primary-color)',
            'fof-cookie-consent-button-hover-color'      => 'var(--button-primary-bg-hover)',
        ], $overrides);

        $declarations = '';

        foreach ($vars as $name => $value) {
            $declarations .= "@$name: $value;";
        }

        $parser = new Less_Parser(['compress' => false]);
        $parser->parse($declarations);
        $parser->parseFile(__DIR__.'/../../resources/less/forum.less');

        return $parser->getCss();
    }

    #[Test]
    public function the_accept_button_uses_flarums_hover_and_active_variables(): void
    {
        $css = $this->compile();

        $this->assertStringContainsString('--cc-btn-primary-hover-bg: var(--button-primary-bg-hover)', $css);
    }

    #[Test]
    public function the_decline_button_uses_flarums_hover_variables(): void
    {
        $css = $this->compile();

        $this->assertStringContainsString('--cc-btn-secondary-hover-bg: var(--button-bg-hover)', $css);
    }

    #[Test]
    public function button_text_colour_is_inherited_rather_than_assumed(): void
    {
        $css = $this->compile();

        // Flarum computes readable button text via YIQ; assuming --body-bg
        // would be wrong for a light primary colour.
        $this->assertStringContainsString('--cc-btn-primary-color: var(--button-primary-color)', $css);
    }

    #[Test]
    public function an_admin_override_still_wins(): void
    {
        $css = $this->compile(['fof-cookie-consent-button-background-color' => '#178e99']);

        $this->assertStringContainsString('--cc-btn-primary-bg: #178e99', $css);
    }

    #[Test]
    public function a_custom_button_colour_hovers_to_a_shade_of_itself(): void
    {
        $css = $this->compile([
            'fof-cookie-consent-button-background-color' => '#178e99',
            'fof-cookie-consent-button-hover-color'      => \FoF\CookieConsent\Color::darken('#178e99', 0.05),
        ]);

        // Hovering must not jump to Flarum's primary colour; it should darken
        // the admin's own choice, matching how Flarum derives its own hovers.
        $this->assertStringNotContainsString('--cc-btn-primary-hover-bg: var(--button-primary-bg-hover)', $css);
        $this->assertMatchesRegularExpression('/--cc-btn-primary-hover-bg: #[0-9a-f]{6}/i', $css);
    }
}
