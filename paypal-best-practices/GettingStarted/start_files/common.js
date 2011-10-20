function popupPromoDetails() {
	window.open("temp.popup.html", 'temp_popup', 'width=500,height=400,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=no');
}
function popupBMLDetails() {
	window.open("https://www.securecheckout.billmelater.com/paycapture-content/fetch?hash=4B6315UN&content=/bmlweb/np90drollingiw.html", 'temp_popup', 'width=500,height=400,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=no');
}
function popupPrivacySecurityDetails() {
	window.open("http://www.speedousa.com/helpdesk/popup.jsp?display=safety&subdisplay=privacy", 'temp_popup', 'width=500,height=400,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=no');
}
//--------------------------------------

/* Parse out the query strings on a given URL*

Ex of use:
Getting the value for the "q" key in the piggy.com URL now is as simple as:

	// If "q" isn't there, val is undefined
	var val = location.querystring["q"];

And the collection can easily be enumerated too:

	for (var key in location.querystring) {
		alert(key + "=" + location.querystring[key]);
	}

*/
location.querystring = (function() {

    // The return is a collection of key/value pairs
    var queryStringDictionary = {};

    // Gets the query string, starts with '?'
    var querystring = decodeURI(location.search);

    // document.location.search is empty if no query string
    if (!querystring) {
        return {};
    }

    // Remove the '?' via substring(1)
    querystring = querystring.substring(1);

    // '&' seperates key/value pairs
    var pairs = querystring.split("&");

    // Load the key/values of the return collection
    for (var i = 0; i < pairs.length; i++) {
        var keyValuePair = pairs[i].split("=");
        queryStringDictionary[keyValuePair[0]]
                = keyValuePair[1];
    }

    // toString() returns the key/value pairs concatenated
    queryStringDictionary.toString = function() {
        if (queryStringDictionary.length == 0) {
            return "";
        }
        var toString = "?";
        for (var key in queryStringDictionary) {
            toString += key + "=" +
                queryStringDictionary[key];
        }
        return toString;
    };
    // Return the key/value dictionary
    return queryStringDictionary;
})();

//--------------------------------------

String.prototype.trim = function() { 
	return this.replace(/^\s+|\s+$/, ''); 
};

//---------------------------------------

