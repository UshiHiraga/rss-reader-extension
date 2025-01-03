function handleInstallEvent() {
    console.log("The extension was installed.");
    chrome.contextMenus.create({id: "look-for", title: "Look for npm"});
};

function handleMessageEvent(message, sender, sendResponse) {
    async function openPopup() {
        console.log("popup requested")
        console.log(message.data);

        // chrome.action.setBadgeBackgroundColor({ color: [0, 255, 0, 0] }, () => { },);
        //chrome.action.openPopup();
        sendResponse(true); 
    }

    switch (message.code) {
        case "request-open-popup": openPopup(); break;
    };
};

function handleClickEvent(info, tab){
    console.log(info, tab);
    chrome.sidePanel.setOptions({path: "src/views/popup.html", tabId: tab.id});
    chrome.sidePanel.open({tabId: tab.id});
}

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
chrome.runtime.onInstalled.addListener(handleInstallEvent);
chrome.runtime.onMessage.addListener(handleMessageEvent);
chrome.contextMenus.onClicked.addListener(handleClickEvent);