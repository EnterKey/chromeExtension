if ( typeof (myAppMainService) == typeof (undefined)) {
	myAppMainService = {};
}

myAppMainService = {
	ajaxRequestData : {
		scrapInfoSaveRequestURL : 'http://115.71.233.172:4000/ajax/insert_pageEntry'
	},
	datas : {
		userInfo : {
			email : null,
			name : null,
			picture : null
		},
		scrapInfo : {
			url : null,
			title : null,
			content : null
		}
	}
};

myAppMainService.getScrapedTargetInfo = function(url, title, srcElement) {
	if (this.isFacebook(url)) {
		// facebook 인 경우, facebook은 userContent
		if (this.isFacebookPersonalPage(url)) {
			var userContent = document.getElementsByClassName("userContent");
			userContent = userContent[0].innerText;

			console.log(userContent);
			this.setScrapInfo(url, title, userContent);
		} else {
			// 현재 저장하려는 자료의 최상위 Element를 얻음
			var userContentWrapper = myAppMainService.findParentClass(srcElement);

			if (userContentWrapper != null) {
				var userContent = userContentWrapper.getElementsByClassName('userContent'), 
				userContentLink = userContentWrapper.getElementsByClassName('_5pcq'), 
				href = userContentLink[0].href, 
				innerText = userContent[0].innerText;
	
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

myAppMainService.isFacebook = function(url) {
	return url.indexOf("https://www.facebook.com") >= 0 ? true : false;
};

myAppMainService.isFacebookPersonalPage = function(url) {
	return (url.indexOf('/posts/') != -1 || url.indexOf('/permalink/') != -1) ? true : false;
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
	this.datas.scrapInfo.url = url;
	this.datas.scrapInfo.title = title;
	this.datas.scrapInfo.content = content;
};

document.addEventListener('mousemove', function(e) {
	var srcElement = e.srcElement, 
		url = document.URL, 
		title = document.title;

	myAppMainService.getScrapedTargetInfo(url, title, srcElement);
}, false);

chrome.extension.onMessage.addListener(function(message, sender, callback) {
	if (message.functiontoInvoke == "saveScrapInfo") {
		myAppMainService.saveScrapInfo(message.userInfo);
	} else if (message.functiontoInvoke == "loadScrapInfo") {
		myAppMainService.loadScrapInfo();
	}
});

myAppMainService.saveScrapInfo = function(userInfo) {
	var url = this.datas.scrapInfo.url;
	
	if (url != null) {
		myAppMainService.datas.userInfo = userInfo;
		
		$.post(myAppMainService.ajaxRequestData.scrapInfoSaveRequestURL, myAppMainService.datas, function(result) {
			if (result.status) {
				console.log('save success');
				myAppMainService.scrapInfoSaveRequestResult.success();
			} else {
				console.log('save error');
				myAppMainService.scrapInfoSaveRequestResult.fail();
			}
		});
	}
};

myAppMainService.scrapInfoSaveRequestResult = {};
myAppMainService.scrapInfoSaveRequestResult.success = function() {
	var scrapInfoSaveRequestResultMsg = '페이지 정보를 저장했습니다.';
	this.showMessage(scrapInfoSaveRequestResultMsg);
};
myAppMainService.scrapInfoSaveRequestResult.fail = function() {
	var scrapInfoSaveRequestResultMsg = '페이지 정보 저장에 실패했습니다.';
	this.showMessage(scrapInfoSaveRequestResultMsg);
};
myAppMainService.scrapInfoSaveRequestResult.showMessage = function(scrapInfoSaveRequestResultMsg) {
    var bubbleDOM = $('<div>');
	bubbleDOM.addClass('wrapper_body');
	$('body').append(bubbleDOM);
	
	var bubbleDOMXPosition = document.body.clientWidth * 75 / 100; // 사용자가 보고있는 브라우저 창의 가로
	var bubbleDOMYPosition = document.body.clientHeight * 2 / 100 + $(document).scrollTop(); // 사용자가 보고있는 브라우저 창의 세로
	
	var temp = document.body.clientWidth - bubbleDOMXPosition;
	temp = 300 - temp > 0 ? 330 - temp : 0;
	bubbleDOMXPosition -= temp;
	
	var content = "<div class='cbm_wrap'>"
					+ "<span class='vert-flag noise '>★★★ </span>"
	     			+ "<h1>Sample Box</h1>"
	     			+ "<img src='http://www.wpthemegenerator.com/wp-content/uploads/2012/06/Image.jpg'>"
	     			+ "<p>" + scrapInfoSaveRequestResultMsg + "</p>"
	     			+ "<br />"
	     			+ "<a href='http://www.enterkey.kr/'>EnterKey.kr</a>"
				+ "</div>";
					
	bubbleDOM.append(content);
    bubbleDOM.css('top', bubbleDOMYPosition + 'px');
    bubbleDOM.css('left', bubbleDOMXPosition + 'px');
    bubbleDOM.css('zIndex', 1000);
    bubbleDOM.css('visibility', 'visible');
    
    setTimeout(function() {
    	bubbleDOM.fadeOut('slow');
    	$('body').remove('.selection_bubble');
    }, 3000);
};

myAppMainService.loadScrapInfo = function() {
	console.log("loadScrapInfo");
};