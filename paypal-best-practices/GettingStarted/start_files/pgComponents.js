if(nau) {
} else {
	var nau = {}
}
nau.pgComponents = {}

nau.pgComponents.toggleVisibility = function(id, NNtype, IEtype, WC3type)
{
	if (document.getElementById) {
		eval("document.getElementById(id).style.visibility = \"" + WC3type + "\"");
	} else {
		if (document.layers) {
			document.layers[id].visibility = NNtype;
		} else {
			if (document.all) {
				eval("document.all." + id + ".style.visibility = \"" + IEtype + "\"");
			}
		}
	}
}

nau.pgComponents.toggleiFrame = function (id, NNtype, IEtype, WC3type)
{
	if (document.getElementById) {
		eval("document.getElementById(id).style.zIndex = \"" + WC3type + "\"");
	} else {
		if (document.layers) {
			document.layers[id].visibility = NNtype;
		} else {
			if (document.all) {
				eval("document.all." + id + ".style.zIndex = \"" + IEtype + "\"");
			}
		}
	}
}

nau.pgComponents.checklength = function (val)
{
	if(val.length == 0) return false;
	for(var j=val.length;j > 0;j-- )
	{
		if(val.charAt(j-1) != ' ')
		{
			return true;
		}
	}
	return false;
}
	
nau.pgComponents.emailCheck = function (val)
{
	var EmailOk  = true
	var Temp     = val;
	var AtSym    = Temp.indexOf('@')
	var Period   = Temp.lastIndexOf('.')
	var Space    = Temp.indexOf(' ')
	var Length   = Temp.length - 1   // Array is from 0 to length-1

		if ((AtSym < 1) ||                     // '@' cannot be in first position
		(Period <= AtSym+1) ||             // Must be atleast one valid char btwn '@' and '.'
		(Period == Length ) ||             // Must be atleast one valid char after '.'
		(Space  != -1))                    // No empty spaces permitted
		{
			  return false;
		}
		return true;
}
	
nau.pgComponents.valForm = function (frm)
{
	if(!nau.pgComponents.emailCheck(frm.emailAddress.value))
	{
		alert("Please enter a valid email address.");
		if(!document.layers) frm.emailAddress.style.backgroundColor='#F9FD8B';
		frm.emailAddress.focus();
		return false;
	}
	return true;
}

/*** Sitemap ***/

/**
 * Paginate the sitemap by activating one category and hiding the rest.
 */
function paginate_sitemap()
{
	"use strict";
	var sitemap_elements = $("sitemap-column").getElementsBySelector("h2[id*='categoryId']"),
		i=0,
		target = this.href.split("#")[1],
		cur_node = {},
		display = "none";
	for(i=0;i<sitemap_elements.length;i++)
	{
		cur_node = sitemap_elements[i];
		display = "none";

		if(cur_node.id===target) display = "block";

		cur_node.style.display = display;
		// intentional single '='
		while(cur_node=cur_node.nextSibling)
		{
			if(cur_node.nodeType!=3) // ignore text nodes
			{
				cur_node.style.display = display;
				break;
			}
		}
	}
}
/**
 * Set up pagination and make sure one valid paginator is selected.
 */
function set_up_pagination()
{
	"use strict";
	// NOTE: It'd be better to use 'a[href|="categoryId"]', but this
	//       version of prototype.js doesn't seem to support it.
	var sitemap_column = $("sitemap-column"),
		paginators = sitemap_column.getElementsByClassName("pagination")[0].getElementsBySelector('a[href*="categoryId"]'),
		i = paginators.length,
		target,
		valid = false;
	while(i-->0)
	{
		Event.observe(
			paginators[i],
			"click",
			paginate_sitemap.bindAsEventListener(paginators[i])
		);
		// http://particletree.com/notebook/eventstop/
		paginators[i].onclick = function(){return false;};
		target = "#"+paginators[i].href.split("#")[1];
		if(window.location.hash===target)
		{
			valid = true;
			paginate_sitemap.call(paginators[i]);
		}
	}
	// Finally, if there was no valid paginator selected,
	// choose the first one.
	if(!valid)
	{
		window.location.hash = target;
		paginate_sitemap.call(paginators[0]);
	}
}

Event.observe(window, "load", set_up_pagination);