<?php

use ZapTech\CookieConsent\Listener;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\LoadSettingsFromDatabase::class);
};
