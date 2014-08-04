var auth = {

}

auth.firstRequest = function(){
	// chrome.extension.sendRequest({redirect: "http://redirect"});

	var requestTemplate = "https://accounts.google.com/o/oauth2/auth?redirect_uri={redirect_uri}&response_type={response_type}&client_id={client_id}&scope={scope}&approval_prompt=force&access_type=offline"
	var queryString = "";
	var redirect_uri = "https://www.example.com/oauth2callback";
	var response_type = "code";
	var client_id = "994714572327-7vm56ecmedqdgeelem26ci9vu6ji76hg.apps.googleusercontent.com";
	var scope = "https://www.googleapis.com/auth/userinfo.email";

	// queryString = requestTemplate.replace('{redirect_uri}', redirect_uri).replace('{response_type}',response_type).replace('{client_id}',client_id).replace('{scope}',scope);

	// console.log(queryString);
	googleAuth.authorize(function(){

	});
}