/**
*
*  URL encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var url = {
 
	// public method for url encoding
	encode : function (string) {
		return escape(this._utf8_encode(string));
	},
 
	// public method for url decoding
	decode : function (string) {
		return this._utf8_decode(unescape(string));
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

function getLabel(elem_id) {
	var lblElm = $jQ('label[for=' + elem_id + ']');
	var lbl = null;
	if (lblElm && lblElm.length > 0) {
		lbl = lblElm.text().trim();
		
		// trim trailing colons
		while (lbl.length > 0 && /^.+:$/.test(lbl))
			lbl = lbl.substring(0, lbl.length-1);
		
		// make sure it starts with a letter or number
		while (lbl.length > 0 && !/^[a-zA-Z0-9].+$/.test(lbl))
			lbl = lbl.substring(1)
			
	}
	return lbl;
}

//---------------------------------------

function inspect(obj, maxLevels, level)
{
  var str = '', type, msg;

    // Start Input Validations
    // Don't touch, we start iterating at level zero
    if(level == null)  level = 0;

    // At least you want to show the first level
    if(maxLevels == null) maxLevels = 1;
    if(maxLevels < 1)     
        return '<font color="red">Error: Levels number must be > 0</font>';

    // We start with a non null object
    if(obj == null)
    return '<font color="red">Error: Object <b>NULL</b></font>';
    // End Input Validations

    // Each Iteration must be indented
    str += '<ul>';

    // Start iterations for all objects in obj
    for(property in obj)
    {
      try
      {
          // Show "property" and "type property"
          type =  typeof(obj[property]);
          str += '<li>(' + type + ') ' + property + 
                 ( (obj[property]==null)?(': <b>null</b>'):('')) + '</li>';

          // We keep iterating if this property is an Object, non null
          // and we are inside the required number of levels
          if((type == 'object') && (obj[property] != null) && (level+1 < maxLevels))
          str += inspect(obj[property], maxLevels, level+1);
      }
      catch(err)
      {
        // Is there some properties in obj we can't access? Print it red.
        if(typeof(err) == 'string') msg = err;
        else if(err.message)        msg = err.message;
        else if(err.description)    msg = err.description;
        else                        msg = 'Unknown';

        str += '<li><font color="red">(Error) ' + property + ': ' + msg +'</font></li>';
      }
    }

      // Close indent
      str += '</ul>';

    return str;
}

//----------------------------

function validateRequired(validationObj) {
	// validationObj is expected to come  in with properties as follows:
	//    elem_id - the ID of the element { required }
	//    message - the error message to be shown if validation fails { required }
	//    type - the type of validation { optional; defaults to "required" check }
	//    width - the width of the error div to be appended if validation vales { optional }

	
	// snippet for backwards compatibility
	if (typeof(validationObj) == 'string') {
		var elem_id = validationObj;
		//var relative_to_id = arguments.length > 1 ? arguments[1] : undefined;
		var width = arguments.length > 2 ? arguments[2] : undefined;
		
		validateRequired({ elem_id: elem_id, message: required_error_strings[elem_id], width: width });
		return;
	}
	
	var elem;
	if (validationObj.elem) {
		elem = validationObj.elem;
	}
	else {
		var sel = (validationObj.container ? validationObj.container + ' ' : '') + "#" + validationObj.elem_id;
		elem = $jQ(sel);
	}
	
	// we always check for required
	var valid = checkRequired(validationObj, elem);
	if (valid === true) 
	{
		elem.removeClass("field_error");
		$jQ("#" + validationObj.elem_id + "Alert").hide();
	}
}


/* appends an element */
function appendValidationError(validationObj, elem) {
	elem.addClass("field_error");
	var append_to_elem;
	var position_relative_to = (validationObj.container ? validationObj.container + ' ' : '') + "#" + validationObj.elem_id;
	
	if (validationObj.append_to_id) {
		append_to_elem = $jQ('#' + validationObj.append_to_id);
	}
	else {
		append_to_elem = elem.parent();
	}
	
	if (validationObj.position_relative_to) {
		position_relative_to = '#' + validationObj.position_relative_to;
	}
	else if (elem.is(":checkbox")) {
		// see if there's a label[for]
		var cbLbl = $jQ('label[for=' + validationObj.elem_id + ']');
		if (cbLbl && cbLbl.length > 0) {
			position_relative_to = 'label[for=' + validationObj.elem_id + ']';
		}
	}

	// if element doesn't exist, create it
	if (!$jQ("#" + validationObj.elem_id + "Alert").length) {
		append_to_elem.append('<div id="' + validationObj.elem_id + 'Alert" class="field_err_msg">' + validationObj.message + '</div>');
	}
	else {
		$jQ("#" + validationObj.elem_id + "Alert").html(validationObj.message);
	}
	
	// position error div to the right of corresponding field
	var err_div = $jQ("#" + validationObj.elem_id + "Alert");
	if (validationObj.cssClass) {
		err_div.addClass(validationObj.cssClass);
	}
	// yes, this looks dumb.  but it's required for IE, because IE is dumb.
	for (var i = 0; i < 2; i++) {
		err_div.show().position({
			my: "left",
			at: "right",
			of: position_relative_to,
			offset: "1px 0"
		});
	}
	/* if the field with an error gets focus, slowly fade off the error message after 5 seconds as per latest IAD MIB checkout phase-2 */
	var errFadeOutTimer = null;
		 $jQ("#" + validationObj.elem_id).focus(function(){
		  if($jQ("#" + validationObj.elem_id + "Alert").is(":visible")){
				if (typeof(errFadeOutTimer) == "number"){
                clearTimeout(errFadeOutTimer);
            }
            errFadeOutTimer = setTimeout(function(){
                $jQ("#" + validationObj.elem_id + "Alert").fadeOut("slow");
            }, 5000);
		 }
 });
		 $jQ("#" + validationObj.elem_id).blur(function(){
			if (typeof(errFadeOutTimer) == "number"){
            clearTimeout(errFadeOutTimer);
        }
 });

	return err_div;
}

