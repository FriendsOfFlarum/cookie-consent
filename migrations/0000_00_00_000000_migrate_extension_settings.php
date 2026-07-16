<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $keys = [
            'backgroundColor',
            'buttonBackgroundColor',
            'buttonText',
            'buttonTextColor',
            'ccTheme',
            'consentText',
            'learnMoreLinkText',
            'learnMoreLinkUrl',
            'textColor',
        ];

        // Default values are registered through the Settings extender, so this
        // migration only carries over settings from reflar/cookie-consent.
        foreach ($keys as $key) {
            $oldKey = "reflar-cookie-consent.$key";
            $newKey = "fof-cookie-consent.$key";

            if ($db->table('settings')->where('key', $newKey)->exists()) {
                $db->table('settings')->where('key', $oldKey)->delete();
            } else {
                $db->table('settings')->where('key', $oldKey)->update(['key' => $newKey]);
            }
        }
    },
    'down' => function (Builder $schema) {
        // Do nothing
    },
];
