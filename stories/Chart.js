import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {composeWithPromise} from 'react-komposer';
import {Lokka} from 'lokka';
import HttpTransport from 'lokka-transport-http-auth';

const client = new Lokka({
  transport: new HttpTransport("http://*************/")
});

const SimpleLineChart = ({data}) => {
  let lineComponent;

  if(data[0].count) {
    lineComponent = <Line type="monotone" dataKey="count" stroke="#82ca9d" />;
  } else {
    lineComponent = [
        <Line key="tu" type="monotone" dataKey="totalUsers" stroke="#720a9d" />,
        <Line key="nu" type="monotone" dataKey="newUsers" stroke="#825a9e" />,
        <Line key="cu" type="monotone" dataKey="churnedUsers" stroke="#92ca9f" />,
        <Line key="ru" type="monotone" dataKey="returnedUsers" stroke="#02fa90" /> ];
  }

  return (
      <LineChart width={600} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
      <XAxis dataKey="date"/>
      <YAxis/>
      <CartesianGrid strokeDasharray="3 3"/>
      <Tooltip/>
      <Legend />
      {lineComponent}
      </LineChart>
  );};

SimpleLineChart.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object)
};

const fetchResults = ({type}) => {
  if(type == 'all') {
    return client.query(`
      {
        totalUsers {
          year
          month
          day
          count
        },
        newUsers {
          year
          month
          day
          count
        },
        churnedUsers {
          year
          month
          day
          count
        },
        returnedUsers {
          year
          month
          day
          count
        }
      }
    `).then(results => {
      let data =  results.totalUsers.map(({year, month, day, count}, i) => {
        return {
          date: `${year}/${month}/${day}`,
          totalUsers: count,
          newUsers: results.newUsers[i].count,
          churnedUsers: results.churnedUsers[i].count,
          returnedUsers: results.returnedUsers[i].count
        };
      });
      return {data};
    });
  }
  return client.query(`
      {
        ${type} {
          year
          month
          day
          count
        }
      }
    `).then(results => {
      let data =  results[type].map(({year, month, day, count}) => {
        return {
          date: `${year}/${month}/${day}`,
          count
        };
      });
      return {data};
    });
};

const Chart = composeWithPromise(fetchResults)(SimpleLineChart);

export default Chart;
