package com.paypal.paypalmobilepaymentsshoppingcart;

import java.math.BigDecimal;
import java.util.List;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.Gravity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.FrameLayout.LayoutParams;
import android.widget.ListView; 
import android.view.ViewGroup; 

import com.paypal.android.MEP.CheckoutButton;
import com.paypal.android.MEP.PayPal;
//import com.paypal.android.MEP.PayPalInvoiceData;
//import com.paypal.android.MEP.PayPalInvoiceItem;
//import com.paypal.android.MEP.PayPalPayment;

public class SimpleDemo extends Activity implements OnClickListener {
	
	// The PayPal server to be used - can also be ENV_NONE and ENV_LIVE
	private static final int server = PayPal.ENV_SANDBOX;
	// The ID of your application that you received from PayPal
	private static final String appID = "APP-80W284485P519543T";
	// This is passed in for the startActivityForResult() android function, the value used is up to you
	private static final int request = 1;
	
	public static final String build = "10.12.09.8053";
	
	protected static final int INITIALIZE_SUCCESS = 0;
	protected static final int INITIALIZE_FAILURE = 1;

	// Native android items for the application
	TextView labelSimplePayment;
	View seperator;
	TextView title;
	TextView estTotal;
	TextView info;
	TextView extra;
	LinearLayout layoutSimplePayment;
	
	// You will need at least one CheckoutButton
	CheckoutButton launchSimplePayment;
	
	// These are used to display the results of the transaction
	public static String resultTitle;
	public static String resultInfo;
	public static String resultExtra;
	
	private List<Product> mCartList;
	private ProductAdapter mProductAdapter;
	
	// This handler will allow us to properly update the UI. You cannot touch Views from a non-UI thread.
	Handler hRefresh = new Handler(){
		@Override
		public void handleMessage(Message msg) {
			switch(msg.what){
		    	case INITIALIZE_SUCCESS:
		    		setupButtons();
		            break;
		    	case INITIALIZE_FAILURE:
		    		showFailure();
		    		break;
			}
		}
	};

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// Initialize the library. We'll do it in a separate thread because it requires communication with the server
		// which may take some time depending on the connection strength/speed.
		Thread libraryInitializationThread = new Thread() {
			public void run() {
				initLibrary();
				
				// The library is initialized so let's create our CheckoutButton and update the UI.
				if (PayPal.getInstance().isLibraryInitialized()) {
					hRefresh.sendEmptyMessage(INITIALIZE_SUCCESS);
				}
				else {
					hRefresh.sendEmptyMessage(INITIALIZE_FAILURE);
				}
			}
		};
		libraryInitializationThread.start();
		