function clearFormErrors(container) {
	var prefix = typeof(container) === 'string' ? container + " " : "";
	$jQ(prefix + ".field_error").each(function() {
		$jQ(this).removeClass("field_error");
	});

	$jQ(prefix + ".field_err_msg").each(function() {
		$jQ(this).hide();
	});

	
	
}


/* takes two params - the validation object and an elem variable returned from jQuery
 * returns true if there was no error found, false if there was an error */
function checkRequired(validationObj, elem) {
	if (elem.is(':checkbox')) {
		if (!elem.is(':checked')) {
			appendValidationError(validationObj, elem);
			return false;
		}
		return true;
	}
	if (elem.val().trim() === "") {
		// position error div to the right of corresponding field
		var err_div = appendValidationError(validationObj, elem);
		
		if (validationObj.width) {
			err_div.width(validationObj.width);	
		}
		
		// handle some special cases
		if (validationObj.elem_id == "ccEntry") {
			err_div.css({'width':'150px'});
		} else if (validationObj.elem_id == "ccPin") {
			err_div.css({'width':'200px'});
		} else if (validationObj.elem_id == "cardExpDateYrTxt") {
			$jQ("#cardExpDateMoTxt").addClass("field_error");
			$jQ("#cardExpDateYrTxt").addClass("field_error");
		}
		return false;
	}
	else {
		// clear the field error
		return true;
	}
}


/* takes two params - the validation object and an elem variable returned from jQuery
 * returns true if there was no error found, false if there was an error */
function validateRegex(validationObj) {
	var elem = $jQ("#" + validationObj.elem_id);
	if (!elem || elem.length === 0)
		return;
	
	var val = elem.val().trim();
	
	// ignore if it's blank
	if (!validationObj.testEmpty && val === "") {
		// if it doesn't have a class of "dataRequired", remove any errors
		if (!elem.hasClass("dataRequired")) {
			elem.removeClass("field_error");
			$jQ("#" + validationObj.elem_id + "Alert").hide();
		}
		return;
	}
	
	// if value is set, validate.
	// could include optional support for 9 digit zip: /^\d{5}([\-]\d{4})?$/
	if (validationObj.regex.test(val)) {
		elem.removeClass("field_error");
		$jQ("#" + validationObj.elem_id + "Alert").hide();
		return;
	}

	// clear the field error
	// position error div to the right of corresponding field
	var err_div = appendValidationError(validationObj, elem);
	
	if (validationObj.width) {
		err_div.width(validationObj.width);	
	}
}


/* takes two params - the validation object and an elem variable returned from jQuery
 * returns true if there was no error found, false if there was an error */
function validateUSZip(validationObj) {
	var elem = $jQ("#" + validationObj.elem_id);
	if (!elem || elem.length === 0)
		return;
	
	var val = elem.val().trim();
	
	// ignore if it's blank
	if (val === "") {
		return;
	}
	
	// if value is set, validate.
	// could include optional support for 9 digit zip: /^\d{5}([\-]\d{4})?$/
	if (/^\d{5}$/.test(val)) {
		elem.removeClass("field_error");
		$jQ("#" + validationObj.elem_id + "Alert").hide();
		return;
	}

	// clear the field error
	// position error div to the right of corresponding field
	var err_div = appendValidationError(validationObj, elem);
	
	if (validationObj.width) {
		err_div.width(validationObj.width);	
	}
}



/* takes two params - the validation object and an elem variable returned from jQuery
 * returns true if there was no error found, false if there was an error */
