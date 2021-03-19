<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) 2019 - 2021 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use Flarum\Frontend\Assets;
use Flarum\Frontend\Compiler\Source\SourceCollector;
use FoF\Components\Extend\AddFofComponents;
use Illuminate\Contracts\Container\Container;

return [
    (new AddFofComponents()),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    function (Container $container) {
        $container->resolving('flarum.assets.forum', function (Assets $assets) use ($container) {
            if ($container['flarum.settings']->get('reflar-cookie-consent.ccTheme') != 'no_css') {
                $assets->css(function (SourceCollector $sources) {
                    $sources->addFile(__DIR__.'/resources/less/forum.less');
                });
            }
        });
    },

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(Listeners\LoadSettingsFromDatabase::class),
];
