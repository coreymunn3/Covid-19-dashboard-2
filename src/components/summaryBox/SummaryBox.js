import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import numeral from 'numeral';
import './summaryBox.css';

const SummaryBox = ({ title, todayStat, totalStat, isActive, ...props }) => {
  const generateColorClass = (title) => {
    if (title === 'Cases') {
      return 'summaryBox__cases';
    }
    if (title === 'Recovered') {
      return 'summaryBox__recovered';
    }
    if (title === 'Deaths') {
      return 'summaryBox__deaths';
    }
  };
  return (
    <Card
      className={`summaryBox ${
        isActive && 'summaryBox--selected'
      } ${generateColorClass(title)}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography variant='body1' className='summaryBox__title'>
          {title}
        </Typography>
        <Typography variant='h5' className={generateColorClass(title)}>
          <strong>{numeral(todayStat).format('0,0')}</strong>
        </Typography>
        <Typography variant='body1' className='summaryBox__total'>
          {numeral(totalStat).format('0,0.0 a')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryBox;
