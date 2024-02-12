import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the disk-usage extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'disk-usage:plugin',
  description: 'A JupyterLab extension to monitor disk usage.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension disk-usage is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The disk_usage server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
