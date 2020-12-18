<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        /**
         * @var \Flarum\Settings\SettingsRepositoryInterface
         */
        $settings = app('flarum.settings');

        $keys = [
            'backgroundColor',
            'buttonBackgroundColor',
            'buttonText',
            'buttonTextColor',
            'ccTheme',
            'consentText',
            'learnMoreLinkText',
            'learnMoreLinkUrl',
            'textColor'];

        foreach ($keys as $key) {
            if ($value = $settings->get($full = "reflar-cookie-consent.$key")) {
                $settings->set("fof-cookie-consent.$key", $value);
                $settings->delete($full);
            }
        }
    },
    'down' => function (Builder $schema) {
        // Do nothing
    }
];
