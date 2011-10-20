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