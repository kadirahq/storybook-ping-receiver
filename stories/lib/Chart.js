import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {composeWithPromise} from 'react-komposer';
import {Lokka} from 'lokka';
import HttpTransport from 'lokka-transport-http';

const client = new Lokka({
  transport: new HttpTransport(process.env.STORYBOOK_PING_API_URL)
});

const SimpleLineChart = ({data}) => {
  let lineComponent;

  if(data[0].count) {
    lineComponent = <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="url(#colorNu)" />;
  } else {
    lineComponent = [
        <Area key="tu" type="monotone" dataKey="totalUsers" stroke="#8884d8" fill="url(#colorTu)" />,
        <Area key="nu" type="monotone" dataKey="newUsers" stroke="#82ca9d" fill="url(#colorNu)" />,
        <Area key="cu" type="monotone" dataKey="churnedUsers" stroke="#A000A0" fill="url(#colorCu)" />,
        <Area key="ru" type="monotone" dataKey="returnedUsers" stroke="#00E0E0" fill="url(#colorRu)" /> ];
  }

  return (
      <AreaChart width={600} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <defs>
          <linearGradient id="colorTu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorNu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorCu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A000A0" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#A000A0" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorRu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00E0E0" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#00E0E0" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        {lineComponent}
      </AreaChart>
  );};

SimpleLineChart.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object)
};

const fetchResults = ({type, from, to}) => {
  const fromDate = new Date(from).getTime();
  const toDate = new Date(to).getTime();

  if(type == 'all') {
    return client.query(`
      {
        totalUsers(from: ${fromDate}, to: ${toDate}) {
          year
          month
          day
          count
        },
        newUsers(from: ${fromDate}, to: ${toDate}) {
          year
          month
          day
          count
        },
        churnedUsers(from: ${fromDate}, to: ${toDate}) {
          year
          month
          day
          count
        },
        returnedUsers(from: ${fromDate}, to: ${toDate}) {
          year
          month
          day
          count
        }
      }
    `)
      .then(results => {
        if (!results.totalUsers.length) {
          throw new Error('No Data. Check your from, to values');
        }
        let data =  results.totalUsers.map(({year, month, day, count}, i) => {
          return {
            date: `${year}/${month}/${day}`,
            totalUsers: count,
            newUsers: results.newUsers[i].count,
            churnedUsers: results.churnedUsers[i].count,
            returnedUsers: results.returnedUsers[i].count
          };
        });
        return {data: data.reverse()};
      });
  }
  return client.query(`
      {
        ${type}(from: ${fromDate}, to: ${toDate}) {
          year
          month
          day
          count
        }
      }
    `).then(results => {
      if (!results[type].length) {
        throw new Error('No Data. Check your from, to values');
      }
      let data =  results[type].map(({year, month, day, count}) => {
        return {
          date: `${year}/${month}/${day}`,
          count
        };
      });
      return {data: data.reverse()};
    });
};

const Chart = composeWithPromise(fetchResults)(SimpleLineChart);

export default Chart;
