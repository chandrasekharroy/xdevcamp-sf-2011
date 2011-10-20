<?php

/* Include manually because controller classes names don't match the file system ("controllers") */
require_once 'Mage/Checkout/controllers/OnepageController.php';

/**
 * Modify the standard onepage checkout to skip the shipping
 * method step if only one shipping method is available.
 */
class Example_Checkout_OnepageController extends Mage_Checkout_OnepageController
{
}

