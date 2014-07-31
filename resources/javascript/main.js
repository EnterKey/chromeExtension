if ( typeof (myAppMainService) == typeof (undefined)) {
	myAppMainService = {};
}

myAppMainService = {
	MOUSE_VISITED_CLASSNAME : 'crx_mouse_visited',
	prevDOM : null,
	userKey : 'TempUserKey',
	scrapInfo : {
		url 	: null,
		title 	: null,
		content : null 
	}
};

myAppMainService.getScrapedTargetInfo = function(url, title, srcElement) {
	if (url.indexOf("https://www.facebook.com") != -1) {// 처음 방문한 페이지 인 경우
		// facebook 인 경우, facebook은 userContent
		if ((url.indexOf('/posts/') != -1 || url.indexOf('/permalink/') != -1)) {
			var userContent = document.getElementsByClassName("userContent");
			userContent = userContent[0].innerText;

			console.log(userContent);
			this.setScrapInfo(url, title, userContent);
		} else {
			var userContentWrapper = myAppMainService.findParentClass(srcElement);

			if (userContentWrapper != null) {
				var userContent 		= userContentWrapper.getElementsByClassName('userContent'), 
					userContentLink 	= userContentWrapper.getElementsByClassName('_5pcq'), 
					href 				= userContentLink[0].href, 
					innerText  			= userContent[0].innerText;

				console.log(href);
				console.log(innerText);
				this.setScrapInfo(href, title, innerText);
			}
		}
	} else {
		// facebook이 아닌 경우
		console.log(srcElement.innerText);
		this.setScrapInfo(url, title, srcElement.innerText);
	}
};

myAppMainService.findParentClass = function(el) {
	while (el.parentNode) {
		el = el.parentNode;
		if (el.className.indexOf('userContentWrapper') != -1)
			return el;
	}
	return null;
};

myAppMainService.setScrapInfo = function(url, title, content) {
	this.scrapInfo.url 		= url;
	this.scrapInfo.title 	= title;
	this.scrapInfo.content	 = content;
};

myAppMainService.highlightSelectedDiv = function(srcElement) {
	if (srcElement.nodeName == 'DIV') {
		if (myAppMainService.prevDOM != null) {
			myAppMainService.prevDOM.classList.remove(myAppMainService.MOUSE_VISITED_CLASSNAME);
		}

		srcElement.classList.add(myAppMainService.MOUSE_VISITED_CLASSNAME);
		myAppMainService.prevDOM = srcElement;
	}
};


document.addEventListener('mousemove', function(e) {
	var srcElement 	= e.srcElement, 
		url 		= document.URL,
		title		= document.title;
		
	myAppMainService.getScrapedTargetInfo(url, title, srcElement);
	myAppMainService.highlightSelectedDiv(srcElement);
}, false);
 
chrome.extension.onMessage.addListener(function(message, sender, callback) {
	if (message.functiontoInvoke == "saveScrapInfo") {
		myAppMainService.saveScrapInfo();
		
	} else if (message.functiontoInvoke == "loadScrapInfo") {
		myAppMainService.loadScrapInfo();
	}
});

myAppMainService.saveScrapInfo = function() {
	
	// var	url 			= this.scrapInfo.url, 
		// scrapInfo = JSON.parse(window.localStorage.getItem(url));
// 		
	// if (scrapInfo == null) {
	    // scrapInfo 			= {};
	    // scrapInfo.url 			= url;
	    // scrapInfo.title 		= this.scrapInfo.title,
	    // scrapInfo.content 		= this.scrapInfo.content,
// 		
		// window.localStorage.setItem(scrapInfo.url, JSON.stringify(scrapInfo));
		// var result = JSON.parse(window.localStorage.getItem(scrapInfo.url));
		// console.log("saveScrapInfo");
		// console.dir(result);
	// }	
	
	var	url 					 = this.scrapInfo.url; 
	var scrapInfoSaveRequestURL  = 'http://localhost:4000/ajax/insert_pageEntry'; 
	var scrapInfoSaveRequestData = {
		userKey : null,
		pageInfo : {
			url : null,
			title : null,
			content : null
		}
	};
	
	if(url != null) {
		scrapInfoSaveRequestData.userKey 			= myAppMainService.userKey;
		scrapInfoSaveRequestData.pageInfo.title 	= myAppMainService.scrapInfo.title;
		scrapInfoSaveRequestData.pageInfo.url 		= myAppMainService.scrapInfo.url;
		scrapInfoSaveRequestData.pageInfo.content 	= myAppMainService.scrapInfo.content;
		
		$.post(scrapInfoSaveRequestURL, scrapInfoSaveRequestData, function(result){
			if (result.status) {
				console.log('save success');		
			} else {
				console.log('save error');
			}
		});
	}
};

myAppMainService.loadScrapInfo = function() {
	console.log("loadScrapInfo");
};