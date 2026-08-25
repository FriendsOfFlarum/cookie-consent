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

/**
 * v2.0 replaced the bundled cookieconsent library with vanilla-cookieconsent,
 * which has no notion of the old `blocky`/`edgeless`/`classic`/`custom`/`no_css`
 * themes. Map each onto the closest new layout so upgraded forums keep a banner
 * that looks broadly the same, rather than silently reverting to defaults.
 */
return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $theme = $db->table('settings')
            ->where('key', 'fof-cookie-consent.ccTheme')
            ->value('value');

        if ($theme === null) {
            return;
        }

        $set = function (string $key, string $value) use ($db) {
            $fullKey = "fof-cookie-consent.$key";

            if ($db->table('settings')->where('key', $fullKey)->exists()) {
                $db->table('settings')->where('key', $fullKey)->update(['value' => $value]);
            } else {
                $db->table('settings')->insert(['key' => $fullKey, 'value' => $value]);
            }
        };

        $layouts = [
            'blocky'   => 'box',
            'edgeless' => 'box',
            'classic'  => 'cloud',
            'custom'   => 'box',
            'no_css'   => 'box',
        ];

        $set('layout', $layouts[$theme] ?? 'box');

        // `no_css` suppressed the bundled stylesheet entirely. Preserve that
        // choice through a dedicated flag, since it is no longer a theme.
        if ($theme === 'no_css') {
            $set('disableCss', '1');
        }

        $db->table('settings')->where('key', 'fof-cookie-consent.ccTheme')->delete();
    },
    'down' => function (Builder $schema) {
        // Irreversible: the old themes have no equivalent in the new library.
    },
];
