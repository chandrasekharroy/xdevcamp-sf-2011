	protected function _construct()
	{
		$this->setCacheLifetime(false);
		$this->setCacheTags(array(
			Mage_Catalog_Model_Category::CACHE_TAG,
			Mage_Catalog_Model_Product::CACHE_TAG,
			Example_Brand_Model_Brand::CACHE_TAG
		));
		parent::_construct();
	}