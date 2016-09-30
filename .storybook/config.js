import { configure, addDecorator } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

addDecorator(centered);

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
