import { clickTabByText } from './tabs';
import { mapAccelerator } from 'spectron-keys';
import * as modal from './modal';

export const openWithKeyboardShortcut = async app => {
  await app.client.keys(mapAccelerator('CommandOrControl+,'));

  await modal.waitUntilOpened(app, { modalName: 'SettingsModal' });
};

export const closeModal = async app => {
  await modal.close(app, 'SettingsModal');
};

export const goToPlugins = async app => {
  // Click on the plugins tab
  await app.client.react$('SettingsModal').then(e => clickTabByText(e, 'Plugins'));

  // Wait for the plugins component to show
  await app.client.react$('Plugins').then(e => e.waitForDisplayed());
  // await app.client.pause(100);
};

export const installPlugin = async (app, pluginName) => {
  const plugins = await app.client.react$('SettingsModal').then(e => e.react$('Plugins'));

  // Find text input and install button
  const inputField = await plugins.$('form input[placeholder="npm-package-name"]');

  // Click and wait for focus
  await inputField.waitForEnabled();
  await inputField.click();
  await inputField.waitUntil(() => inputField.isFocused());

  // Type plugin name
  await app.client.keys(pluginName);

  // Click install
  const installButton = await plugins.$('button=Install Plugin');
  await installButton.click();

  // Button and field should disable
  await plugins.waitUntil(async () => {
    const buttonEnabled = await inputField.isEnabled();
    const fieldEnabled = await installButton.isEnabled();

    return !buttonEnabled && !fieldEnabled;
  });

  // Spinner should show
  await installButton.$('i.fa.fa-refresh.fa-spin').then(e => e.waitForDisplayed());

  // Button and field should re-enable
  await plugins.waitUntil(async () => {
    const buttonEnabled = await inputField.isEnabled();
    const fieldEnabled = await installButton.isEnabled();

    return buttonEnabled && fieldEnabled;
  }, 10000); // Wait 10 seconds because this can be a slow install

  // Plugin entry should exist in the table in the first row and second column
  await app.client.waitUntilTextExists('table tr:nth-of-type(1) td:nth-of-type(2)', pluginName);
};
