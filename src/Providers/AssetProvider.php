<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Frontend\Assets;
use Flarum\Frontend\Compiler\Source\SourceCollector;
use Flarum\Settings\SettingsRepositoryInterface;

class AssetProvider extends AbstractServiceProvider
{
    /**
     * Colour settings, mapped to the LESS variable each is exposed through.
     */
    private const COLORS = [
        'backgroundColor'       => 'fof-cookie-consent-background-color',
        'textColor'             => 'fof-cookie-consent-text-color',
        'buttonBackgroundColor' => 'fof-cookie-consent-button-background-color',
        'buttonTextColor'       => 'fof-cookie-consent-button-text-color',
    ];

    private const DEFAULTS = [
        'backgroundColor'       => '#2b2b2b',
        'textColor'             => '#ffffff',
        'buttonBackgroundColor' => '#178e99',
        'buttonTextColor'       => '#ffffff',
    ];

    public function boot(): void
    {
        $this->container->resolving('flarum.assets.forum', function (Assets $assets) {
            /** @var SettingsRepositoryInterface $settings */
            $settings = resolve(SettingsRepositoryInterface::class);

            if ($settings->get('fof-cookie-consent.disableCss')) {
                return;
            }

            $assets->css(function (SourceCollector $sources) use ($settings) {
                $sources->addString(fn () => $this->lessVariables($settings));
                $sources->addFile(__DIR__.'/../../resources/less/forum.less');
            });
        });
    }

    /**
     * Expose the colour settings to LESS, falling back to the shipped defaults
     * so the stylesheet always compiles even before anything has been saved.
     */
    private function lessVariables(SettingsRepositoryInterface $settings): string
    {
        $less = '';

        foreach (self::COLORS as $key => $variable) {
            $value = $settings->get("fof-cookie-consent.$key") ?: self::DEFAULTS[$key];

            $less .= "@$variable: ".$this->sanitizeColor($value).";\n";
        }

        return $less;
    }

    /**
     * Settings are admin-authored but land in a stylesheet, so only allow
     * values that are unambiguously colours.
     */
    private function sanitizeColor(string $value): string
    {
        $value = trim($value);

        if (preg_match('/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $value)) {
            return $value;
        }

        if (preg_match('/^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)$/', $value)) {
            return $value;
        }

        return 'transparent';
    }
}
