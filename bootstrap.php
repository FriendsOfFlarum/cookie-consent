<?php
namespace ZapTech\CConsent;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * @param Dispatcher $events
 */
return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\LoadSettingsFromDatabase::class);
};