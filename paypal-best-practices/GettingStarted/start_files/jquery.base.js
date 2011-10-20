(function($) {

	u.Base = u.klass(u.eventMixin, {
		init: function(selector, pars) {
			var obj = this;
			obj.selector = selector;
			obj.uId = "".uId();
			obj.setPars(pars);
		},

		setPars: function(pars) {
			var obj = this;
			if (!obj.pars)
				obj.pars = {};
			if (pars)
				u.extend(obj.pars, pars);
		}
	});

	u.Base.getInstanceOf = function(selector, parameters) {
		if (!this['selector_' + selector]) {
			this['selector_' + selector] = new this(selector, parameters);
		}
		return this['selector_' + selector];
	};

	u.extend(u.Base, u.eventMixin);

	if (typeof $.uic == 'undefined') {
		$.uic = {};
	}

	$.uic.Base = u.klass(u.Base, {
		init: function(selector, pars) {
			var obj = this;
			u.Base.prototype.init.call(obj, selector, pars);
			obj.registerEvents();
		},

		setPars: function(pars) {
			var obj = this;
			u.Base.prototype.setPars.call(obj, pars);
		},

		registerEvents: function() {
		},

		getCurrentDom: function(node) {
			var obj=this;
			return $($(node).parents(obj.selector));
		}
	});

})(jQuery);
