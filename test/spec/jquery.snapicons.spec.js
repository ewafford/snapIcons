(function ($, QUnit) {
	"use strict";

	var $testCanvas = $("#testCanvas");
	var $fixture = null;

	QUnit.module("snapIcons", {
		beforeEach: function () {
			// fixture is the element where your jQuery plugin will act
			$fixture = $("<div/>");

			$testCanvas.append($fixture);
		},
		afterEach: function () {
			// we remove the element to reset our plugin job :)
			$fixture.remove();
		}
	});

	QUnit.test("is inside jQuery library", function ( assert ) {
		assert.equal(typeof $.fn.snapIcons, "function", "has function inside jquery.fn");
		assert.equal(typeof $fixture.snapIcons, "function", "another way to test it");
	});

	QUnit.test("returns jQuery functions after called (chaining)", function ( assert ) {
		assert.equal(typeof $fixture.snapIcons().on, "function", "'on' function must exist after plugin call");
	});

	QUnit.test("caches plugin instance", function ( assert ) {
		$fixture.snapIcons();
		assert.ok($fixture.data("plugin_snapIcons"), "has cached it into a jQuery data");
	});

	QUnit.test("enable custom config", function ( assert ) {
		$fixture.snapIcons({
			foo: "bar"
		});

		var pluginData = $fixture.data("plugin_snapIcons");

		assert.deepEqual(pluginData.settings, {
			url: "value",
			foo: "bar"
		}, "extend plugin settings");

	});

}(jQuery, QUnit));
