/*
 *  snapicons - v0.1.1
 *  Jquery Plugin for Snapsvg Icons.
 *  http://bigstud.io
 *
 *  Made by Eric Wafford
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "snapIcons",
				defaults 	 = {
					url			  : "",
					animation : [],
					speed 	  : 200,
					easing 	  : mina.linear,
					toggle 	  : "click", // click || mouseover
					size 		  : { w : 60, h : 60 },
					onLoad 	  : function() { return false; },
					onToggle  : function() { return false; }
				};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.el = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						this.svg = new Snap( this.settings.size.w, this.settings.size.h );
						this.svg.attr( "viewBox", "0 0 60 60" );
						this.svg.appendTo( this.el );

						// Set Toggle State
						this.toggled = false;

						// click event (if mobile use touchstart)
						this.clickEvent = this.isTouch() ? "touchstart" : "click";

						if( $(this.el).hasClass("si-icon-reverse") ) {
							this.reverse = true;
						}

						if( this.settings.url.length > 0 ) {
							var self = this;
							Snap.load( this.settings.url, function (f) {
								var g = f.select( "g" );
								self.svg.append( g );
								self.settings.onLoad();
								self.initEvents();
								if( self.reverse ) {
									self.toggleIcon();
								}
							});
						}

				},
				initEvents: function() {
					var self = this;
					if( this.settings.toggle === "mouseover" ) {
						$(this.el).on({
						   "mouseenter": function() {
								 self.svg.stop();
								 self.toggleIcon(true);
	 							 self.settings.onToggle();
							 },
						   "mouseleave": function() {
								 self.svg.stop();
								 self.toggleIcon(true);
	 							 self.settings.onToggle();
							 }
						});
					}
					else {
						$(this.el).on(this.clickEvent, function() {
								 self.svg.stop();
								 self.toggleIcon(true);
	 							 self.settings.onToggle();
						});
					}
				},
				animateIcon: function(el, val, animProp, timeout, motion){
					if( motion ) {
						var self = this;
						setTimeout((function( el, val, animProp ) {
							return function() { el.animate( JSON.parse( val ), self.settings.speed, self.settings.easing, function() {
								if( animProp.after ) {
									this.attr( JSON.parse( animProp.after ) );
								}
								if( animProp.animAfter ) {
									this.animate( JSON.parse( animProp.animAfter ), self.settings.speed, self.settings.easing );
								}
							} ); };
						}( el, val, animProp, self )), timeout * this.settings.speed );
					}
					else {
						el.attr( JSON.parse( val ) );
					}
				},
				isTouch: function() {
					return (("ontouchstart" in window) ||
						(navigator.MaxTouchPoints > 0) ||
						(navigator.msMaxTouchPoints > 0));
				},
				toggleIcon: function(motion) {
					if( !this.settings.animation ) { return; }
					for( var i = 0, len = this.settings.animation.length; i < len; ++i ) {
						var a = this.settings.animation[ i ],
							el = this.svg.select( a.el ),
							animProp = this.toggled ? a.animProperties.from : a.animProperties.to,
							val = animProp.val,
							timeout = motion && animProp.delayFactor ? animProp.delayFactor : 0;

						if( animProp.before ) {
							el.attr( JSON.parse( animProp.before ) );
						}
						this.animateIcon(el, val, animProp, timeout, motion);
					}
					this.toggled = !this.toggled;
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
