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
import com.paypal.android.MEP.PayPalInvoiceData;
import com.paypal.android.MEP.PayPalInvoiceItem;
//import com.paypal.android.MEP.PayPalAdvancedPayment;
//import com.paypal.android.MEP.PayPalReceiverDetails;

public class ChainedPaymentsDemo extends Activity implements OnClickListener {
	
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
	CheckoutButton launchChainedPayment;
	
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
		launchChainedPayment = pp.getCheckoutButton(this, PayPal.BUTTON_194x37, CheckoutButton.TEXT_PAY);
		// You'll need to have an OnClickListener for the CheckoutButton. For this application, MPL_Example implements OnClickListener and we
		// have the onClick() method below.
		launchChainedPayment.setOnClickListener(this);
		// The CheckoutButton is an android LinearLayout so we can add it to our display like any other View.
		layoutSimplePayment.addView(launchChainedPayment);

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
	 * Creates a PayPalAdvancedPayment which is setup to be a chained payment.
	 * 
	 * @return Returns a PayPalAdvancedPayment.
	 */
/*	private PayPalAdvancedPayment exampleChainedPayment() {
		//-- Create the PayPalAdvancedPayment.
   //	PayPalAdvancedPayment payment = new PayPalAdvancedPayment();
		//-- Sets the currency type for this payment.
   // 	payment.setCurrencyType("USD");
    	//-- Sets the Instant Payment Notification url. This url will be hit by the PayPal server upon completion of the payment.
   // 	payment.setIpnUrl("http://www.exampleapp.com/ipn");
    	//-- Sets the memo. This memo will be part of the notification sent by PayPal to the necessary parties.
   // 	payment.setMemo("A memo for chained payments, this be.");
    	
    	//-- Create the PayPalReceiverDetails. You must have at least one of these to make an advanced payment and you should have
    	//-- more than one for a Parallel or Chained payment.
	//	PayPalReceiverDetails receiver1 = new PayPalReceiverDetails();
		//-- Sets the recipient for the PayPalReceiverDetails. This can also be a phone number.
	//	receiver1.setRecipient("example-merchant-1@paypal.com");
		//-- Sets the primary flag for the receiver. One receiver must be a primary to create a Chained payment.
	//	receiver1.setIsPrimary(true);
		//-- Sets the payment type. This can be PAYMENT_TYPE_GOODS, PAYMENT_TYPE_SERVICE, PAYMENT_TYPE_PERSONAL, or PAYMENT_TYPE_NONE.
	//	receiver1.setPaymentType(PayPal.PAYMENT_TYPE_SERVICE);
		
		//-- PayPalInvoiceData can contain tax and shipping amounts. It also contains an ArrayList of PayPalInvoiceItem which can
    	//-- be filled out. These are not required for any transaction.
	//	PayPalInvoiceData invoice1 = new PayPalInvoiceData();

		//-- PayPalInvoiceItem has several parameters available to it. None of these parameters is required.
	//	PayPalInvoiceItem item1 = new PayPalInvoiceItem();

		BigDecimal total = new BigDecimal(0);
		
		mCartList = ShoppingCartHelper.getCartList();
    	if ( mCartList.size() > 0 )
    	{
	    	//-- Sets the item name and ID.
			if(mCartList.get(0).title.length() > 0) {
	//			item1.setName(mCartList.get(0).title);
			}
			if(mCartList.get(0).itemId.length() > 0) {
	//			item1.setID(mCartList.get(0).itemId);
			}
	    	//-- Sets the unit price.
			BigDecimal unitPrice = new BigDecimal(mCartList.get(0).price);
	//    	item1.setUnitPrice(unitPrice);
	    	
	    	//-- Sets the quantity.
	    	BigDecimal quantity = new BigDecimal(ShoppingCartHelper.getProductQuantity(mCartList.get(0)));
	//    	item1.setQuantity(ShoppingCartHelper.getProductQuantity(mCartList.get(0)));
    	
	    	// --Sets the total price which should be (quantity * unit price). The total prices of all PayPalInvoiceItem should add up
	    	//-- to less than or equal the subtotal of the payment.
	//    	item1.setTotalPrice(unitPrice.multiply(quantity));
	    	total = total.add(unitPrice.multiply(quantity));
	    	
			//-- Sets the tax amount.
	    	BigDecimal totalTax = new BigDecimal("0.085");
	//    	invoice1.setTax(totalTax.multiply(unitPrice.multiply(quantity)));
    	}
    	//-- Add the PayPalInvoiceItem to the PayPalInvoiceData. Alternatively, you can create an ArrayList<PayPalInvoiceItem>
    	//-- and pass it to the PayPalInvoiceData function setInvoiceItems().
   // 	invoice1.getInvoiceItems().add(item1);
	 	
    	//-- Sets the PayPalReceiverDetails invoice data.
   //  	receiver1.setInvoiceData(invoice1);
		//-- Sets the subtotal of the payment for this receiver, not including tax amount.
    	//-- After airline and hotel receive their percentage, 2% of the total will go to the Travel Agency.
   //	receiver1.setSubtotal(total);
    	//-- Sets the merchant name. This is the name of your Application or Company.
   //  	receiver1.setMerchantName("World of Travel");
    	//-- Sets the description of the payment.
   // 	receiver1.setDescription("A chain payment primary");
    	//-- Sets the Custom ID. This is any ID that you would like to have associated with the PayPalReceiverDetails.
   // 	receiver1.setCustomID("55342");
    	//-- Add the receiver to the payment. Alternatively, you can create an ArrayList<PayPalReceiverOptions>
    	//-- and pass it to the PayPalAdvancedPayment function setReceivers().
   //	payment.getReceivers().add(receiver1);
    	
		//-- Create another receiver for the chained payment
	//	PayPalReceiverDetails receiver2 = new PayPalReceiverDetails();
	//	receiver2.setRecipient("example-merchant-2@paypal.com");
    //	BigDecimal hotelsTotal = new BigDecimal("0.40");
    //	receiver2.setSubtotal(hotelsTotal.multiply(total));
	//	receiver2.setIsPrimary(false);
	//	receiver2.setPaymentType(PayPal.PAYMENT_TYPE_SERVICE);
	//	receiver2.setMerchantName("Best Hotels");
	//	receiver2.setDescription("One of the chain payment secondaries");
    //	receiver2.setCustomID("93675");
	//	payment.getReceivers().add(receiver2);
		
		//-- Create another receiver for the chained payment
	//	PayPalReceiverDetails receiver3 = new PayPalReceiverDetails();
	//	receiver3.setRecipient("example-merchant-3@paypal.com");
    //	BigDecimal airlinesTotal = new BigDecimal("0.58");
    //	receiver3.setSubtotal(airlinesTotal.multiply(total));
	//	receiver3.setIsPrimary(false);
	//	receiver3.setPaymentType(PayPal.PAYMENT_TYPE_SERVICE);
	//	receiver3.setMerchantName("Best Airlines");
	//	receiver3.setDescription("One of the chain payment secondaries");
    //	receiver3.setCustomID("78853");
	//	payment.getReceivers().add(receiver3);

	//	return payment;
	}*/


	public void onClick(View v) {

	/*	if(v == launchChainedPayment) {
			// Use our helper function to create the chained payment.
    		PayPalAdvancedPayment payment = exampleChainedPayment();
    		// Use checkout to create our Intent.
    		Intent checkoutIntent = PayPal.getInstance().checkout(payment, this, new ResultDelegate());
    		// Use the android's startActivityForResult() and pass in our Intent. This will start the library.
	    	startActivityForResult(checkoutIntent, request);
		}*/
	}
	
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
    	if(requestCode != request)
    		return;

    	launchChainedPayment.updateButton();
    }
}