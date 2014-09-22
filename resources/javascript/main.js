if ( typeof (myAppMainService) == typeof (undefined)) {
	myAppMainService = {};
}

myAppMainService = {
	_cachedElement : {
        MOUSE_VISITED_CLASSNAME : null,
		prevDOM : null,
		isFacebookPage : false,
        isActiveExtension : false,
        listOfElementToBeHighlight : [
            "DIV", "TABLE", "TR", "TD", "P", "LI" , "DL", "PRE"
        ]
	},
	ajaxRequestData : {
		pageInfoSaveRequestURL : 'http://localhost:4000/ajax/insert_pageEntry'
	},
	datas : {
		userInfo : {
			email : null,
			name : null,
			picture : null,
			fingerprint : null
		},
		pageInfo : {
			url : null,
			title : null,
			content : null
		}
	}
};

myAppMainService.initAddEventListener = function() {
    document.addEventListener('contextmenu', myAppMainService.addScrapedTargetEventListener, false);
    document.addEventListener('mousemove', myAppMainService.getMouseTargetElementInfo, false);
    document.addEventListener('mouseover', myAppMainService.getMouseTargetElementInfo, false);
    document.addEventListener('mouseout', myAppMainService.getMouseTargetElementInfo, false);

    myAppMainService.alertBoxClose();
    myAppMainService.addElementToBeHighlight();
    myAppMainService.removeElementToBeHighlight();
}

myAppMainService.getMouseTargetElementInfo = function(e) {
    var srcElement = e.srcElement,
        url = document.URL;
    myAppMainService.highlightSelectedDiv(srcElement, url);
}

myAppMainService.initRemoveEventListener = function() {
    document.removeEventListener('contextmenu', myAppMainService.addScrapedTargetEventListener, false);
    document.removeEventListener('mousemove', myAppMainService.getMouseTargetElementInfo, false);
    document.removeEventListener('mouseover', myAppMainService.getMouseTargetElementInfo, false);
    document.removeEventListener('mouseout', myAppMainService.getMouseTargetElementInfo, false);
}

myAppMainService.highlightSelectedDiv = function(srcElement, url) {
	if (this.isFacebook(url)) {
		// facebook 인 경우, facebook은 userContent
		if (this.isFacebookPersonalPage(url)) {
			var userContentWrapper = myAppMainService.findParentClass(srcElement);
			
			if (this._cachedElement.prevDOM != null) {
				this._cachedElement.prevDOM.classList.remove(this._cachedElement.MOUSE_VISITED_CLASSNAME);
			}
			
			userContentWrapper.classList.add(this._cachedElement.MOUSE_VISITED_CLASSNAME);
			this._cachedElement.prevDOM = srcElement;
		} else {
			// 현재 저장하려는 자료의 최상위 Element를 얻음
			var userContentWrapper = myAppMainService.findParentClass(srcElement);

			if (userContentWrapper != null) {
				var removeElement = document.getElementsByClassName(this._cachedElement.MOUSE_VISITED_CLASSNAME);
				if(removeElement.length > 0) {
					removeElement[0].classList.remove(this._cachedElement.MOUSE_VISITED_CLASSNAME);
				}
			
				userContentWrapper.classList.add(this._cachedElement.MOUSE_VISITED_CLASSNAME);
				this._cachedElement.prevDOM = srcElement;
			}
		}
	} else {
		// facebook이 아닌 경우
		if (this.isHighlightAbleElement(srcElement)) {
			if (this._cachedElement.prevDOM != null) {
				this._cachedElement.prevDOM.classList.remove(this._cachedElement.MOUSE_VISITED_CLASSNAME);
			}
		
			srcElement.classList.add(this._cachedElement.MOUSE_VISITED_CLASSNAME);
			this._cachedElement.prevDOM = srcElement;
		}
	}
};


myAppMainService.isHighlightAbleElement = function(element) {
    var listLength = this._cachedElement.listOfElementToBeHighlight.length,
        checkResult = false,
        nodeName = element.nodeName,
        className = element.className || null;


    for(var  i = 0 ; i < listLength ; i++) {
        if(this._cachedElement.listOfElementToBeHighlight[i] == nodeName && className != 'note-hub') {
            checkResult = true;
        }
    }

    return checkResult;
};

myAppMainService.makeFingerprinting = function() {
	var canvas = $('<canvas>');
	var context = canvas[0].getContext('2d');
	txt = "SW Maestro 5th This is fingerprinting";

	context.textBaseline = "top";
	context.font = "14px 'Arial'";
	context.textBaseline = "alphabetic";
	context.fillStyle = "#f60";
	context.fillRect(125,1,62,20);
	context.fillSytle = "#069";
	context.fillText(txt, 2, 15);
	context.fillStyle = "rgba(102, 204, 0, 0.7)";
	context.fillText(txt, 4, 17);

	this.datas.userInfo.fingerprint = canvas[0].toDataURL("data:image/png;base64","");
};