		// Setup our UI.
		layoutSimplePayment = new LinearLayout(this);
		layoutSimplePayment.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT));
		layoutSimplePayment.setGravity(Gravity.CENTER_HORIZONTAL);
		layoutSimplePayment.setOrientation(LinearLayout.VERTICAL);
		layoutSimplePayment.setPadding(10, 10, 10, 10);
		layoutSimplePayment.setBackgroundColor(Color.WHITE);
		
		labelSimplePayment = new TextView(this);
		labelSimplePayment.setGravity(Gravity.CENTER_HORIZONTAL);
		labelSimplePayment.setText("Review Your Order");
		labelSimplePayment.setTextSize(24.0f);
		layoutSimplePayment.addView(labelSimplePayment);
		labelSimplePayment.setPadding(0, 5, 0, 5);
		labelSimplePayment.setVisibility(View.VISIBLE);

		double total = 0;
		
		mCartList = ShoppingCartHelper.getCartList();
		// Make sure to clear the selections
		for (int i = 0; i < mCartList.size(); i++) {
			mCartList.get(i).selected = false;
			total = total + mCartList.get(i).price;
		}
		
        ListView listView; 
        listView = new ListView(this); 
		mProductAdapter = new ProductAdapter(mCartList, getLayoutInflater(),
				true);
		listView.setAdapter(mProductAdapter);
		listView.setFocusableInTouchMode(true);
        listView.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT, 
        		300)); 
        layoutSimplePayment.addView(listView);

        seperator = new View(this);
        seperator.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, 2));
        seperator.setBackgroundColor(Color.BLACK);
        seperator.setVisibility(View.VISIBLE);
		layoutSimplePayment.addView(seperator);
        
		
    	BigDecimal estTotalNum = new BigDecimal(0);
		
		mCartList = ShoppingCartHelper.getCartList();
		// Make sure to clear the selections
		for (int i = 0; i < mCartList.size(); i++) {
    		BigDecimal unitPrice = new BigDecimal(mCartList.get(i).price);
    		BigDecimal quantity = new BigDecimal(ShoppingCartHelper.getProductQuantity(mCartList.get(i)));
    		estTotalNum = estTotalNum.add(unitPrice.multiply(quantity));
    	}
    	
		estTotal = new TextView(this);
		estTotal.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT));
		estTotal.setPadding(0, 5, 0, 5);
		estTotal.setGravity(Gravity.CENTER_HORIZONTAL);
		estTotal.setTextSize(14.0f);
		estTotal.setVisibility(TextView.VISIBLE);
		BigDecimal rounded = estTotalNum.setScale(2, BigDecimal.ROUND_HALF_UP);
		double estTotalDisplay = rounded.doubleValue();
		estTotal.setText("Est. Pre-Tax Total:	" + Double.toString(estTotalDisplay));
		layoutSimplePayment.addView(estTotal);
		
		title = new TextView(this);
		title.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT));
		title.setPadding(0, 5, 0, 5);
		title.setGravity(Gravity.CENTER_HORIZONTAL);
		title.setTextSize(30.0f);
		title.setVisibility(TextView.GONE);
		layoutSimplePayment.addView(title);
		
		info = new TextView(this);
		info.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT));
		info.setPadding(0, 5, 0, 5);
		info.setGravity(Gravity.CENTER_HORIZONTAL);
		info.setTextSize(20.0f);
		info.setVisibility(TextView.VISIBLE);
		info.setText("Initializing Library...");
		layoutSimplePayment.addView(info);
		
		extra = new TextView(this);
		extra.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT));
		extra.setPadding(0, 5, 0, 5);
		extra.setGravity(Gravity.CENTER_HORIZONTAL);
		extra.setTextSize(12.0f);
		extra.setVisibility(TextView.GONE);
		layoutSimplePayment.addView(extra);
		
		setContentView(layoutSimplePayment);
	}
	
	/**
	 * Create our CheckoutButton and update the UI.
	 */
	public void setupButtons() {
		PayPal pp = PayPal.getInstance();
		// Get the CheckoutButton. There are five different sizes. The text on the button can either be of type TEXT_PAY or TEXT_DONATE.
		launchSimplePayment = pp.getCheckoutButton(this, PayPal.BUTTON_194x37, CheckoutButton.TEXT_PAY);
		// You'll need to have an OnClickListener for the CheckoutButton. For this application, MPL_Example implements OnClickListener and we
		// have the onClick() method below.
		launchSimplePayment.setPadding(40, 15, 40, 15);
		launchSimplePayment.setOnClickListener(this);
		// The CheckoutButton is an android LinearLayout so we can add it to our display like any other View.
		layoutSimplePayment.addView(launchSimplePayment);

		info.setText("");
		info.setVisibility(View.GONE);
	}
	
	/**
	 * Show a failure message because initialization failed.
	 */
	public void showFailure() {
		title.setText("FAILURE");
		info.setText("Could not initialize the PayPal library.");
		title.setVisibility(View.VISIBLE);
		info.setVisibility(View.VISIBLE);
	}
	
	/**
	 * The initLibrary function takes care of all the basic Library initialization.
	 * 
	 * @return The return will be true if the initialization was successful and false if 
	 */
	private void initLibrary() {
		PayPal pp = PayPal.getInstance();
		// If the library is already initialized, then we don't need to initialize it again.
		if(pp == null) {
			// This is the main initialization call that takes in your Context, the Application ID, and the server you would like to connect to.
			pp = PayPal.initWithAppID(this, appID, server);
   			
			// -- These are required settings.
        	pp.setLanguage("en_US"); // Sets the language for the library.
        	// --
        	
        	// -- These are a few of the optional settings.
        	// Sets the fees payer. If there are fees for the transaction, this person will pay for them. Possible values are FEEPAYER_SENDER,
        	// FEEPAYER_PRIMARYRECEIVER, FEEPAYER_EACHRECEIVER, and FEEPAYER_SECONDARYONLY.
        	pp.setFeesPayer(PayPal.FEEPAYER_EACHRECEIVER); 
        	// Set to true if the transaction will require shipping.
        	pp.setShippingEnabled(true);
        	// Dynamic Amount Calculation allows you to set tax and shipping amounts based on the user's shipping address. Shipping must be
        	// enabled for Dynamic Amount Calculation. This also requires you to create a class that implements PaymentAdjuster and Serializable.
        	pp.setDynamicAmountCalculationEnabled(false);
        	// --
		}
	}
	
	/**
	 * Create a PayPalPayment which is used for simple payments.
	 * 
	 * @return Returns a PayPalPayment. 
	 */
