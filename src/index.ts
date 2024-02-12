import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IStatusBar } from '@jupyterlab/statusbar';
import { Poll } from '@lumino/polling';
import { Widget } from '@lumino/widgets';

import { requestAPI } from './handler';

function bytesToSize(value: string): string {
  const bytes = parseInt(value);
  const sizes = ['Bytes', 'Ki', 'Mi', 'Gi', 'Ti'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

function percentToColor(value: string): string {
  let percentage = parseFloat(value);

  // Ensure the percentage is within the range 80-100
  percentage = Math.min(Math.max(percentage, 80), 100);

  // Calculate hue based on the percentage (from yellow to red)
  const hue = (1 - (percentage - 80) / 20) * 60;

  return `hsl(${hue},1,0.5)`;
}

/**
 * Initialization data for the disk-usage extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'disk-usage:plugin',
  description: 'A JupyterLab extension to monitor disk usage.',
  autoStart: true,
  optional: [IStatusBar],
  activate: (app: JupyterFrontEnd, statusBar: IStatusBar | null) => {
    console.log('JupyterLab extension disk-usage is activated!');

    if (statusBar) {
      const duWidget = new Widget();

      statusBar.registerStatusItem(plugin.id, {
        item: duWidget,
        align: 'left'
      });
      new Poll({
        auto: true,
        factory: () =>
          requestAPI<any>('get')
            .then(data => {
              duWidget.node.innerHTML = `<span style="background-color:${percentToColor(data.disk_percentage)};" class="jp-StatusBar-TextItem">Disk: ${data.disk_percentage}% [${bytesToSize(data.disk_used)}/${bytesToSize(data.disk_total)}]</span>`;
            })
            .catch(reason => {
              console.error(
                `The disk_usage server extension appears to be missing.\n${reason}`
              );
            }),
        frequency: {
          interval: 5 * 1000,
          backoff: true
        },
        name: 'disk-usage-poll',
        standby: 'when-hidden'
      });
    }
  }
};

export default plugin;
