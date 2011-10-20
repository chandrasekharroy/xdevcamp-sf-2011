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