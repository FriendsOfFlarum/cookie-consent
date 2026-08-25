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
    /** Container key holding the category declarations extensions contribute. */
    public const DECLARATIONS = 'fof-cookie-consent.categories';

    public const NECESSARY = 'necessary';
    public const ANALYTICS = 'analytics';
    public const MARKETING = 'marketing';

    /**
     * Categories this extension defines and translates itself.
     *
     * Several extensions may contribute cookies to the same one — three
     * analytics providers should share a single section rather than each
     * shipping competing wording for it. Anything else is a third-party
     * category, which keeps whatever translations its author supplied.
     */
    public const KNOWN = [self::NECESSARY, self::ANALYTICS, self::MARKETING];

    /** The cookie vanilla-cookieconsent stores the visitor's choice in. */
    public const CONSENT_COOKIE = 'cc_cookie';

    /** Core's display-language cookie, which is not prefixed. */
    public const LOCALE_COOKIE = 'locale';

    /** @var array<string, Category> */
    protected array $categories = [];

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

        // Core reads an unprefixed `locale` cookie to choose the display
        // language, so it is necessary — losing it resets the visitor's
        // language on every visit.
        $necessary->cookie(self::LOCALE_COOKIE);

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

    /** Whether this extension owns the wording for a category. */
    public static function isKnown(string $key): bool
    {
        return in_array($key, self::KNOWN, true);
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
        return array_keys(array_filter($this->categories, fn (Category $c) => !$c->essential));
    }

    /**
     * Compile every category into the shape vanilla-cookieconsent expects.
     */
    public function toArray(): array
    {
        return array_map(fn (Category $c) => $c->toArray(), $this->categories);
    }
}
