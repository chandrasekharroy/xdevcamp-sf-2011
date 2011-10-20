<?php

function pdgs_admin_display_textbox( $title, $name, $initval, $size = 10 ) {
?><tr><td style="text-align: right;"><?php echo $title; ?>:</td>
<td><input type="text" size="<?php echo $size; ?>" name="<?php echo $name; ?>" value="<?php echo $initval; ?>" /></td></tr>
<?php
}

function pdgs_admin_display_checkbox( $title, $name, $checked ) {
?><tr><td style="text-align: right;"><?php echo $title; ?>:</td>
<td><input type="checkbox" name="<?php echo $name; ?>" <?php if($checked) echo 'checked="checked"'; ?> /></td></tr>
<?php
}

function pdgs_admin_display_dropdown( $title, $name, $choices, $selectedval ) {
?><tr><td style="text-align: right;"><?php echo $title; ?>:</td>
<td><select name="<?php echo $name; ?>">
<?php
	foreach( $choices as $i => $v ) {
		echo '<option value="' . $i . '"';
		if( $i == $selectedval ) echo ' selected="selected"';
		echo '>' . $v . '</option>';
	}
?></select></td></tr>
<?php
}

function pdgs_admin_display_multicheckbox( $title, $name, $labelArray, $checkedArray ) {
?><tr><td style="text-align: right; vertical-align: top;"><?php echo $title; ?>:</td>
<td>
<?php
	foreach( $labelArray as $i => $v ) {
		echo '<input type="checkbox" name="' . $name . '[' . $i . ']" value="true"';
		if( $checkedArray[ $i ] ) echo ' checked="checked"';
		echo ' id="' . $name . $i . '"/><label for="' . $name . $i . '">' . $v . '</label><br />';
	}
?></td></tr>
<?php
}

function pdgs_admin_start_form() {
?><form action="" method="POST" name="pdgs_options">
<input type="hidden" name="pdgs_update_config" value="Y" />
<table style="border: 0px;">
<?php
}

function pdgs_admin_end_form() {
?><tr>
<td style="text-align: center;" colspan="2"><input type="submit" name="submit" value="Save Changes" /></td>
</tr>
</table>
</form>
<?php
}

function pdgs_admin_get_selected_cats( $valid_cats ) {
	global $wpdb;
	
	$tblname = $wpdb->prefix . 'pdgs_restricted_categories';

	$dbresults = $wpdb->get_results( 'SELECT cat_id FROM ' . $tblname );
	$selected_cats = array();
	foreach( $valid_cats as $i => $v ) {
		$selected_cats[$i] = false;
	}
	
	foreach( $dbresults as $v ) {
		if( isset( $selected_cats[ $v->cat_id ] ) ) $selected_cats[ $v->cat_id ] = true;
	}
	
	return $selected_cats;
}

function pdgs_admin_get_valid_currencies() {

	return array(
		'AUD' => 'AUD',
		'BRL' => 'BRL',
		'CAD' => 'CAD',
		'CZK' => 'CZK',
		'DKK' => 'DKK',
		'EUR' => 'EUR',
		'HKD' => 'HKD',
		'HUF' => 'HUF',
		'ILS' => 'ILS',
		'JPY' => 'JPY',
		'MYR' => 'MYR',
		'MXN' => 'MXN',
		'NOK' => 'NOK',
		'NZD' => 'NZD',
		'PHP' => 'PHP',
		'PLN' => 'PLN',
		'GBP' => 'GBP',
		'SGD' => 'SGD',
		'SEK' => 'SEK',
		'CHF' => 'CHF',
		'TWD' => 'TWD',
		'THB' => 'THB',
		'TRY' => 'TRY',
		'USD' => 'USD'
	);

}

function pdgs_admin_display_message( $message, $bordercolor, $bgcolor ) {
	echo '<div class="wrap" style="border: 1px solid ' . $bordercolor . '; background-color: ' . $bgcolor . '; width: 100%; padding: 5px;">' . $message . '</div>';
}

function pdgs_admin_display_success_message( $message ) {
	pdgs_admin_display_message( $message, 'green', '#88ff88' );
}

function pdgs_admin_display_warnings( $warnings ) {
	$message = 'The following warnings were generated:<ul style="list-style: disc inside;"><li>' . implode( '</li><li>', $warnings ) . '</li>';
	pdgs_admin_display_message( $message, 'yellow', '#ffff88' );
}

function pdgs_admin_display_errors( $errors ) {
	$message = 'The following errors occurred while trying to save your options:<ul style="list-style: disc inside;"><li>' . implode( '</li><li>', $errors ) . '</li>';
	pdgs_admin_display_message( $message, 'red', '#ff8888' );
}

function pdgs_admin_save_selected_cats( $selected_cats ) {
	global $wpdb;

	$tblname = $wpdb->prefix . 'pdgs_restricted_categories';

	$wpdb->query( 'DELETE FROM ' . $tblname );
	
	if( count( $selected_cats ) ) $wpdb->query( 'INSERT INTO ' . $tblname . ' (cat_id) VALUES (' . implode( '),(', array_keys( $selected_cats ) ) . ')' );

}

