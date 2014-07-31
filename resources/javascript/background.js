if ( typeof (myAppBgService) == typeof (undefined)) {
	myAppBgService = {};
}

// myAppBgService.getClickHandler = function (info, tab) {
function getClickHandler(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "saveScrapInfo"
        });
    });
};

chrome.contextMenus.create({
	"title" : "My Extension에 저장",
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : getClickHandler
}, null);

