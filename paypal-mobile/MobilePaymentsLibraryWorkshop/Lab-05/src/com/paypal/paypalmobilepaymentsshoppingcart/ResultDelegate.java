package com.paypal.paypalmobilepaymentsshoppingcart;

import java.io.Serializable;

import com.paypal.android.MEP.PayPalResultDelegate;

public class ResultDelegate implements PayPalResultDelegate, Serializable {

	private static final long serialVersionUID = 10001L;

	/**
	 * Notification that the payment has been completed successfully.
	 * 
	 * @param payKey			the pay key for the payment
	 * @param paymentStatus		the status of the transaction
	 */
	public void onPaymentSucceeded(String payKey, String paymentStatus) {
		ChainedPaymentsDemo.resultTitle = "SUCCESS";
		ChainedPaymentsDemo.resultInfo = "You have successfully completed your transaction.";
		ChainedPaymentsDemo.resultExtra = "Key: " + payKey;
	}

	/**
	 * Notification that the payment has failed.
	 * 
	 * @param paymentStatus		the status of the transaction
	 * @param correlationID		the correlationID for the transaction failure
	 * @param payKey			the pay key for the payment
	 * @param errorID			the ID of the error that occurred
	 * @param errorMessage		the error message for the error that occurred
	 */
	public void onPaymentFailed(String paymentStatus, String correlationID,
			String payKey, String errorID, String errorMessage) {
		ChainedPaymentsDemo.resultTitle = "FAILURE";
		ChainedPaymentsDemo.resultInfo = errorMessage;
		ChainedPaymentsDemo.resultExtra = "Error ID: " + errorID + "\nCorrelation ID: "
				+ correlationID + "\nPay Key: " + payKey;
	}

	/**
	 * Notification that the payment was canceled.
	 * 
	 * @param paymentStatus		the status of the transaction
	 */
	public void onPaymentCanceled(String paymentStatus) {
		ChainedPaymentsDemo.resultTitle = "CANCELED";
		ChainedPaymentsDemo.resultInfo = "The transaction has been cancelled.";
		ChainedPaymentsDemo.resultExtra = "";
	}
}