myAppMainService.addScrapedTargetEventListener = function(e) {
	var srcElement = e.srcElement,
		url = document.URL,
		title = document.title;

	myAppMainService.getScrapedTargetInfo(url, title, srcElement);
};

// 사용자가 저장하려는 페이지의 종류에 따라 데이터를 저장
myAppMainService.getScrapedTargetInfo = function(url, title, srcElement) {
	if (this.isFacebook(url)) {
		// facebook 인 경우, facebook은 userContent
		if (this.isFacebookPersonalPage(url)) {
			var userContent = document.getElementsByClassName("userContent");
			userContent = userContent[0].innerText;

			this.setPageInfo(url, title, userContent);
		} else {
			// 현재 저장하려는 자료의 최상위 Element를 얻음
			var userContentWrapper = myAppMainService.findParentClass(srcElement);

			if (userContentWrapper != null) {
				var userContent = userContentWrapper.getElementsByClassName('userContent'),
				userContentLink = userContentWrapper.getElementsByClassName('_5pcq'),
				href = userContentLink[0].href,
				innerText = userContent[0].innerText;

				this.setPageInfo(href, title, innerText);
			}
		}
	} else {
		// facebook이 아닌 경우
		this.setPageInfo(url, title, srcElement.innerText);
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
		// el.className 가 없는 element는 indexOf Method 사용 시 property 에러를 리턴하기 때문에 조건 추가
		if (el.className && el.className.indexOf('mbm') != -1)
			return el;
	}
	return null;
};

myAppMainService.setPageInfo = function(url, title, content) {
	this.datas.pageInfo.url = url;
	this.datas.pageInfo.title = title;
	this.datas.pageInfo.content = content;
};

/*
 * Context Menus 에서 보낸 이벤트에 대한 Listener 부분
 */

chrome.extension.onMessage.addListener(function(message, sender, callback) {
	if (message.functiontoInvoke == "savePageInfo") {
		myAppMainService.savePageInfo(message.userInfo);
	} else if (message.functiontoInvoke == "loadPageInfo") {
		myAppMainService.loadPageInfo();
	}
	
	if(message.functiontoInvoke == "onOffExtension") {
		myAppMainService.onOffExtension();
	}
});

// 사용자가 저장하고자 하는 컨텐츠를 서버에 요청 
myAppMainService.savePageInfo = function(userInfo) {
	var url = this.datas.pageInfo.url;

	if (url != null && myAppMainService.datas.pageInfo.content != "") {
		myAppMainService.datas.userInfo = userInfo;

		myAppMainService.makeFingerprinting();

		$.post(myAppMainService.ajaxRequestData.pageInfoSaveRequestURL, myAppMainService.datas, function(result) {
			if (result.status) {
				console.log('save success');
				myAppMainService.pageInfoSaveRequestResult.showMessage();
            } else {
                console.log('save error');
                myAppMainService.pageInfoSaveRequestResult.showMessage(result.errorMsg);
           }
		});
	}
};

myAppMainService.pageInfoSaveRequestResult = {};

// 사용자가 chrome extension app을 사용하여 서버에 컨텐츠를 저장 요청 후, 서버 응답 결과를 메시지로 출력
myAppMainService.pageInfoSaveRequestResult.showMessage = function(pageInfoSaveRequestResultMsg) {
	if(arguments.length == 0) pageInfoSaveRequestResultMsg = '데이터 저장 성공';

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
	     			+ "<p>" + pageInfoSaveRequestResultMsg + "</p>"
	     			+ "<br />"
	     			+ "<a href='http://www.enterkey.kr/'>EnterKey.kr</a>"
				+ "</div>";

	bubbleDOM.append(content);
    bubbleDOM.css('top', bubbleDOMYPosition + 'px');
    bubbleDOM.css('left', bubbleDOMXPosition + 'px');
    bubbleDOM.css('zIndex', '100000');
    bubbleDOM.css('visibility', 'visible');

    setTimeout(function() {
    	bubbleDOM.fadeOut('slow');
    	$('body').remove('.selection_bubble');
    }, 3000);
};

myAppMainService.loadPageInfo = function() {
	console.log("loadPageInfo");
};


