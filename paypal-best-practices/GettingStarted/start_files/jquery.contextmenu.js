(function($) {

    $.contextMenu = function(selector, parameters) {
		return $.uic.ContextMenu.getInstanceOf(selector, parameters)
    };

    $.uic.ContextMenu = u.klass($.uic.BaseTip, {
		setPars: function(pars){
			var obj = this;
			$.uic.BaseTip.prototype.setPars.call(obj)

			u.extend(obj.pars, {
				eventType: 'click' //"click" | "right-click"
			}, pars || {});
		},

		registerEvents: function(){
			var obj = this;
			if(obj.pars.eventType == 'click'){
				$(document.body).delegate(obj.selector, 'click', $.proxy(obj, 'toggleHandler'));
				$(document.body).delegate(obj.selector, 'mouseover', $.proxy(obj, 'linkHandler'));
			} else if (obj.pars.eventType == 'right-click') {
				$(document.body).delegate(obj.selector, 'contextmenu', $.proxy(obj, 'toggleHandler'));
			}

			$(document.body).delegate(obj.selector, 'tooltip:show', $.proxy(obj, 'showAction'));
			$(document.body).delegate(obj.selector, 'tooltip:hide', $.proxy(obj, 'hideAction'));
			$('body').live('click', $.proxy(obj, 'closeAll'));
			$('.xclose,.pointerT').live('click', $.proxy(obj, 'hideAction'));

		},

		linkHandler: function(e) {
			var obj = this;
			var el = $(e.target);
			if(el.get(0).tagName.toLowerCase() == 'a' && el.attr('href') != 'javascript:void(false)') {
				el.attr('href', 'javascript:void(false)');
			}
		},

		toggleHandler: function(e){
			var obj = this;
			var node = $(e.currentTarget);
			if(!obj.tip.data('contextmenu')){
				obj.tip.data('contextmenu', {currentTrigger: node[0]});
			}
			if (obj.tip.data('contextmenu').currentTrigger == node[0]) {
				if (obj.tip.css('display') == 'none'){
					$('body').trigger('click')
					node.trigger('tooltip:show', obj);
				}else{
					node.trigger('tooltip:hide', obj);
				}
			}else {
				node.trigger('tooltip:show', obj);
				obj.tip.data('contextmenu', {currentTrigger: node[0]})
			}
			return false
		},

		closeAll: function(e) {
            var obj = this;
            var tree =
			$(e.target).add($(e.target).parents());
			var tip = u.detect(tree,
			
			function(v){
				return v == obj.tip[0]
			});
			
			if(tip != obj.tip[0]){
				obj.hideAction()
			}
			
		}

    });

})(jQuery);