// background.js


// send a message to the active tab only
function sendMessageToActiveTab(data) {
    if (!data) return;
    if (!data.message) data = { message: data };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, data);
    });
}

// send the same message to all chrome tabs
function sendMessageToAll(data) {
    if (!data) return;
    if (!data.message) data = { message: data };

    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, data);
        }
    });
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
    sendMessageToActiveTab("clicked_browser_action");
});


// update enabled/disabled icon
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "coloring.ai.enabled") {
            //request.enabled
            //https://stackoverflow.com/questions/8894461/updating-an-extension-button-dynamically-inspiration-required

            //alert('coloring.ai ' + (request.enabled ? 'enabled' : 'disabled'));

            chrome.browserAction.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
            chrome.browserAction.setBadgeText({ text: request.enabled ? '' : 'OFF' });
        }
    }
);

// broadcast new colors
chrome.alarms.create("new-color", { periodInMinutes: 5 / 60 });  //1 sec in debug, 1 min in production
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (!alarm) return;
    if (alarm.name === "new-color") {
        sendMessageToAll({ message: "coloring.ai.rgb", rgb: getColorFromBPM() });
    }
})