myAppMainService.onOffExtension = function() {
    var onOffFlag = myAppMainService._cachedElement.isActiveExtension = !myAppMainService._cachedElement.isActiveExtension;

    myAppMainService.checkVisitPageType();

	if(onOffFlag) {
        this._cachedElement.MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
        this.initAddEventListener();

		// insert font-awesome.min.css
		$('head').append("<link href='//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css' rel='stylesheet'>");

		var wrapper =  $('<div>');
		wrapper.addClass('noteHub-init-alert-msg');
		$('body').append(wrapper);

        var listItemCntOfElementToBeHighlight = this._cachedElement.listOfElementToBeHighlight.length,
            listOfElementToBeHighlight = "";

        for(var i = 0 ; i < listItemCntOfElementToBeHighlight ; i++ ) {
            listOfElementToBeHighlight += myAppMainService.elementSpanWrapper(this._cachedElement.listOfElementToBeHighlight[i]);
        }

        var content;
        if(myAppMainService._cachedElement.isFacebookPage) {
            content =
                "<div class='notehub-alert notehub-alert-info notehub-alert-dismissible note-hub' id='ycs-handler' style='text-align: center !important;;'>"+
                    "<div class='note-hub' style='float:right;'>" +
                        "<button type='button' class='notehub-close' id='ycs-handler-close'>"+
                            "<span>&times;</span>"+
                            "<span>Close</span>"+
                        "</button>" +
                    "</div>" +
                    "<span>" +
                        "<strong>Note Hub</strong>가 실행중 입니다. 원하는 자료를 스크랩하세요. 종료하려면 Extension 아이콘을 다시 클릭하세요." +
                    "</span>" +
                "</div>";
        } else {
            content =
                "<div class='notehub-alert notehub-alert-info notehub-alert-dismissible note-hub' id='ycs-handler' style='text-align: center !important;;'>"+
                    "<div class='note-hub' style='float:right;'>" +
                        "<button type='button' class='notehub-close' id='ycs-handler-close'>"+
                            "<span>&times;</span>"+
                            "<span>Close</span>"+
                        "</button>" +
                    "</div>" +
                    "<span>" +
                        "<strong>Note Hub</strong>가 실행중 입니다. 원하는 자료를 스크랩하세요. 종료하려면 Extension 아이콘을 다시 클릭하세요." +
                    "</span>" +
                    "<div class='note-hub' id='highlight-element-list'>" +
                        "<span>탐색되는 Element 단위 : </span>" + listOfElementToBeHighlight +
                    "</div>" +
                    "<div class='note-hub' id='highlight-element-add-btn-wrapper' style='text-align: center;'>" +
                        "<input type='text' id='element-add-input' style='width: 150px; height: 20px;' />" +
                        "&nbsp" +
                        "<input type='button' value='Element Add' id='element-add-btn' />" +
                    "</div>" +
                "</div>";
        }

		wrapper.append(content);

		wrapper.css('position', 'fixed');
		wrapper.css('top', '0');
		wrapper.css('left', '0');
	    wrapper.css('width', '100%');
	    wrapper.css('height', '0');
	    wrapper.css('zIndex', '100000');
	    wrapper.css('visibility', 'visible');
	} else {
        myAppMainService.initRemoveEventListener();
        $('.' + myAppMainService._cachedElement.MOUSE_VISITED_CLASSNAME).removeClass(myAppMainService._cachedElement.MOUSE_VISITED_CLASSNAME);
        myAppMainService._cachedElement.MOUSE_VISITED_CLASSNAME = null;
        $('.noteHub-init-alert-msg').remove();
    }
}

myAppMainService.alertBoxClose = function() {
    $('body').on('click', '#ycs-handler-close', function() {
        $('.noteHub-init-alert-msg').remove();
    });
};

myAppMainService.addElementToBeHighlight = function() {
    $('body').on('click', '#element-add-btn', function() {
        var addElementName = $('#element-add-input').val();
        addElementName = addElementName.toUpperCase();
        $('#element-add-input').val('');

        for(var i = 0 ; i < myAppMainService._cachedElement.listOfElementToBeHighlight.length ; i++) {
            if(myAppMainService._cachedElement.listOfElementToBeHighlight[i] == addElementName) {
                alert('이미 등록된 태그');
                return;
            }
        }

        myAppMainService._cachedElement.listOfElementToBeHighlight.push(addElementName);
        $('#highlight-element-list').append(myAppMainService.elementSpanWrapper(addElementName));
    });
};

myAppMainService.removeElementToBeHighlight = function() {
    $('body').on('click', '.notehub-alert-span-item', function() {
        myAppMainService.highlightItemRemove(myAppMainService._cachedElement.listOfElementToBeHighlight, this.dataset.highlight);
        console.dir($('[data-highlight=' + this.dataset.highlight + ']'));
        $('[data-highlight=' + this.dataset.highlight + ']').remove();
    });
};

myAppMainService.elementSpanWrapper = function(element) {
    element = "<span class='notehub-alert-span-item' data-highlight='" + element + "'>" + element + "</span>";
    return element;
}

myAppMainService.highlightItemRemove = function(itemList, item) {
    var index = itemList.indexOf(item);
    if(index != -1) {
        itemList.splice(index, 1);
    }
}

myAppMainService.checkVisitPageType = function() {
    var url = document.URL;
    myAppMainService._cachedElement.isFacebookPage = url.indexOf("www.facebook.com") >= 0 ? true : false;
};