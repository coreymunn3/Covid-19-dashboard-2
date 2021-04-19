import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import './dataTable.css';

const DataTable = ({ tableData }) => {
  return (
    <div className='table'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell>Case Numbers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map(({ country, cases }) => (
            <TableRow key={country}>
              <TableCell>{country}</TableCell>
              <TableCell>{cases}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
