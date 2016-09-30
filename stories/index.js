import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import {withKnobs, date} from '@kadira/storybook-addon-knobs';
import Chart from './Chart';
import './styles.css';

const stories = storiesOf('Chart', module);
stories.addDecorator(withKnobs);
stories.addDecorator((story) => (
  <div className='stat-chart'>{story()}</div>
));

let to = new Date();
let from = new Date(new Date() - 1000 * 60 * 60 * 24 * 7);

stories.add('Total Users', () => {
  return <Chart type='totalUsers' from={date('From', from)} to={date('To', to)}/>;
  })
  .add('New Users', () => {
    return <Chart type='newUsers' from={date('From', from)} to={date('To', to)}/>;
  })
  .add('Churned Users', () => {
    return <Chart type='churnedUsers' from={date('From', from)} to={date('To', to)}/>;
  })
  .add('Returned Users', () => {
    return <Chart type='returnedUsers' from={date('From', from)} to={date('To', to)}/>;
  })
  .add('All', () => {
    return <Chart type='all' from={date('From', from)} to={date('To', to)}/>;
  });
