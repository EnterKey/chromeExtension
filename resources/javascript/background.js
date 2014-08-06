function getClickHandler(userInfo) {
    console.log(userInfo);
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "saveScrapInfo",
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

function oauth_callback(event) {
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
}

function onAuthorized() {

  console.log('auth success');
    var GET_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

    xhr.onreadystatechange = oauth_callback;

    xhr.open('GET', GET_USERINFO_URL, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + googleAuth.getAccessToken());

    xhr.send();
};

function doOauth() {
    googleAuth.authorize(onAuthorized);
}


var xhr = new XMLHttpRequest();

var googleAuth = new OAuth2('google', {
  client_id: "994714572327-7vm56ecmedqdgeelem26ci9vu6ji76hg.apps.googleusercontent.com",
  client_secret: "30Ujwwh_R5AO2hopwolneBs5",
  api_scope: "https://www.googleapis.com/auth/userinfo.email"
});