function pdgs_setup_menus() {
	add_users_page( 'Premium Content', 'Premium Content', 'read', 'pdgs-user-admin', 'pdgs_user_admin' );
	if( current_user_can( 'add_users' ) ) {
		add_options_page( 'Premium Content', 'Premium Content', 'add_users', 'pdgs-admin', 'pdgs_admin' );
	}
}

add_action( 'admin_menu', 'pdgs_setup_menus' );

function pdgs_user_admin() {
	global $wpdb;

	$pdgs_unsubscribe_key = 'pdgs_user_admin_unsubscribe';
	$tblname = $wpdb->prefix . 'pdgs_subscribed_users';
	$user = wp_get_current_user();
	$sql = 'SELECT profile_id FROM ' . $tblname . ' WHERE user_id=' . $user->ID;
	$dbrow = $wpdb->get_row( $sql );

	echo '<div class="wrap"><h2>Premium Content</h2><p>';

	if( ( $dbrow === NULL ) || !strlen( trim( $dbrow->profile_id ) ) ) {
		echo 'You are not currently subscribed to this site\'s premium content.';

	} else {
		if( isset( $_POST[ $pdgs_unsubscribe_key ] ) && ( 'Y' == $_POST[ $pdgs_unsubscribe_key ] ) ) {
			pdgs_unsubscribe_user( $user->ID, $dbrow->profile_id );
		} else {
?>
You are currently subscribed to this site's premium content.  To unsubscribe, click the 'Unsubscribe' button below.</p>
<form name="pdgs_unsubscribe" method="POST" action="">
<input type="hidden" name="<?php echo $pdgs_unsubscribe_key; ?>" value="Y" />
<input type="submit" name="submit" value="Unsubscribe" />
</form>
<p>
<?php
		}
	}
	echo '</p>';
}

function pdgs_get_rendered_content( $post_id ) {
	query_posts( 'p=' . $post_id );
	ob_start();
	if( have_posts() ) {
		the_post();
		the_content();
	}
	return ob_get_clean();
}

$pdgs_is_filtering_content = false;
function pdgs_filter_content( $content ) {
	global $wpdb;
	global $pdgs_is_filtering_content;
	global $wp_query;

	// I believe that get_the_excerpt() runs the post through any the_content filters.  Since we call get_the_excerpt() from this function,
	// we must take steps to prevent PHP from infinitely recursing into this function.  Segfaults are bad.
	if( $pdgs_is_filtering_content ) return $content;

	// Get the posts category IDs.
	$cats = array();
	foreach( get_the_category() as $cat ) {
		$cats[] = $cat->cat_ID;
	}

	// See if any of the category IDs are in our "restricted categories" table.

	$tblname = $wpdb->prefix . 'pdgs_restricted_categories';

	$sql = 'SELECT * FROM ' . $tblname . ' WHERE cat_id=' . implode(' OR cat_id=', $cats);
	$wpdb->query( $sql );

	if( $wpdb->num_rows ) {
		// It's protected.  Is this user subscribed?
		$user = wp_get_current_user();
		if( 0 == $user->ID ) {
			// Not logged in.  Generate a stub asking them to log in first.
			$pdgs_is_filtering_content = true;
			$excerpt = get_the_excerpt();
			$pdgs_is_filtering_content = false;
			if( $wp_query->post_count > 1 ) return $excerpt;
			else {
				$addendum = $excerpt . '<p style="font-style: italic; text-align: center;"><i>You must be logged in to see the full text of this post.  <a href="' . wp_login_url( get_permalink() ) . '">Click here</a> to log in';
				if( get_option( 'users_can_register' ) ) $addendum .= ' or register';
				$addendum .= '.</p>';
				return $addendum;
			}
		} else {
			// Admins can always see everything.
			// if( current_user_can( 'add_users' ) ) return $content;

			// Check to see if this user is subscribed.
			$tblname = $wpdb->prefix . 'pdgs_subscribed_users';
			$sql = 'SELECT * FROM ' . $tblname . ' WHERE user_id=' . $user->ID;
			$result = $wpdb->get_row( $sql );

			if( NULL === $result ) {
				// Not subscribed.  Generate an invite to subscribe.
				$pdgs_is_filtering_content = true;
				$excerpt = get_the_excerpt();
				$pdgs_is_filtering_content = false;
				if( $wp_query->post_count > 1 ) {
					// Prevent the button from displaying in situations where we're displaying multiple posts.
					return $excerpt;
				} else {
					return pdgs_display_signup_invite( $excerpt );
				}
			} else {
				// Subscribed.  Return the content.
				return $content;
			}
		}
	} else {
		// It's not protected.  Return the content.
		return $content;
	}
}

add_filter( 'the_content', 'pdgs_filter_content' );

function pdgs_enqueue_scripts() {
	wp_enqueue_script( 'jquery' );
}

add_action( 'wp_enqueue_scripts', 'pdgs_enqueue_scripts' );

