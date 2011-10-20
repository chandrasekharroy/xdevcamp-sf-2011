		$brands->initCache(Mage::app()->getCache(), 'brandlist', array(
			Mage_Catalog_Model_Category::CACHE_TAG,
			Mage_Catalog_Model_Product::CACHE_TAG
		));