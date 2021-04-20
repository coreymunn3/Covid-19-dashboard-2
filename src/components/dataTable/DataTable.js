import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import numeral from 'numeral';
import './dataTable.css';
import { sortCountriesByMeasure } from '../../utils/sort';

const DataTable = ({ tableData, activeMeasure }) => {
  const [sortedData, setSortedData] = useState(tableData);
  useEffect(() => {
    setSortedData(sortCountriesByMeasure(tableData, activeMeasure));
  }, [activeMeasure, tableData]);
  return (
    <div className='table'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell>{activeMeasure}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((country) => (
            <TableRow key={country.country}>
              <TableCell>{country.country}</TableCell>
              <TableCell>
                {numeral(country[activeMeasure]).format('0,0')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
