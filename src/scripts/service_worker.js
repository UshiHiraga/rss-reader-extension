function handleInstallEvent() {
    console.log("The extension was installed.");
};

function handleMessageEvent(message, sender, sendResponse) {
    async function openPopup() {
        console.log("popup requested")
        console.log(message.data);

        // chrome.action.setBadgeBackgroundColor({ color: [0, 255, 0, 0] }, () => { },);
        chrome.action.openPopup();
        sendResponse(true); 
    }

    switch (message.code) {
        case "request-open-popup": openPopup(); break;
    };
};

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
chrome.runtime.onInstalled.addListener(handleInstallEvent);
chrome.runtime.onMessage.addListener(handleMessageEvent);