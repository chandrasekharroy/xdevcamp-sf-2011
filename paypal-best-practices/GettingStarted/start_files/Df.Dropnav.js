if(Df){
}else{
	var Df = {}
}
Df.Dropnav = function(el){
	//BEGIN constructor
	var ele = this.ele = $(el)
	
	var pars = this.pars = {
		animate: false,
		pause:200,
		iframe: true,
		activeClassName: 'active',
		eventType: 'hover'
	}
	
	var status = false;
	var displayStatus = false;
	var list, animation;
	
	this.version = function(){
		return 1.2;
	}
	
	this.requires = function(){
		return [
			'../js/Df.js',
			'../js/prototype1_5_1_1.js',
			'../js/prototype1_5_1_1_extend.js',
			'../js/Df.Animate.js'
			];
	}
	
	this.set = function(para){
		if(para){
			pars = Object.extend(pars,para)
		}
		
		list = ele.getElementsByTagName('UL')[0];
		if(list){
			
			if(pars.animate){
				animation = new Df.Animate(list);
				if(pars.animate){
					animation.pars = Object.extend(animation.pars,pars.animate);
				}
			}
			
			if(pars.eventType == "hover"){
				Event.observe(ele, 'mouseover', display ,false);
				Event.observe(ele, 'mouseout', hide ,false);
			}
			else if(pars.eventType == "click"){
				Event.observe(ele, 'click', waintToDisplay ,false);
			}
		}
	}
	
	this.getState = function(){
		return displayStatus;
	}
	
	var display = this.display = function(event){
		status = true;
		setTimeout(waintToDisplay,pars.pause);
	}
	
	var hide = this.hide = function(event){
		status = false;
		setTimeout(waintToHide,pars.pause);
	}
	
	var waintToDisplay = function(event){
		
		if(pars.eventType == 'click'){
			findOpen();
			status = true;
		}
		
		if(status && !displayStatus){
		
			displayStatus = true;
			
			if(pars.eventType == "click"){
				Event.stop(event)
				Event.stopObserving(ele,'click',waintToDisplay,false)
				Event.observe(ele,'click',waintToHide,false)
				Event.observe(document.body,'click',waintToHide,false)
			}
			
			if(pars.activeClassName){
				ele.addClassName(pars.activeClassName)
			}
			
			list.style.display = "block";
			
			if(animation){
				if(animation.getHistoryCount() == 0){
					animation.run();	
				}else{
					animation.last();
				}
			}
			
			if((Df.browser()).ie6 && pars.iframe){
				showIframe();
			}
		}
	}
	
	var waintToHide = this.waintToHide = function(event){
		
		if(pars.eventType == 'click'){
			status = false;
		}
		
		if(!status){
			
			displayStatus = false;
			
			if(animation){
				if(animation.getHistoryCount() > 0){
					animation.first({onComplete: function(){
							finishHide();
						}
					});
				}
				
			}else{
				finishHide()
			}
			
			if((Df.browser()).ie6 && pars.iframe){
				hideIframe();
			}
		}
	}
	
	var finishHide = function(){
		
		list.style.display = "none";
				
		if(pars.activeClassName){
			ele.removeClassName(pars.activeClassName)
		}
		
		if(pars.eventType == 'click'){
			Event.stopObserving(ele,'click',waintToHide,false)
			Event.stopObserving(document.body,'click',waintToHide,false)
			Event.observe(ele,'click',waintToDisplay,false)
		}
	}
	
	var showIframe = function(){
		var oDiv = ele.getElementsByClassName('oDiv')[0];
		if(oDiv){
			oDiv.style.display = "block";
		}else{
			var html = '<iframe class="oDiv" style="display:block; filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);" scrolling="no" src="javascript:false;" frameborder="0" height="'+ parseInt(list.offsetHeight) +'px" width="'+ parseInt(list.offsetWidth) +'px"></iframe>';
			new Insertion.Top(ele, html);
		}
	}

	var hideIframe = function(){
		var oDiv = ele.getElementsByClassName('oDiv')[0];
		if(oDiv){
			oDiv.style.display = "none";
		}
	}
	
	var findOpen = function(){
		var elem = ele.siblings();
		for(var i=0; i<elem.length; i++){
			if((elem[i].tagName == "LI" || elem[i].tagName == "li") && elem[i].df.dropnav.getState() == true){
				elem[i].df.dropnav.waintToHide();
			}
		}
	}
}
