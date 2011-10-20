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

