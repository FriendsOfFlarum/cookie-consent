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

use FoF\CookieConsent\Color;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Colour settings are admin-authored and interpolated straight into a
 * stylesheet, so anything that is not clearly a colour must be rejected.
 */
class ColorTest extends TestCase
{
    private function sanitize(string $value): string
    {
        return Color::sanitize($value, 'transparent');
    }

    public static function validColors(): array
    {
        return [
            'six digit hex'   => ['#2b2b2b'],
            'three digit hex' => ['#fff'],
            'hex with alpha'  => ['#2b2b2bcc'],
            'rgb'             => ['rgb(43, 43, 43)'],
            'rgba'            => ['rgba(43, 43, 43, 0.5)'],
            'surrounding ws'  => ['  #ffffff  '],
        ];
    }

    #[Test]
    #[DataProvider('validColors')]
    public function valid_colors_are_passed_through(string $value): void
    {
        $this->assertSame(trim($value), $this->sanitize($value));
    }

    public static function invalidColors(): array
    {
        return [
            'css injection'    => ['#fff; } body { display: none'],
            'url call'         => ['url(https://evil.example/x.png)'],
            'expression'       => ['expression(alert(1))'],
            'named colour'     => ['red'],
            'empty'            => [''],
            'semicolon'        => ['#fff;'],
            'brace'            => ['}'],
        ];
    }

    #[Test]
    public function darken_shades_a_colour_towards_black(): void
    {
        $this->assertSame('#168791', Color::darken('#178e99', 0.05));
        $this->assertSame('#f2f2f2', Color::darken('#ffffff', 0.05));
        $this->assertSame('#000000', Color::darken('#000000', 0.05));
    }

    #[Test]
    public function darken_expands_shorthand_hex(): void
    {
        $this->assertSame('#f2f2f2', Color::darken('#fff', 0.05));
    }

    #[Test]
    public function darken_leaves_a_non_hex_value_alone(): void
    {
        // rgb() and CSS variables cannot be darkened arithmetically here; they
        // are passed through rather than mangled.
        $this->assertSame('var(--button-primary-bg)', Color::darken('var(--button-primary-bg)', 0.05));
        $this->assertSame('rgb(1, 2, 3)', Color::darken('rgb(1, 2, 3)', 0.05));
    }

    #[Test]
    #[DataProvider('invalidColors')]
    public function invalid_colors_are_rejected(string $value): void
    {
        $this->assertSame('transparent', $this->sanitize($value));
    }
}
