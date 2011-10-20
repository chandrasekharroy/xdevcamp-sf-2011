//add element methods
Element.addMethods({
	
	getContentDims: function(element){
		element = $(element);
		var internalHeights = [];
		var internalWidths = [];
		var children = element.immediateDescendants();
		
		var val;
		
		val = parseInt(element.getStyle('paddingTop'));
		if(val){
			internalHeights.push(val);
		}
		val = parseInt(element.getStyle('paddingBottom'))
		if(val){
			internalHeights.push(val);
		}
		
		val = parseInt(element.getStyle('paddingLeft'));
		if(val){
			internalWidths.push(val);
		}
		val = parseInt(element.getStyle('paddingRight'))
		if(val){
			internalWidths.push(val);
		}	
			
		if(children){
			var none = false;
		
			if(element.getStyle('display') == "none"){
				none = true;
				element.style.display = "block";
			}
		
			for(var i=0; i<children.length; i++){
				
				val = parseInt(children[i].getHeight());
				if(val){
					internalHeights.push(val);
				}
				val = parseInt(children[i].getStyle('marginTop'));
				if(val){
					internalHeights.push(val);
				}
				val = parseInt(children[i].getStyle('marginBottom'));
				if(val){
					internalHeights.push(val);
				}
				
				val = parseInt(children[i].getWidth());
				if(val){
					internalWidths.push(val);
				}
				val = parseInt(children[i].getStyle('marginLeft'));
				if(val){
					internalWidths.push(val);
				}
				val = parseInt(children[i].getStyle('marginRight'));
				if(val){
					internalWidths.push(val);
				}
			}
		
			if(none){
				element.style.display = "none";
			}
			
		}
		return {height:internalHeights.sum() ,width:internalWidths.max()};
	},
	
	animator: function(element,para){
		element = $(element);
		
		Df.createNS('df.animate',element);
		
		element.df.animate = new Df.Animate(element);	
		
		if(para){
			element.df.animate.run(para);
		}
		
		return element;
	},
	  
	tooltip: function(element,para){
		element = $(element);
		
		Df.createNS('df.tip',element);
		
		element.df.tip = new Df.Tip(element);	
		
		if(para){
			element.df.tip.set(para);
		}
		
	return element;
	},
	  
	dropnav: function(element,para){
		element = $(element);
		
		var elem = element.immediateDescendants();
		for(var i=0; i<elem.length; i++){
			
			var elemen = $(elem[i]);
			
			Df.createNS('df.dropnav',elemen);
				
			elemen.df.dropnav = new Df.Dropnav(elemen);	
			
			elemen.df.dropnav.set(para);
		}
				      
		return element;
	},
	
	tabset: function(element,para){
		element = $(element);
		
		var elem = element.immediateDescendants();
		for(var i=0; i<elem.length; i++){
			if(elem[i].tagName == "DT" || elem[i].tagName == "dt"){
				
				var elemen = $(elem[i]);
				
				Df.createNS('df.tabset',elemen);
				
				elemen.df.tabset = new Df.Tabset(elemen);	
				
				elemen.df.tabset.set(para);
			}
		}
				      
		return element;
	},
	
	cardset: function(element,para){
		element = $(element);
		
		var elem = element.immediateDescendants();
		for(var i=0; i<elem.length; i++){
			if(elem[i].tagName == "LI" || elem[i].tagName == "li"){
				
				var elemen = $(elem[i]);
				
				Df.createNS('df.cardset',elemen);
				
				elemen.df.cardset = new Df.Cardset(elemen);	
				
				elemen.df.cardset.set(para);
			}
		}
				      
		return element;
	},
	
	scrollbar: function(element,para){
		element = $(element);
		
		Df.createNS('df.scrollbar',element);
		
		element.df.scrollbar = new Df.Scrollbar(element);	
		
		element.df.scrollbar.set(para);
		
		return element;
	}
	   
});

//more for the Event Object
Object.extend(Event,{
	keyCode: function(event){
		return event.keyCode || event.which ;
	}		  
});

//override prototype
Event._observeAndCache = function(element, name, observer, useCapture) {
   if (!this.observers) this.observers = [];
   if (element.addEventListener) {
		if(name == 'mousewheel'){
			name = 'DOMMouseScroll';
		}
		this.observers.push([element, name, observer, useCapture]);
      element.addEventListener(name, observer, useCapture);
   } else if (element.attachEvent) {
      this.observers.push([element, name, observer, useCapture]);
      element.attachEvent('on' + name, observer);
   }
}

//override prototype
Event.stopObserving = function(element, name, observer, useCapture) {
   element = $(element);
   useCapture = useCapture || false;

   if (name == 'keypress' && (Prototype.Browser.WebKit || element.attachEvent)){
		name = 'keydown';
	}
      
	if (element.removeEventListener) {
      if(name == 'mousewheel'){
			name = 'DOMMouseScroll';
		}
		element.removeEventListener(name, observer, useCapture);
   }
	else if (element.detachEvent) {
      try {
			element.detachEvent('on' + name, observer);
      } catch (e) {}
   }
}
			  
//more for strings
Object.extend(String.prototype,{
	
	//create a unique String
	uId: function(){
		return this + "u" + new Date().getTime() + parseInt(10000*Math.random());
	},
	
	//evaluate string
	exe: function(){
		return(eval('[' + this + ']')[0]);
	},
	
	trim: function(){
		return this.replace(/^[\s]+ |[\s]+$/g,'');	
	}
	
});

//more for arrays
Object.extend(Array.prototype,{
	sum:function(){
		var s = 0;
		for(var i=0; i<this.length; i++){
			s += this[i];
		}
		return s;
	}
});

//additional shortcuts

//create element
var $E = function(tag,elm,para){
	var obj = document.createElement(tag);
	if(para){
		Object.extend(obj,para);
	}
	elm.appendChild($(obj));
	return $(obj);
};