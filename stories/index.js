import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import { withKnobs, date, select } from '@kadira/storybook-addon-knobs';
import Chart from './Chart';
import './styles.css';

const stories = storiesOf('Chart', module);
stories.addDecorator(withKnobs);
stories.addDecorator((story) => (
  <div className='stat-chart'>{story()}</div>
));

let toDate = new Date();
let fromDate = new Date(new Date() - 1000 * 60 * 60 * 24 * 7);

function getDateRange() {
  const range = select('Range', {
    'week': 'Last 7 days',
    'month': 'Last Month',
    'custom': 'Custom',
  }, 'week');

  let from, to;

  switch (range) {
    case 'week':
      to = toDate;
      from = new Date(new Date() - 1000 * 60 * 60 * 24 * 7)
      break;
    case 'month':
      to = toDate;
      from = new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
      break;
    default:
      from = date('From', fromDate);
      to = date('To', toDate);
  }

  return {from, to};
}

stories.add('Total Users', () => {
  const range = getDateRange();
  return <Chart type='totalUsers' from={range.from} to={range.to}/>;
});

stories.add('New Users', () => {
  const range = getDateRange();
  return <Chart type='newUsers' from={range.from} to={range.to}/>;
});

stories.add('Churned Users', () => {
  const range = getDateRange();
  return <Chart type='churnedUsers' from={range.from} to={range.to}/>;
});

stories.add('Returned Users', () => {
  const range = getDateRange();
  return <Chart type='returnedUsers' from={range.from} to={range.to}/>;
});

stories.add('All', () => {
  const range = getDateRange();
  return <Chart type='all' from={range.from} to={range.to}/>;
});
