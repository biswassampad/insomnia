export const correctlyLaunched = async app => {
  await expect(app.browserWindow.isDevToolsOpened()).resolves.toBe(false);
  await expect(app.client.getWindowCount()).resolves.toBe(1);
  await expect(app.browserWindow.isMinimized()).resolves.toBe(false);
  await expect(app.browserWindow.isFocused()).resolves.toBe(true);
};

export const resetToOnboarding = async app => {
  await app.webContents.executeJavaScript("localStorage['insomnia::meta::activity'] = null;");
  await app.browserWindow.reload(); // reload for local storage clearing to take effect
};

export const resetToHome = async app => {
  await app.webContents.executeJavaScript("localStorage['insomnia::meta::activity'] = 'home';");
  await app.browserWindow.reload(); // reload for local storage clearing to take effect
};
