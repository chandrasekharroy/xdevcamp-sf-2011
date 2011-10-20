	/**
	 * Log the profiler statistics plus some information that helps identify the request
	 *
	 * @param Varien_Event_Observer $observer
	 * @return void
	 */
	public function controllerFrontSendResponseAfter(Varien_Event_Observer $observer)
	{
		// Only write to log if the profiler is enabled
		$timers = $this->_getTimerData();
		if ($timers)
		{
			$data = $this->_getTableHeadData();
			$data = array_merge($data, $timers);

			$out = $this->_getDataAsTextTable($data);
			$f = fopen('var/log/profiler.log', 'a');
			fwrite($f, $out);
			fclose($f);
		}
	}