function validateIntlZip(validationObj) {
	var elemZip = $jQ("#" + validationObj.zip_id);
	var elemCountry = $jQ('#' + validationObj.country_id);
	var elemState = $jQ('#' + validationObj.state_or_province_id);
	
	if (!elemZip || elemZip.length === 0 ||
			!elemCountry || elemCountry.length === 0 ||
			!elemState || elemState.length === 0) {
		return;
	}
	
	var zip = elemZip.val().trim();
	var country = elemCountry.val().trim();
	var stateOrProvince = elemState.val().trim();
	
	// ignore if it's blank
	if (zip === "" || country === "") {
		return;
	}

	// set the default elem_id that stuff looks for to the zip_id
	validationObj.elem_id = validationObj.zip_id;
	
	switch (country) {
	case 'US':
		validateUSZip(validationObj);
		return;
		
	case 'CA':
		if (/^[A-Za-z0-9]{3}\s?[A-Za-z0-9]{3}$/.test(zip)) {
			elemZip.removeClass("field_error");
			$jQ("#" + validationObj.zip_id + "Alert").hide();
			return;
		}
		break;
		
	default:
		if (stateOrProvince === 'Other') {
			if (/^[A-Za-z0-9]{3,}$/.test(zip)) {
				elemZip.removeClass("field_error");
				$jQ("#" + validationObj.zip_id + "Alert").hide();
				return;
			}
		}
		else {
			// allow anything..?
			elemZip.removeClass("field_error");
			$jQ("#" + validationObj.zip_id + "Alert").hide();
			return;
		}
	}
	
	// clear the field error
	// position error div to the right of corresponding field
	
	var err_div = appendValidationError(validationObj, elemZip);
	
	if (validationObj.width) {
		err_div.width(validationObj.width);	
	}
}


/* takes two params - the validation object and an elem variable returned from jQuery
 * returns true if there was no error found, false if there was an error */
function validateEmail(validationObj) {
	var elem = $jQ("#" + validationObj.elem_id);
	if (!elem || elem.length === 0)
		return;
	
	var val = elem.val().trim();
	
	// ignore if it's blank
	if (val === "") {
		return;
	}

	// replicating the valEmail; could use a regular expression but no need to be "cool"
	var ok = true;
    var AtSym    = val.indexOf('@');
    var Period   = val.lastIndexOf('.');
    var Space    = val.indexOf(' ');
    var Length   = val.length - 1;
    if ((AtSym < 1) || (Period <= AtSym+1) || (Period == Length ) || (Space  != -1))
    {
        ok = false;
    }
    
	if (ok === true) {
		elem.removeClass("field_error");
		$jQ("#" + validationObj.elem_id + "Alert").hide();
		return;
	}

	// clear the field error
	// position error div to the right of corresponding field
	var err_div = appendValidationError(validationObj, elem);
	
	if (validationObj.width) {
		err_div.width(validationObj.width);	
	}
}


/* takes two params - the validation object and an elem variable returned from jQuery
 * returns true if there was no error found, false if there was an error */
function validateMonth(validationObj) {
	var elem = $jQ("#" + validationObj.elem_id);
	if (!elem || elem.length === 0)
		return;
	
	var val = elem.val().trim();
	
	// ignore if it's blank
	if (val === "") {
		return;
	}
	
	// if value is set, validate.
	if (/^(0?[1-9]|1[0-2])$/.test(val)) {
		elem.removeClass("field_error");
		$jQ("#" + validationObj.elem_id + "Alert").hide();
		return;
	}

	// clear the field error
	// position error div to the right of corresponding field
	var err_div = appendValidationError(validationObj, elem);
	
	if (validationObj.width) {
		err_div.width(validationObj.width);	
	}
}


/* takes two params - the validation object and an elem variable returned from jQuery
 * returns true if there was no error found, false if there was an error */
