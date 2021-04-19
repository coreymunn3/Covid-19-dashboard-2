import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';

const SummaryBox = ({ title, todayStat, totalStat }) => {
  return (
    <Card className='summaryBox'>
      <CardContent>
        <Typography variant='h6' color='textSecondary'>
          {title}
        </Typography>
        <Typography variant='h5'>{todayStat}</Typography>
        <Typography variant='h6' color='textSecondary'>
          {totalStat}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryBox;