/*	private PayPalPayment exampleSimplePayment() {
		//-- Create a basic PayPalPayment.
	//	PayPalPayment payment = new PayPalPayment();
		//-- Sets the currency type for this payment.
    //	payment.setCurrencyType("USD");
    	//-- Sets the recipient for the payment. This can also be a phone number.
    //	payment.setRecipient("example-merchant-1@paypal.com");
    	//-- Sets the Custom ID. This is any ID that you would like to have associated with the payment.
    //	payment.setCustomID("8873482296");
    	
    	//-- Sets the merchant name. This is the name of your Application or Company.
    //	payment.setMerchantName("The Retro Toy Store");
    	//-- Sets the Instant Payment Notification url. This url will be hit by the PayPal server upon completion of the payment.
    // 	payment.setIpnUrl("http://www.exampleapp.com/ipn");
    	
    	//-- Sets the payment type. This can be PAYMENT_TYPE_GOODS, PAYMENT_TYPE_SERVICE, PAYMENT_TYPE_PERSONAL.
    //	payment.setPaymentType(PayPal.PAYMENT_TYPE_GOODS);
    	//-- Sets a memo to your customer
    //	payment.setMemo("Coupon for 10% off next purchase");
    	
    	//-- PayPalInvoiceData can contain tax and shipping amounts. It also contains an ArrayList of PayPalInvoiceItem which can
    	//-- be filled out. These are not required for any transaction.
   // 	PayPalInvoiceData invoice = new PayPalInvoiceData();
    	
    	BigDecimal total = new BigDecimal(0);

		mCartList = ShoppingCartHelper.getCartList();
		//-- Make sure to clear the selections
		for (int i = 0; i < mCartList.size(); i++) {
			mCartList.get(i).selected = false;

   // 		PayPalInvoiceItem item = new PayPalInvoiceItem();
    		if(mCartList.get(i).title.length() > 0) {
   // 			item.setName(mCartList.get(i).title);
    		}
    		if(mCartList.get(i).itemId.length() > 0) {
   // 			item.setID(mCartList.get(i).itemId);
    		}

   // 		item.setQuantity(ShoppingCartHelper.getProductQuantity(mCartList.get(i)));
    		
    		BigDecimal unitPrice = new BigDecimal(mCartList.get(i).price);
   //		item.setUnitPrice(unitPrice);
    		
    		BigDecimal quantity = new BigDecimal(ShoppingCartHelper.getProductQuantity(mCartList.get(i)));
    		
   // 		item.setTotalPrice(unitPrice.multiply(quantity));
			total = total.add(unitPrice.multiply(quantity));
    		
   // 		invoice.getInvoiceItems().add(item);
    	}

    	//-- Sets the amount of the payment, not including tax and shipping amounts.
   // 	payment.setSubtotal(total);

    	//-- Sets the tax amount.
    	BigDecimal totalTax = new BigDecimal("0.085");
   // 	invoice.setTax(totalTax.multiply(total));
    	//-- Sets the shipping amount.
   // 	invoice.setShipping(new BigDecimal("7.50"));
    	
    	//-- Sets the PayPalPayment invoice data.
   // 	payment.setInvoiceData(invoice);
		
   // 	return payment;
	}*/

	public void onClick(View v) {
		/*if(v == launchSimplePayment) {
			// Use our helper function to create the simple payment.
			PayPalPayment payment = exampleSimplePayment();	
			// Use checkout to create our Intent.
			Intent checkoutIntent = PayPal.getInstance().checkout(payment, this, new ResultDelegate());
			// Use the android's startActivityForResult() and pass in our Intent. This will start the library.
	    	startActivityForResult(checkoutIntent, request);
		}*/
	}
	
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
    	if(requestCode != request)
    		return;

    	launchSimplePayment.updateButton();
    }
}