function validateCCExp(validationObj) {
	var moElem = $jQ("#" + validationObj.exp_month_id);
	var yrElem = $jQ("#" + validationObj.exp_year_id);
	
	if (!moElem || moElem.length === 0 
			|| !yrElem || yrElem.length === 0)
		return;
	
	var moVal = moElem.val();
	var yrVal = yrElem.val();
	
	// ignore if either are blank
	if (moVal === "" || yrVal === "") {
		return;
	}
	
	// validate month
	validationObj.elem_id = validationObj.exp_month_id;
	if (/^(0?[1-9]|1[0-2])$/.test(moVal)) {
		moElem.removeClass("field_error");
		$jQ("#" + validationObj.elem_id + "Alert").hide();
	}
	else {
		appendValidationError(validationObj, moElem);
		return;
	}
	
	// validate year
	validationObj.elem_id = validationObj.exp_year_id;
	// if value is set, validate. assume > 2010
	if (/^(20)?[1-9][0-9]$/.test(yrVal)) {
		yrElem.removeClass("field_error");
		$jQ("#" + validationObj.elem_id + "Alert").hide();
	}
	else {
		appendValidationError(validationObj, yrElem);
		return;
	}
	
	// deeper validation
	// check against current year
	var month = parseInt(moVal, 10);
	var year = parseInt(yrVal, 10);
	
	// fix 2-digit years
	if (year < 100) 
		year += 2000;
	
	var now = new Date();

	// set the expdate for comparison to be the 1st of the next month.
	if (month === 12) {
		month = 1;
		year++;
	}
	else {
		month++;
	}
	
	var expDate = new Date(year, month-1 /*month is zero-based for the constructor*/, 1);
	
	if (now > expDate) {
		// we actually associate the error with both mo and yr.. so there ends up being 2 errors.
		// that's ok.
		validationObj.elem_id = validationObj.exp_month_id;
		appendValidationError(validationObj, moElem);
		validationObj.elem_id = validationObj.exp_year_id;
		appendValidationError(validationObj, yrElem);
		return;
	}
	
	// we're good, clear any pre-existing errs
	yrElem.removeClass("field_error");
	moElem.removeClass("field_error");
	$jQ("#" + validationObj.exp_month_id + "Alert").hide();
	$jQ("#" + validationObj.exp_year_id + "Alert").hide();
}

/* 
 * one of the more complex validationObj's
 * 
 * validationObj.invalidCCNum = invalid credit card number message
 */
function validateNewCC(validationObj) {
	var elem = $jQ("#" + validationObj.elem_id);
	if (!elem || elem.length === 0)
		return;
	
	var ccnum = elem.val().trim();
	
	// ignore if it's blank
	if (ccnum === "") {
		return;
	}
	
	// special set value
	var cctype = validationObj.cctype;
	var ccelm = validationObj.ccelm;
	
	// clean it
	ccnum = ccnum.replace(/[\- ]/g, '');
	
	if (!/\d/g.test(ccnum) || !isValidCCLength(ccnum, cctype)) {
		validationObj.message = validationObj.invalidCCNum;
		appendValidationError(validationObj, elem);
		return;
	}
	
	
	// Added for PMO 286073 (TRU PLCC) - This code block process non regular cards.
    var regularCard = (cctype == "VC" || cctype =="MC" || cctype =="AM" || cctype == "DC");
    if (regularCard)
    {
        var leftMostCCNum = parseInt(ccnum.charAt(0));
        var shouldBeCardType = "";

        switch (leftMostCCNum) {
        case 3:
            shouldBeCardType = "AM";
            break;
        case 6:
            shouldBeCardType = "DC";
            break;
        case 4:
            shouldBeCardType = "VC";
            break;
        case 5:
            shouldBeCardType = "MC";
            break;
        }
        
        // if there is a card type we know it should be, and they don't match.. fix it.
        if (shouldBeCardType && shouldBeCardType != cctype) {
        	// correct the type
        	ccelm.val(shouldBeCardType);
        	ccelm.trigger('change');
        }
        else if (!shouldBeCardType) {
            // else there is a card type mismatch
        	validationObj.message = validationObj.invalidCCNum;
    		appendValidationError(validationObj, elem);
    		return;
        }
    }
    /*
    else
    {

        if (f.ccType.selectedIndex == "") {
            // Card type check
            f.alert.value= ('<msg:fmt type="info" topic="payment" name="slctCCType" escapeQuotes="true"/>');
            f.action= f.action + "?error=NCC4";
            f.submit();
        }
        else if (!isValidNum) {
            f.alert.value= ('<msg:fmt type="err" topic="cart" name="makeSureEntValCCNum" escapeQuotes="true"/>');
            f.action= f.action + "?error=NCC5";
            f.submit();
        }
        else if (!isValidLen) {
            f.alert.value= ('<msg:fmt type="err" topic="cart" name="makeSureEntValCCNum" escapeQuotes="true"/>');
            f.action= f.action + "?error=NCC6";
            f.submit();
        }
        else if (f.ccExpireMonth.selectedIndex == "" || f.ccExpireYear.selectedIndex == "") {
            f.alert.value= ('<msg:fmt type="err" topic="cart" name="makeSureSelCCExpMoYr" escapeQuotes="true"/>');
            f.action= f.action + "?error=NCC7";
            f.submit();
        }
        else if (eval(f.ccExpireYear.selectedIndex) < new Date().getFullYear()) {
            f.alert.value= ('<msg:fmt type="err" topic="cart" name="ccExpDateInvalid" escapeQuotes="true"/>');
            f.action= f.action + "?error=NCC8";
            f.submit();
        }
        else {
            // If no other criteria match, then display original message
            f.alert.value='<msg:fmt type="err" topic="cart" name="certValidCcExp" escapeQuotes="true"/>';
            f.action= f.action + "?error=NCC9";
            f.submit();
        }

    }
    */
    
    elem.removeClass("field_error");
	$jQ("#" + validationObj.elem_id + "Alert").hide();
	
}



