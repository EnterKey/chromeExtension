function getClickHandler(userInfo) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "savePageInfo",
            "userInfo": {
              "email": userInfo.email,
              "name": userInfo.name,
              "picture": userInfo.picture
            }
        });
    });
};

chrome.contextMenus.create({
	"title" : "My Extension에 저장",
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : doOauth
}, null);

function onAuthorized() {
    var GET_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';


    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
          // Great success: parse response with JSON
          var userInfo = JSON.parse(xhr.responseText);
          getClickHandler(userInfo);
        } else {
          // Request failure: something bad happened
          console.log('get data failure');
        }
      }
    };

    xhr.open('GET', GET_USERINFO_URL, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + googleAuth.getAccessToken());

    xhr.send();
};

function doOauth() {
    googleAuth.authorize(onAuthorized);
}


var googleAuth = new OAuth2('google', {
  client_id: "994714572327-1rt0im4unhkai7brfp5mk904llu1kd3p.apps.googleusercontent.com",
  client_secret: "uA6A1WKOksw63OgKP-kYY29Q",
  api_scope: "https://www.googleapis.com/auth/userinfo.email"
});
