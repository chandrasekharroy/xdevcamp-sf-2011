<?php
/*
Plugin Name: PayPal Digital Goods Subscriptions
Description: Allows you to take payments through Paypal for premium content on your site.
Version: 1.0
Author: Matt Cole
License: GPL2
*/

function pdgs_install() {
	global $wpdb;
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

	$tblname = $wpdb->prefix . 'pdgs_restricted_categories';
	$sql = 'CREATE TABLE ' . $tblname . ' (
		cat_id BIGINT NOT NULL,
		UNIQUE KEY cat_id (cat_id)
		);';

	dbDelta( $sql );

	$tblname = $wpdb->prefix . 'pdgs_subscribed_users';

	$sql = 'CREATE TABLE ' . $tblname . ' (
		user_id BIGINT NOT NULL,
		profile_id VARCHAR(14) NOT NULL,
		UNIQUE KEY user_id (user_id)
		);';

	dbDelta( $sql );

	add_option( 'pdgs_price',             2.99 );
	add_option( 'pdgs_currency',          'USD' );
	add_option( 'pdgs_billing_frequency', 1 );
	add_option( 'pdgs_billing_period',    'Month' );

}

register_activation_hook( __FILE__, 'pdgs_install' );

function pdgs_admin() {

	$valid_currencies = pdgs_admin_get_valid_currencies();

	$valid_billing_periods = array(
		'Day'   => 'Days',
		'Week'  => 'Weeks',
		'Month' => 'Months',
		'Year'  => 'Years'
	);

	$errors = array();
	$warnings = array();
	$success = false;

	$cats = get_categories( array( 'orderby' => 'name', 'order' => 'ASC', 'hide_empty' => false ) );
	$valid_cats = array();
	foreach( $cats as $v ) {
		$valid_cats[ $v->cat_ID ] = $v->cat_name;
	}

	if( isset( $_POST[ 'pdgs_update_config' ] ) && 
		( 'Y' == $_POST[ 'pdgs_update_config' ] ) ) {
		if( isset( $_POST[ 'pdgs_cats' ] ) )
			$selected_cats =   $_POST[ 'pdgs_cats'              ]  ;
		else
			$selected_cats =   array();
			
		$price         = trim( $_POST[ 'pdgs_price'             ] );
		$currency      = trim( $_POST[ 'pdgs_currency'          ] );
		$frequency     = trim( $_POST[ 'pdgs_frequency'         ] );
		$period        = trim( $_POST[ 'pdgs_period'            ] );

		if( !strlen( $price ) || !is_numeric( $price ) )
			$errors[] = 'The price you entered is not valid.';
		if( !in_array( $currency, $valid_currencies ) )
			$errors[] = 'The currency code you selected is not valid.';
		if( !strlen( $frequency ) || !is_numeric( $frequency ) )
			$errors[] = 'The billing frequency you entered is not valid.';
		if( !in_array( $period, array_keys( $valid_billing_periods ) ) )
			$errors[] = 'The billing period you selected is not valid.';

		$cats_valid = true;
		foreach( $selected_cats as $i => $v ) {
			if( !array_key_exists( $i, $valid_cats ) ) $cats_valid = false;
		}

		if( !count( $errors ) ) {
			update_option( 'pdgs_price',             $price         );
			update_option( 'pdgs_currency',          $currency      );
			update_option( 'pdgs_billing_frequency', $frequency     );
			update_option( 'pdgs_billing_period',    $period        );

			pdgs_admin_save_selected_cats( $selected_cats );

			$success = true;
		}
	}

	echo '<div class="wrap"><h2>Premium Content</h2>';

	if( $success ) pdgs_admin_display_success_message( 'Options saved successfully.' );
	if( count( $warnings ) ) pdgs_admin_display_warnings( $warnings );
	if( count( $errors ) ) pdgs_admin_display_errors( $errors );
	
	pdgs_admin_start_form();
	pdgs_admin_display_textbox( 'Subscription price', 'pdgs_price', get_option( 'pdgs_price' ) );
	pdgs_admin_display_dropdown( 'Subscription currency', 'pdgs_currency', $valid_currencies, get_option( 'pdgs_currency' ) );
	pdgs_admin_display_textbox( 'Billing frequency', 'pdgs_frequency', get_option( 'pdgs_billing_frequency' ) );
	pdgs_admin_display_dropdown( 'Billing period', 'pdgs_period', $valid_billing_periods, get_option( 'pdgs_billing_period' ) );
	pdgs_admin_display_multicheckbox( 'Premium content categories', 'pdgs_cats', $valid_cats, pdgs_admin_get_selected_cats( $valid_cats ) );	
	pdgs_admin_end_form();
}

function pdgs_display_signup_invite( $excerpt ) {

	$ajaxurl = admin_url( 'admin-ajax.php' );
	$the_id = get_the_ID();
	$frequency = get_option( 'pdgs_billing_frequency' );
	$price = get_option( 'pdgs_price' ) . ' ' . get_option( 'pdgs_currency' ) . ' every ';
	$period = strtolower( get_option( 'pdgs_billing_period' ) );
	
	if( $frequency > 1 ) $price .= $frequency . ' ' . $period . 's';
	else $price .= $period;
	
	$dg_code = <<<EOF
<div id="pdgs_content">$excerpt</div>
<div id="pdgs_error" style="border: 1px solid red; background-color: #ff8888; padding: 5px; width: 100%; display: none;"></div>
<div id="pdgs_form" style="text-align: center;">
<p style="font-style: italic; text-align: center;">To see the full content of this post, subscribe to our premium content by clicking below.</p>
<p style="font-style: italic; text-align: center;">Price: $price</p>
<p style="text-align: center;"><a href="javascript:void(0)" onClick="getPremiumContent()">Click here to subscribe</a></p>
</div>
<script type="text/javascript">
function getPremiumContent() {
	jQuery.ajax( {
		url: "$ajaxurl?action=pdgs_finish&pdgs_post_id=$the_id",
		success: function( data, textStatus, jqXHR ) {
			jQuery( "#pdgs_content" ).html( data );
			jQuery( "#pdgs_error" ).hide();
			jQuery( "#pdgs_form" ).hide();
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			jQuery( "#pdgs_error" ).html( "An error occurred while trying to activate your subscription.  Please try again later." );
			jQuery( "#pdgs_error" ).show();
		}
	} );
}
</script>
EOF;

	return $dg_code;
}

function pdgs_finish() {

	global $wpdb;

	$post_id = $_GET['pdgs_post_id'];

	$profile_id = 'filler';

	$tblname = $wpdb->prefix . 'pdgs_subscribed_users';
	$user = wp_get_current_user();
	$wpdb->insert( $tblname, array ( 'user_id' => $user->ID, 'profile_id' => $profile_id ), array ( '%d', '%s' ) );

	echo pdgs_display_final_content( $post_id );

	die();
}

add_action( 'wp_ajax_pdgs_finish', 'pdgs_finish' );

function pdgs_display_final_content( $post_id ) {

	echo pdgs_get_rendered_content( $post_id );

}

function pdgs_unsubscribe_user( $user_id, $profile_id ) {
	global $wpdb;

	$tblname = $wpdb->prefix . 'pdgs_subscribed_users';
	$sql = 'DELETE FROM ' . $tblname . ' WHERE user_id=' . $user_id;
	$wpdb->query( $sql );
	echo 'You have been successfully unsubscribed from this site\'s premium content.';

}

require_once( 'pdgs-functions.php' );

?>