function isValidCCLength(ccnumber, cctype) {

    var length = ccnumber.length;
	// Below variables are added for PLCC Generic solution.
	var tenderPlcc = document.getElementById("tenderPlcc").value;
	var tenderPlccLength = parseInt(document.getElementById("tenderPlccLength").value);

    if (cctype == "AM" && length == 15) {
        return true;
    }
    else if (cctype == "VC" && (length == 13 || length == 16)) {
        return true;
    }
    else if ((cctype == "MC" || cctype == "DC" || cctype =="TP") && length == 16)  { // updated to include TRU PLCC Card - PMO 286073
        return true;
    }	 
	else if ((cctype == "MC" || cctype == "DC" || cctype =="BV") && (length == 7 || length == 9 || length == 16))  { // updated to include BOSCOV'S PLCC Card - PMO 315375
        return true;
    } else if (!isNaN(tenderPlccLength) && cctype === tenderPlcc && length == tenderPlccLength) {
        return true;
    }

    return false;
}


// generic check form.
// the config object must specify a container selector value
// as well as a handler.  
// e.g.:  checkForm({ container: "fieldset#address", success: function() { submitAddressForm("shiptostore"); } });
function checkForm(config) {
	// check all errors cleanly; assume all are tied to blur calls
	$jQ(config.container + " .error_check").each(function() {
		// only trigger if visible
		if (isEnabled($jQ(this))) {
			$jQ(this).trigger("blur");
		}
	});

	// now count error messages.
	var errors = 0;
	$jQ(config.container + " .field_err_msg").each(function() {
		var elm = $jQ(this);                                //if (isEnabled(elm) && !elm.hasClass("validation_server_side"))
		 if (elm.is(":visible") && !elm.hasClass("validation_server_side")){    
			errors++; 
		}
	});
	
	var checkFlag = errors === 0;
	
	if (checkFlag === false) {
		// show the main error
		// shouldn't these be reverse order?
		if (valErrObj) {
			setGeneralErrors(valErrObj);
		}
		else if (config.valErrObj) {
			setGeneralErrors(config.valErrObj);
		}
		// scroll to top of page where main error message is
		if (config.scrollTo)
			$jQ(config.scrollTo).animate({scrollTop:0}, 'slow');
		else
			$jQ('html, body').animate({scrollTop:0}, 'slow');
	}
	else {
		config.success();
	}
}






