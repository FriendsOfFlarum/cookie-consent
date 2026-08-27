<?php

/*
 * This file is part of fof/cookie-consent.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\CookieConsent\Tests\unit;

use FoF\CookieConsent\ScriptGate;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Scripts contributed to the document head are held inert until the visitor
 * accepts the category they belong to. vanilla-cookieconsent activates a
 * `type="text/plain"` script tagged with an accepted `data-category`.
 */
class ScriptGateTest extends TestCase
{
    #[Test]
    public function it_marks_a_script_as_deferred_until_consent(): void
    {
        $gated = ScriptGate::gate('<script src="https://example.com/a.js"></script>', 'analytics');

        $this->assertStringContainsString('type="text/plain"', $gated);
        $this->assertStringContainsString('data-category="analytics"', $gated);
        $this->assertStringContainsString('src="https://example.com/a.js"', $gated);
    }

    #[Test]
    public function it_gates_inline_scripts_too(): void
    {
        $gated = ScriptGate::gate('<script>tracker();</script>', 'analytics');

        $this->assertStringContainsString('type="text/plain"', $gated);
        $this->assertStringContainsString('tracker();', $gated);
    }

    #[Test]
    public function it_gates_every_script_in_a_fragment(): void
    {
        $html = '<script async src="a.js"></script><script>b();</script>';

        $this->assertSame(2, substr_count(ScriptGate::gate($html, 'analytics'), 'data-category="analytics"'));
    }

    #[Test]
    public function it_replaces_an_existing_type_rather_than_duplicating_it(): void
    {
        $gated = ScriptGate::gate('<script type="text/javascript">a();</script>', 'analytics');

        $this->assertStringNotContainsString('text/javascript', $gated);
        $this->assertSame(1, substr_count($gated, 'type='));
    }

    #[Test]
    public function it_leaves_already_gated_scripts_untouched(): void
    {
        $html = '<script type="text/plain" data-category="marketing" src="a.js"></script>';

        $this->assertSame($html, ScriptGate::gate($html, 'analytics'));
    }

    #[Test]
    public function it_leaves_json_ld_and_other_data_blocks_alone(): void
    {
        $html = '<script type="application/ld+json">{"@type":"Thing"}</script>';

        $this->assertSame($html, ScriptGate::gate($html, 'analytics'));
    }

    #[Test]
    public function it_leaves_markup_without_scripts_untouched(): void
    {
        $html = '<style>.a{color:red}</style><link rel="stylesheet" href="a.css">';

        $this->assertSame($html, ScriptGate::gate($html, 'analytics'));
    }

    #[Test]
    public function it_rejects_a_category_name_that_could_break_out_of_the_attribute(): void
    {
        $gated = ScriptGate::gate('<script src="a.js"></script>', 'ana"lytics');

        $this->assertStringContainsString('data-category="ana&quot;lytics"', $gated);
    }
}
