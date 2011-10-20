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
				// Add code block 04-01 here
			}
		}
	}

	// Add code block 04-02 here

}
