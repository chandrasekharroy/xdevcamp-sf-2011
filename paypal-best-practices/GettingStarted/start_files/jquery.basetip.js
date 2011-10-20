(function($) {

	$.uic.BaseTip = u.klass($.uic.Base, {
		init: function(selector, pars) {
			var obj = this;
			$.uic.Base.prototype.init.call(obj, selector, pars);
			obj.tip = obj.getTip();
		},

		setPars: function(pars) {
			var obj = this;
			$.uic.Base.prototype.setPars.call(obj);
			//alert(parseInt($(obj.selector).offset().left));
			var tipOffset = parseInt($(obj.selector).offset().left) + " " + parseInt($(obj.selector).offset().top);
			u.extend(obj.pars, {
				tipPosition: 'bottom', // ["top", "center", "bottom", "left", "right"] or combos like "left center"
				anchorPosition: 'top', // ["top", "center", "bottom", "left", "right"] or combos like "left center"
				windowPosition: 'fit', // [flip, fit, none]
				tipOffset: "0",
				content: function(target) {
					if (target.attr('data-tooltip')) {
						return unescape(target.attr('data-tooltip'));
					} else {
						return 'Send a content parameter into the constructor or use a data-tooltip attribute of the element trigger';
					}
				},
				tip: undefined,
				singletonTip: true,
				show: function(e) {
					this.fadeIn(300);
				},
				hide: function(e) {
					this.fadeOut(300);
				}
			}, pars || {});
		},

		showAction: function(e, data) {
			var obj = this;
			obj.populate.call(obj, e);
			obj.position.call(obj, e);
			obj.pars.show.call(obj.tip, e);
		},

		hideAction: function(e, data) {
			var obj = this;
			obj.pars.hide.call(obj.tip, e);
		},

		getTip: function() {
			var obj = this;
			//alert($(obj.selector).offset().left);
			if (obj.pars.singletonTip) {
				if (!obj.constructor.tip) {
					if (!obj.pars.tip) {
						var tip = $('<div class="tooltip"></div>');
						var left = 
						tip.css( {
							position: 'absolute',
							display: 'none',
							left: $(obj.selector).offset().left
						});
						$(document.body).prepend(tip);
						obj.constructor.tip = tip;
						return obj.constructor.tip;
					}
					obj.constructor.tip = $(obj.pars.tip);
					if (obj.pars.tip.match(/^<.+?>$/)) {
						$(document.body).prepend(Tooltip.tip);
					}
				}
				return obj.constructor.tip;
			}
			var tip = $(obj.pars.tip);
			if (obj.pars.tip.match(/^<.+?>$/)) {
				$(document.body).prepend(tip);
			}
			return tip;
		},

		populate: function(e) {
			var obj = this;
			var html;
			if (typeof obj.pars.content == 'function') {
				html = obj.pars.content.call(obj, $(e.target));
			} else {
				html = obj.pars.content;
			}
			obj.tip.html(html);
		},

		position: function(e) {
			var obj = this;
			if (obj.tip.css('display') == 'none') {
				var f = true;
				obj.tip.css( {
					display: 'block',
					visibility: 'hidden'
				});
			}
			obj.tip.position( {
				my: obj.pars.tipPosition,
				at: obj.pars.anchorPosition,
				offset: obj.pars.tipOffset,
				collision: obj.pars.windowPosition,
				of: $(e.target)
			});
			if (f) {
				obj.tip.css( {
					display: 'none',
					visibility: 'visible'
				});
			}
		}
	});

})(jQuery);
