function InstallEventHandler() { console.log("The extension was installed.") }
chrome.runtime.onInstalled.addListener(InstallEventHandler);