// For those of you that are snooping through my code, here's the nitty-gritty functions that actually deal with the PayPal API.
// This example uses Name-Value Pair (NVP) syntax.  It's essentially a set of NAME=VALUE pairs, with each name/value pair
// separated by ampersands -- e.g.:
//
// USER=matt_api1.somewhere.com&PWD=abcdefghij&SIGNATURE=abcdefghijklmnopqrstuvwxyz&METHOD=SetExpressCheckout ...
//
// Additionally, you should always use urlencode() on the values.

// Transform an associative array into an NVP string.  Pretty simple, eh?
function pdgs_encode_nvp( $params ) {
	$outarr = array();
	foreach( $params as $i => $v ) {
		$outarr[] = $i . '=' . urlencode( $v );
	}
	return implode( '&', $outarr );
}

// Transform an NVP string back into an associative array.  Also pretty simple -- we just have to do the reverse of what
// we did in the previous function!
function pdgs_decode_nvp( $nvpstr ) {
	$inarr = explode( '&', $nvpstr );
	$outarr = array();
	foreach( $inarr as $v ) {
		$sub = explode( '=', $v );
		$outarr[ $sub[ 0 ] ] = urldecode( $sub[ 1 ] );
	}
	return $outarr;
}

// Run the API call using cURL if available.  If cURL isn't available, use fsockopen as a fallback.
// If fsockopen doesn't support SSL, the call will fail.
//
// Note to Windows XAMPP users -- cURL support is disabled with the default installation of XAMPP.
// It's enabled on OS X and Linux, but not Windows -- go figure.  To enable it, open php.ini
// (generally in C:\xampp\php) and uncomment the "extension=php_curl.dll" line!
//
// $nvparr is an associative array of name/value pairs.
// Returns: an associative array of response parameters.  If a communication error occurred, ACK
// will be 'Failure', and L_ERRORCODE0 will be -1.  L_LONGMESSAGE0 will contain debugging information
// (hopefully) indicating why the communication failed.
function pdgs_run_api_call( $nvparr ) {

	$nvparr[ 'USER'      ] = get_option( 'pdgs_api_username' );
	$nvparr[ 'PWD'       ] = get_option( 'pdgs_api_password' );
	$nvparr[ 'SIGNATURE' ] = get_option( 'pdgs_api_signature' );
	
	$nvpstr = pdgs_encode_nvp( $nvparr );
	
	$host = get_option( 'pdgs_use_sandbox' ) ? 'api-3t.sandbox.paypal.com' : 'api-3t.paypal.com';
	
	if( function_exists( 'curl_version' ) ) {
		return pdgs_run_curl_api_call( $nvpstr, $host );
	} else {
		if( in_array( 'ssl', stream_get_transports() ) ) {
			return pdgs_run_fsock_api_call( $nvpstr, $host );
		} else {
			return array(
				'ACK'             => 'Failure',
				'L_ERRORCODE0'    => '-1',
				'L_SHORTMESSAGE0' => 'Unable to communicate with the PayPal API',
				'L_LONGMESSAGE0'  => 'No interfaces are available that can communicate with the PayPal API'
			);
		}
	}

}

function pdgs_run_curl_api_call( $nvpstr, $host ) {

	$curl = curl_init( 'https://' . $host . '/nvp' );
	
	curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
	
	// The next two options are necessary on some hosts that can't validate the authenticity of PayPal's SSL certs.
	curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $curl, CURLOPT_SSL_VERIFYHOST, 0 );
	
	curl_setopt( $curl, CURLOPT_POST, true );
	curl_setopt( $curl, CURLOPT_POSTFIELDS, $nvpstr );
	
	$response = curl_exec( $curl );
	
	if( FALSE === $response ) {
		return array(
			'ACK'             => 'Failure',
			'L_ERRORCODE0'    => '-1',
			'L_SHORTMESSAGE0' => 'Unable to communicate with the PayPal API',
			'L_LONGMESSAGE0'  => curl_error( $curl )
		);
	}
	
	return pdgs_decode_nvp( $response );
	
}

function pdgs_run_fsock_api_call( $nvpstr, $host ) {

	$handle = fsockopen( 'ssl://' . $host, 443, $errno, $errstr );
	if( FALSE === handle ) {
		return array(
			'ACK' => 'Failure',
			'L_ERRORCODE0' => '-1',
			'L_SHORTMESSAGE0' => 'Unable to communicate with the PayPal API',
			'L_LONGMESSAGE0'  => $errno . ': ' . $errstr
		);
	}
	
	$the_request = "POST /nvp HTTP/1.1\r\n" .
		"Host: $host\r\n" .
		"Connection: close\r\n" .
		"Content-Length: " . strlen( $nvpstr ) . "\r\n" .
		"Content-Type: text/nvp\r\n\r\n" . $nvpstr;
		
	fwrite( $handle, $the_request );
	$data = '';
	while( !feof( $handle ) ) {
		$data .= fread( $handle, 1024 );
	}
	
	fclose( $handle );
	
	$split = explode( "\r\n\r\n", $data );
	
	return pdgs_decode_nvp( $split[1] );
	
}

function pdgs_add_time( $interval, $count ) {
	$intstr = substr( $interval, 0, 1 );
	return date_create()->add( new DateInterval( 'P' . $count . $intstr ) )->format( 'c' );
}

?>