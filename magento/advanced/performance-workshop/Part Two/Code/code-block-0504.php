<?php

class Example_Profiler_Model_Observer
{
	/**
	 * Log the profiler statistics into a file
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

			$f = fopen('var/log/profiler.log', 'a');
			foreach ($data as $row)
			{
				fwrite($f, implode(', ', $row) . "\n");
			}
			fclose($f);
		}
	}

	/**
	 * Return thr profiler timer data
	 *
	 * @return array
	 */
	protected function _getTimerData()
	{
		$timers = Varien_Profiler::getTimers();
		foreach ($timers as $name => $timer)
		{
			$sum = Varien_Profiler::fetch($name, 'sum');
			$count = Varien_Profiler::fetch($name, 'count');
			$emalloc = Varien_Profiler::fetch($name, 'emalloc');
			$realmem = Varien_Profiler::fetch($name, 'realmem');

			// Filter out entries of little relevance
			if ($sum < .0010 && $count < 10 && $emalloc < 10000)
			{
				continue;
			}
			$data[] = array($name, number_format($sum, 4), $count, number_format($emalloc), number_format($realmem));
		}
		return $data;
	}

	/**
	 * Return the table head data in an array
	 *
	 * @return array
	 */
	protected function _getTableHeadData()
	{
		$data = array();
		$data[] = array();
		$data[] = array('Request URI: ' . Mage::app()->getRequest()->getServer('REQUEST_URI'));
		$data[] = array('Request Date: ' . date('Y-m-d H:i:s'));
		$data[] = array('Memory usage: real: ' . memory_get_usage(true), 'emalloc: ' . memory_get_usage());
		$data[] = array();
		$data[] = array('Timer Name', 'Time', 'Count', 'Emalloc', 'RealMem');

		return $data;
	}
}
