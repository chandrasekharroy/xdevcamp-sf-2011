<?php

/* Include manually because controller classes names don't match the file system ("controllers") */
require_once 'Mage/Checkout/controllers/OnepageController.php';

/**
 * Modify the standard onepage checkout to skip the shipping
 * method step if only one shipping method is available.
 */
class Example_Checkout_OnepageController extends Mage_Checkout_OnepageController
{
	/**
	 * Hook to add the new logic provided by _checkSkipShippingMethod()
	 *
	 * @return void
	 */
	public function saveBillingAction()
	{
		parent::saveBillingAction();
		$this->_checkSkipShippingMethod();
	}

	/**
	 * Hook to add the new logic provided by _checkSkipShippingMethod()
	 *
	 * @return void
	 */
	public function saveShippingAction()
	{
		parent::saveShippingAction();
		$this->_checkSkipShippingMethod();
	}
	
	/**
	 * If the next step is the shipping method section and only one method
	 * is available, select that method and fast forward to the payment section.
	 *
	 * @return void
	 */
	protected function _checkSkipShippingMethod()
	{
		/* @var $helper Mage_Core_Helper_Data */
		$helper = Mage::helper('core');

		/*
		 * Check the session hasn't expired
		 */
		$body = $this->getResponse()->getBody();
		if ($body)
		{
			/*
			 * Check if the next step is the shipping method section and if
			 * only one shipping method is available
			 */
			$result = $helper->jsonDecode($this->getResponse()->getBody());
			if (array_key_exists('goto_section', (array)$result)
				&& 'shipping_method' === $result['goto_section']
			)
			{
				/* @var $onepage Mage_Checkout_Model_Type_Onepage */
				$onepage = $this->getOnepage();
				$shippingMethods = $this->_getAvailableShippingMethods($onepage);

				if (count($shippingMethods) === 1)
				{
					/* Since we are changing data used during the calculation of the totals... */
					$onepage->getQuote()->setTotalsCollectedFlag(false);

					/* Select the only available shipping method */
					$onepage->saveShippingMethod($shippingMethods[0]);

					/* reset the cache ID because a different layout handle will be used */
					$this->getLayout()->getUpdate()->setCacheId(null);

					/* Build a new JSON response */
					$result['goto_section'] = 'payment';
					$result['update_section'] = array(
						'name' => 'payment-method',
						'html' => $this->_getPaymentMethodsHtml()
					);
					$result['allow_sections'] = array('shipping', 'shipping_method');

					$onepage->getCheckout()
						->setStepData('shipping_method', 'complete', true);

					$this->getResponse()->setBody(
						$helper->jsonEncode($result)
					);
				}
			}
		}
	}

	/**
	 * Collect all available shipping method codes in an array
	 *
	 * @param Mage_Checkout_Model_Type_Onepage $onepage
	 * @return array
	 */
	protected function _getAvailableShippingMethods(Mage_Checkout_Model_Type_Onepage $onepage)
	{
		/* @see Mage_Checkout_Block_Onepage_Shipping_Method_Available */
		/* @var $address Mage_Sales_Model_Quote_Address */
		$address = $onepage->getQuote()->getShippingAddress();
		$methods = array();
		foreach ($address->getGroupedAllShippingRates() as $carrier)
		{
			/* @var $rate Mage_Sales_Model_Quote_Address_Rate */
			foreach ($carrier as $rate)
			{
				$methods[] = $rate->getCode();
			}
		}
		return $methods;
	}
}
