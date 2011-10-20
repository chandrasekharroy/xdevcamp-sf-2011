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