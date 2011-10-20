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
