chrome.browserAction.onClicked.addListener(onOffExtension);

var isActiveExtension = false;

function onOffExtension() {
	isActiveExtension = !isActiveExtension;

	chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "onOffExtension",
            "onOffFlag": isActiveExtension
        });
    });	
}

function getClickHandler(userInfo) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "savePageInfo",
            "userInfo": {
              "email": null,
              "name": null,
              "picture": null
            }
        });
    });
};

chrome.contextMenus.create({
	"title" : "Note Hub에 저장",
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : doOauth
}, null);

function onAuthorized() {
  var GET_AUTHORIZED_URL = request_origin+'/';
  chrome.tabs.create({url:GET_AUTHORIZED_URL});
};

function doOauth() {
  var POST_CHECKAUTH_URL = request_origin+'/ajax/auth/extension/google';
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(event) {
    if (xhr.readyState == 4) {
      if(xhr.status == 200) {
        // Great success: parse response with JSON
        var response = JSON.parse(xhr.responseText);
        if(response && response.status){
          getClickHandler();
        }else{
          onAuthorized();
        }
      } else {
        // Request failure: something bad happened
        console.log('post checksession failure');
      }
    }
  };

  xhr.open('POST', POST_CHECKAUTH_URL, true);

  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.send();
};


var request_origin = "http://localhost:4000";