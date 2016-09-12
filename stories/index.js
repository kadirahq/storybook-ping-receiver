import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import {withKnobs, text, boolean, number} from '@kadira/storybook-addon-knobs';
import Chart from './Chart';

const stories = storiesOf('Chart', module);
stories.addDecorator(withKnobs);

let to = new Date();
let from = new Date(new Date() - 1000 * 60 * 60 * 24 * 7);

stories.add('Total Users', () => {
  return <Chart type='totalUsers' from={text('From', from)} to={text('To', to)}/>;
  })
  .add('New Users', () => {
    return <Chart type='newUsers' from={text('From', from)} to={text('To', to)}/>;
  })
  .add('Churned Users', () => {
    return <Chart type='churnedUsers' from={text('From', from)} to={text('To', to)}/>;
  })
  .add('Returned Users', () => {
    return <Chart type='returnedUsers' from={text('From', from)} to={text('To', to)}/>;
  })
  .add('All', () => {
    return <Chart type='all' from={text('From', from)} to={text('To', to)}/>;
  });
