function InstallEventHandler() {
    console.log("The extension was installed.");
    return true;
};

chrome.runtime.onInstalled.addListener(InstallEventHandler);