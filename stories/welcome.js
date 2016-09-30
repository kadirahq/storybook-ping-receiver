import React from 'react';
import ReactDOM from 'react-dom';
import { storiesOf } from '@kadira/storybook';
import marked from 'marked';
marked.setOptions({
  breaks: true,
});

const message = `
# Storybook Stats

Every time, you run \`npm run storybook\` command, we send a ping to a remote server. It's a pretty simple HTTP request sending following data:

  * A unique ID indicating user's machine (it's an UUID) 
  * NPM package version of React Storybook

## Why?

We need a way to understand the actual usage of React Storybook. We can't rely on the NPM installation count or GitHub stars. That's why we did something like this.This helps us to see the usage growth and act accordingly.

## Open Data and Code

We really don't need do anything evil with this tracking. We've opensourced everything including the dataset and code. Here are they:

  * Client side [tracking code](https://github.com/kadirahq/react-storybook/blob/master/src/server/track_usage.js).
  * Ping receiver [code](https://github.com/kadirahq/storybook-ping-receiver)
  * BigQuery [dataset](https://bigquery.cloud.google.com/dataset/kadira-storybooks:storybook_ping_data) (update in realtime)
  * [Stats](/?selectedKind=Stats&selectedStory=Total%20Users)

If you really don't wanna send any data, simply set \`--dont-track\` option when running storybook.

For more information, refer this [discussion](https://github.com/kadirahq/react-storybook/issues/474).
`;

class Content extends React.Component {
  constructor(...args) {
    super(...args);
    this._retryTime = 0;
  }

  chnageLinks() {
    const domNode = ReactDOM.findDOMNode(this);
    const links = domNode.querySelectorAll('a');

    for(let lc=0; lc<links.length; lc++) {
      const link = links[lc];
      const href = link.getAttribute('href');
      if (/http/.test(href)) {
        link.setAttribute('target', '_blank');
      } else {
        link.setAttribute('target', '_top');
      }
    }
  }

  componentDidMount() {
    this.chnageLinks();
  }

  componentDidUpdate() {
    this.chnageLinks();
  }

  render() {
    const { content } = this.props;
    return (
      <div
        className='content'
        dangerouslySetInnerHTML={{__html: marked(content)}}
      />
    );
  }
}

export default function () {
  return (<Content content={message}/>)
}
