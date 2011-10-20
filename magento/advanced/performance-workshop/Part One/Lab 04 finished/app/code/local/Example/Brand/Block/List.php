<?php

class Example_Brand_Block_List extends Mage_Core_Block_Template
{
	/**
	 * Refresh the cache records when one of these entity records is updated.
	 * 
	 * @var array
	 */
	protected $_cacheTags = array(
		Mage_Catalog_Model_Category::CACHE_TAG,
		Mage_Catalog_Model_Product::CACHE_TAG,
		Example_Brand_Model_Brand::CACHE_TAG
	);

	/**
	 * Initialize the block caching
	 * 
	 * @return void
	 */
	protected function _construct()
	{
		/* Option Two: block caching
		 *
		 * If the lifetime is set to false the cache never expires.
		 * If the lifetime is set to null the block is not cached (default).
		 * If the lifetime is set to an int it specifies the number of seconds the block is cached.
		 */
		$this->setCacheLifetime(false);
		/*
		 * Setting the cache tags is only required if you have special needs like in this example module.
		 * To enable block caching it is enough to set the cache lifetime to a value other then null.
		 * The block always is part of the BLOCK_HTML cache tag section.
		 */
		$this->setCacheTags($this->_cacheTags);
		parent::_construct();
	}

	/**
	 * Return the brand collection for use in the template
	 * 
	 * @return Example_Brand_Model_Resource_Brand_Collection|mixed|Object
	 */
	public function getBrands()
	{
		$brands = $this->getData('brands');
		if (is_null($brands))
		{
			/* @var $brands Example_Brand_Model_Resource_Brand_Collection */
			$brands = Mage::getResourceModel('example_brand/brand_collection');
			$this->_prepareBrandCollection($brands, 50);
			$this->setBrands($brands);
		}
		return $brands;
	}

	/**
	 * Add all filters and options to the brand collection.
	 * Also initialize the collection cache.
	 * 
	 * @param Example_Brand_Model_Resource_Brand_Collection $brands
	 * @param int $limit
	 * @return Example_Brand_Block_List
	 */
	protected function _prepareBrandCollection(Example_Brand_Model_Resource_Brand_Collection $brands, $limit)
	{
		/* Option One: collection caching */
		//$brands->initCache(Mage::app()->getCache(), 'brandlist', $this->_cacheTags);
		
		$brands->addCategories()
			->addAssociatedWithCategoryFilter()
			->addAssociateWithSpecialPriceProductFilter()
			->addCategoryProductCount()
			->setRandomOrder()
			->setPageSize($limit);

		return $this;
	}
}
