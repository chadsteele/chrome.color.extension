// content.js


//selector notes...

//google, etc.  "body"
//youtube ytd-watch-flexy
//docs.google.com .kix-appview-editor-container
//slack  [role=presentation]

const config = {
    storagekey: "coloring.ai.enabled",
    enabled: true,
    backgroundColor: "inherit",
    selector: ".coloring-ai-background, [role=presentation], ytd-watch-flexy, .kix-appview-editor-container, body"  // body should be last in the list
}

// first time
config.enabled = !(window.localStorage.getItem(config.storagekey) === "false");
chrome.runtime.sendMessage({ "message": "coloring.ai.enabled", "enabled": config.enabled });
config.backgroundColor = $(config.selector).first().css('background-color');


//on focus (re-entry), just in case another tab in the same domain enabled/disabled
$(window).on("ready focus click", function () {  // not on blur, on focus
    config.enabled = !(window.localStorage.getItem(config.storagekey) === "false");
    if (!config.enabled) $(config.selector).css('background-color', config.backgroundColor);
    chrome.runtime.sendMessage({ "message": "coloring.ai.enabled", "enabled": config.enabled });
});



// listen for background.js messages
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // user clicked icon, store "enabled" in localStorage
        if (request.message === "clicked_browser_action") {
            config.enabled = !config.enabled;
            window.localStorage.setItem(config.storagekey, config.enabled);
            if (!config.enabled) $(config.selector).css('background-color', config.backgroundColor);
            chrome.runtime.sendMessage({ "message": "coloring.ai.enabled", "enabled": config.enabled });
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // new color messsage, ignore if disabled on this page
        config.enabled = !(window.localStorage.getItem(config.storagekey) === "false");
        if (config.enabled && request.message === "coloring.ai.rgb") {
            var rgb = request.rgb;
            rgb = `rgb( ${rgb.red}, ${rgb.green}, ${rgb.blue})`;
            console.log('coloring.ai ' + rgb);
            $(config.selector).css('background-color', rgb);
        }
    }
);






