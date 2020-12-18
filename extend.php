<?php

/**
 *  This file is part of fof/cookie-consent.
 *
 *  Copyright (c) FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace FoF\CookieConsent;

use Flarum\Api\Event\Serializing;
use Flarum\Extend;
use Flarum\Foundation\Application;
use Flarum\Frontend\Assets;
use Flarum\Frontend\Compiler\Source\SourceCollector;
use FoF\Components\Extend\AddFofComponents;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new AddFofComponents()),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Event())
        ->listen(Serializing::class, Listeners\LoadSettingsFromDatabase::class),

    function (Container $app) {
        $app->resolving('flarum.assets.forum', function (Assets $assets) use ($app) {
            if ($app['flarum.settings']->get('reflar-cookie-consent.ccTheme') != 'no_css') {
                $assets->css(function (SourceCollector $sources) {
                    $sources->addFile(__DIR__.'/resources/less/forum.less');
                });
            }
        });

    },
];
