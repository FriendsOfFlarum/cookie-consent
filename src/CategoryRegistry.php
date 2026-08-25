<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent;

use Flarum\Http\CookieFactory;

/**
 * Holds the consent categories declared across the installation.
 *
 * Only `necessary` exists out of the box; everything else is contributed by
 * extensions through `Extend\CookieConsent`, so a forum running nothing that
 * sets optional cookies shows a plain accept/decline notice.
 */
class CategoryRegistry
{
    public const NECESSARY = 'necessary';

    /** The cookie vanilla-cookieconsent stores the visitor's choice in. */
    public const CONSENT_COOKIE = 'cc_cookie';

    /** @var array<string, Category> */
    private array $categories = [];

    /**
     * @param array<string, callable[]> $declarations Category key => configurators.
     */
    public function __construct(array $declarations = [], ?CookieFactory $cookies = null)
    {
        $necessary = (new Category(self::NECESSARY))->essential();

        // Flarum's own cookies, so the preferences modal can account for what
        // the forum stores rather than listing only third-party extensions.
        // `cookie.name` in config.php renames them, so ask core for the names.
        if ($cookies !== null) {
            $necessary
                ->cookie($cookies->getName('session'))
                ->cookie($cookies->getName('remember'));
        }

        // The consent record itself; without it the banner cannot remember
        // that the visitor answered.
        $necessary->cookie(self::CONSENT_COOKIE);

        $this->categories[self::NECESSARY] = $necessary;

        foreach ($declarations as $key => $configurators) {
            foreach ($configurators as $configure) {
                $configure($this->category($key));
            }
        }
    }

    /**
     * Fetch a category, creating it on first use so several extensions can
     * contribute cookies to the same one.
     */
    public function category(string $key): Category
    {
        return $this->categories[$key] ??= new Category($key);
    }

    /**
     * @return array<string, Category>
     */
    public function all(): array
    {
        return $this->categories;
    }

    /**
     * The keys a visitor is able to decline.
     *
     * @return string[]
     */
    public function optional(): array
    {
        return array_keys(array_filter($this->categories, fn (Category $c) => ! $c->essential));
    }

    /**
     * Compile every category into the shape vanilla-cookieconsent expects.
     */
    public function toArray(): array
    {
        return array_map(fn (Category $c) => $c->toArray(), $this->categories);
    }
}
