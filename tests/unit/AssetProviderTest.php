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

use FoF\CookieConsent\Providers\AssetProvider;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use ReflectionMethod;

/**
 * Colour settings are admin-authored and interpolated straight into a
 * stylesheet, so anything that is not clearly a colour must be rejected.
 */
class AssetProviderTest extends TestCase
{
    private function sanitize(string $value): string
    {
        $method = new ReflectionMethod(AssetProvider::class, 'sanitizeColor');
        $method->setAccessible(true);

        return $method->invoke(
            (new \ReflectionClass(AssetProvider::class))->newInstanceWithoutConstructor(),
            $value
        );
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
    #[DataProvider('invalidColors')]
    public function invalid_colors_are_rejected(string $value): void
    {
        $this->assertSame('transparent', $this->sanitize($value));
    }
}
