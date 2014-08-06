if ( typeof (myAppMainService) == typeof (undefined)) {
	myAppMainService = {};
}

myAppMainService = {
	MOUSE_VISITED_CLASSNAME : 'crx_mouse_visited',
	prevDOM : null,
	userKey : 'TempUserKey',
	scrapInfo : {
		url : null,
		title : null,
		content : null
	}
};

myAppMainService.getScrapedTargetInfo = function(url, title, srcElement) {
	if (url.indexOf("https://www.facebook.com") != -1) {// 처음 방문한 페이지 인 경우
		// facebook 인 경우, facebook은 userContent
		if ((url.indexOf('/posts/') != -1 || url.indexOf('/permalink/') != -1)) {
			var userContent = document.getElementsByClassName("userContent");
			userContent = userContent[0].innerText;

			this.setScrapInfo(url, title, userContent);
		} else {
			var userContentWrapper = myAppMainService.findParentClass(srcElement);

			if (userContentWrapper != null) {
				var userContent = userContentWrapper.getElementsByClassName('userContent'), userContentLink = userContentWrapper.getElementsByClassName('_5pcq'), href = userContentLink[0].href, innerText = userContent[0].innerText;

				this.setScrapInfo(href, title, innerText);
			}
		}
	} else {
		// facebook이 아닌 경우
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
	this.scrapInfo.url = url;
	this.scrapInfo.title = title;
	this.scrapInfo.content = content;
};

document.addEventListener('mousemove', function(e) {
	var srcElement = e.srcElement, url = document.URL, title = document.title;

	myAppMainService.getScrapedTargetInfo(url, title, srcElement);
}, false);

chrome.extension.onMessage.addListener(function(message, sender, callback) {
	if (message.functiontoInvoke == "saveScrapInfo") {
		myAppMainService.userInfo = message.userInfo;
		myAppMainService.saveScrapInfo();
	} else if (message.functiontoInvoke == "loadScrapInfo") {
		myAppMainService.loadScrapInfo();
	}
});

myAppMainService.saveScrapInfo = function() {
	var url = this.scrapInfo.url;
	var scrapInfoSaveRequestURL = 'http://115.71.233.172:4000/ajax/insert_pageEntry';
	var scrapInfoSaveRequestData = {
		userInfo : {
			email: null,
			name: null,
			picture: null
		},
		pageInfo : {
			url : null,
			title : null,
			content : null
		}
	};
	
	this.scrapInfoSaveRequestResult = {
		msg : null
	};
	this.scrapInfoSaveRequestResult.success = function() {
		this.msg = '페이지 정보를 저장했습니다.';
		this.showMessage(this.msg);
	};
	this.scrapInfoSaveRequestResult.fail = function() {
		this.msg = '페이지 정보 저장에 실패했습니다.';
		this.showMessage(this.msg);
	};
	this.scrapInfoSaveRequestResult.showMessage = function(msg) {
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
		     			+ "<p>" + msg + "</p>"
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

	if (url != null) {
		scrapInfoSaveRequestData.userInfo = myAppMainService.userInfo;
		scrapInfoSaveRequestData.pageInfo = myAppMainService.scrapInfo;
		
		console.log('result : ');
		console.log(scrapInfoSaveRequestData);

		$.post(scrapInfoSaveRequestURL, scrapInfoSaveRequestData, function(result) {
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

myAppMainService.loadScrapInfo = function() {
	console.log("loadScrapInfo");
};
