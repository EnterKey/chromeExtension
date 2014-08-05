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
    "onclick" : ooauth
}, null);

function oauth_callback(res, xhr) {
    console.log('get userInfo data');
    console.log(res, xhr);
    getClickHandler();
}

function onAuthorized() {

    var url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    var request = {
      'parameters' : {
        'alt' : 'json'
      }
    };

    oauth.sendSignedRequest(url, oauth_callback, request);
};

function ooauth() {
    oauth.authorize(onAuthorized);
}

var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url':  "https://www.google.com/accounts/OAuthGetRequestToken",
  'authorize_url': "https://www.google.com/accounts/OAuthAuthorizeToken",
  'access_url': "https://www.google.com/accounts/OAuthGetAccessToken",
  'consumer_key': "994714572327-7vm56ecmedqdgeelem26ci9vu6ji76hg.apps.googleusercontent.com",
  'consumer_secret': "30Ujwwh_R5AO2hopwolneBs5",
  'scope': "https://www.googleapis.com/auth/userinfo.email",
  'app_name': "Project Default Service Account"
});


