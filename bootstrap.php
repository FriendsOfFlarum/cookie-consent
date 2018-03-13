<?php
namespace ZapTech\CConsent;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
};