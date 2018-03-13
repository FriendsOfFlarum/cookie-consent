<?php

namespace ZapTech\CConsent\Listeners;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
};