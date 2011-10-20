<?php

class Example_Profiler_Model_Observer
{
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


	/**
	 * Return the passed in timers data array as a text table
	 *
	 * @param array $data
	 * @return string
	 */
	protected function _getDataAsTextTable(array $data)
	{
		// Dummy widths
		$table = new Zend_Text_Table(array('columnWidths' => array(1)));
		$widths = array();
		foreach ($data as $rowData)
		{
			$row = new Zend_Text_Table_Row();
			foreach ($rowData as $idx => $cell)
			{
				$width = mb_strlen($cell);
				if (!isset($widths[$idx]) || $widths[$idx] < $width)
				{
					$widths[$idx] = $width;
				}
				$row->appendColumn(new Zend_Text_Table_Column(strval($cell)));
			}
			$table->appendRow($row);
		}
		$table->setColumnWidths($widths);

		return $table->render();
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
		usort($data, array($this, '_sortTimers'));
		return $data;
	}

	/**
	 * Method to compare timer array entries by timer sum to sort descending
	 *
	 * @param array $a
	 * @param array $b
	 * @return int
	 */
	protected function _sortTimers(array $a, array $b)
	{
		if ($a[1] === $b[1])
		{
			return 0;
		}
		return $a[1] < $b[1] ? 1 : -1;
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