function setGeneralErrors(errorObj) {
	var errBlock;
	if (errorObj.blockSelector)
		errBlock = $jQ(errorObj.blockSelector);
	else 
		errBlock = $jQ('#errorHeaderBlock');
	
    var html = [];
    if (errorObj.title) {
        html.push('<h2>');
        html.push(errorObj.title);
        html.push('</h2>');
    }

    if (errorObj.errors && errorObj.errors.length) {
        html.push('<ul>');
        for (var i = 0; i < errorObj.errors.length; i++) {
            html.push('<li>');
            html.push(errorObj.errors[i]);
            html.push('</li>');
        }
        html.push('</ul>');
    }

    if (errorObj.contactInfo) {
        html.push('<p>');
        html.push(errorObj.contactInfo);
        html.push('</p>');
    }

    html = html.join('');
    if (html) {
    	errBlock.html(html).show();
    }
}

// Script to assign click events to a button that causes a message panel to collapse/expand
// args object expects 2 properties:
// 		collapseTxt (optional) : Externalized String value. If not provided, will not change text between expanded/collapsed states.
// 		trigger : nodeRef to element that onclick events will be assigned to
// e.g. { collapseTxt : 'Collapse', trigger : $jQ('#em_box_1 .ce_error_summary button') }
// added by Randy Weber for PMO: 109
function ceExpandableMessagePane(args)
{
	var txt = args.trigger.text(),
		cfg = { 0 : { 'dir' : 'Down', 'txt' : args.collapseTxt || txt }, 1 : { 'dir' : 'Up', 'txt' : txt } },
		container = args.trigger.closest('.ce_error_container'),
		details = container.children('.ce_error_details'),
		self = this;
	
	// if no detailed message do nada
	if (details.html() === '')
		return;

	// make sure we're visible
	args.trigger.show();
	
	this.state = 1;
	
	args.trigger.click(function(e){
		e.preventDefault();
		
		if (!details.is(':animated'))
		{
			self.state = self.state === 0 ? 1 : 0;
			
			$jQ(this).html(cfg[self.state].txt + '<span></span>');
			
			details['slide' + cfg[self.state].dir](500, function(){
				container
					.toggleClass('ce_error_collapsed', self.state);
			});
		}
	});
};

// Script to populate the #promoErrorBlock element with the error messages returned from the server-side
// args object expects 2 properties:
// 		shortDesc : the short message (always visible)
// 		longDesc (optional) : HTML string of text that will be displayed when the ceExpandableMessagePane onclick event fires
// 		expandTxt (optional) : This is ignored if no longDesc is provided.  If longDesc is provided, this is the 'expand' text for the onclick button.
// e.g. { shortDesc : 'Nullam dictum metus non tortor ullamcorper eget cursus magna egestas.', longDesc : '<ul><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li><li>Aenean et sagittis quam. Pellentesque tincidunt vulputate mi.</li><li>Mauris posuere elementum nibh sed faucibus.</li><li>Donec porttitor tristique libero, ut euismod urna iaculis nec.</li><li>Ut lorem arcu, tincidunt sed egestas vitae, ultricies non enim.</li></ul>', expandTxt : 'Expand' }
// added by Randy Weber for PMO: 109
function setPromoErrors(args)
{
	var errorBlock = $jQ('#promoErrorBlock');
	
	if (errorBlock.length && args.shortDesc)
	{
		errorBlock
			.prepend('<div id="em_box_1" class="ce_error_container ce_error_collapsed">'
				+ '<div class="ce_error_summary">' + args.shortDesc + (args.longDesc ? ' <a href="#" class="toggle">' + (args.expandTxt || 'Details') + '<span></span></a>' : '') + '</div>'
				+ (args.longDesc ? '<div class="ce_error_details">' + args.longDesc + '</div>' : '')
				+ '</div>')
			.css('display', 'block');
	}
}

function disableValidatedInput (elem_id) {
    var e = $jQ("#"+elem_id);
    if (e) {
        e.attr("disabled", "disabled");
        e.removeClass("field_error");
    }
    
    var ea = $jQ("#"+elem_id+"Alert");
    if (ea) {
        ea.remove();
    }
}

function enableValidatedInput (elem_id) {
    $jQ("#"+elem_id).removeAttr("disabled");
}

function isEnabled (jqelem) {
    return jqelem.is(":visible") && jqelem.is(":enabled");
}

// Internet Explorer pukes on Array.indexOf().
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}
