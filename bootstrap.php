<?php

use ZapTech\CookieConsent\Listeners;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    //$events->subscribe(Listener\LoadSettingsFromDatabase::class);
};
