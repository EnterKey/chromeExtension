if ( typeof (noteHub) == typeof (undefined)) {
    noteHub = {};
}

noteHub = {
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
        pageInfoSaveRequestURL : 'http://notehub.net/ajax/insert_pageEntry'
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
    },

    initAddEventListener : function() {
        document.addEventListener('contextmenu', noteHub.addScrapedTargetEventListener, false);
        document.addEventListener('mousemove', noteHub.getMouseTargetElementInfo, false);
        document.addEventListener('mouseover', noteHub.getMouseTargetElementInfo, false);
        document.addEventListener('mouseout', noteHub.getMouseTargetElementInfo, false);

        noteHub.alertBoxClose();
        noteHub.addElementToBeHighlight();
        noteHub.removeElementToBeHighlight();
    },

    getMouseTargetElementInfo : function(e) {
        var srcElement = e.srcElement,
            url = document.URL;
        noteHub.highlightSelectedDiv(srcElement, url);
    },

    initRemoveEventListener : function() {
        document.removeEventListener('contextmenu', noteHub.addScrapedTargetEventListener, false);
        document.removeEventListener('mousemove', noteHub.getMouseTargetElementInfo, false);
        document.removeEventListener('mouseover', noteHub.getMouseTargetElementInfo, false);
        document.removeEventListener('mouseout', noteHub.getMouseTargetElementInfo, false);
    },

    highlightSelectedDiv : function(srcElement, url) {
            // facebook 인 경우, facebook은 userContent
            if (this.isFacebookPersonalPage(url)) {
                var userContentWrapper = noteHub.findParentClass(srcElement);

                if (this._cachedElement.prevDOM != null) {
                    this._cachedElement.prevDOM.classList.remove(this._cachedElement.MOUSE_VISITED_CLASSNAME);

                    userContentWrapper.classList.add(this._cachedElement.MOUSE_VISITED_CLASSNAME);
                    this._cachedElement.prevDOM = srcElement;
                }
                else
                {
                    // 현재 저장하려는 자료의 최상위 Element를 얻음
                    var userContentWrapper = noteHub.findParentClass(srcElement);

                    if (userContentWrapper != null) {
                        var removeElement = document.getElementsByClassName(this._cachedElement.MOUSE_VISITED_CLASSNAME);
                        if (removeElement.length > 0) {
                            removeElement[0].classList.remove(this._cachedElement.MOUSE_VISITED_CLASSNAME);
                        }

                        userContentWrapper.classList.add(this._cachedElement.MOUSE_VISITED_CLASSNAME);
                        this._cachedElement.prevDOM = srcElement;
                    }
                }
            }
            else {
                // facebook이 아닌 경우
                if (this.isHighlightAbleElement(srcElement)) {
                    if (this._cachedElement.prevDOM != null) {
                        this._cachedElement.prevDOM.classList.remove(this._cachedElement.MOUSE_VISITED_CLASSNAME);
                    }

                    srcElement.classList.add(this._cachedElement.MOUSE_VISITED_CLASSNAME);
                    this._cachedElement.prevDOM = srcElement;
                }
            }
    },

    isHighlightAbleElement : function(element) {
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
    },

    makeFingerprinting : function() {
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
    },

    addScrapedTargetEventListener : function(e) {
        var srcElement = e.srcElement,
            url = document.URL,
            title = document.title;

        noteHub.getScrapedTargetInfo(url, title, srcElement);
    },

    getScrapedTargetInfo : function(url, title, srcElement) {
        if (this.isFacebook(url)) {
            // facebook 인 경우, facebook은 userContent
            if (this.isFacebookPersonalPage(url)) {
                var userContent = document.getElementsByClassName("userContent");
                userContent = userContent[0].innerText;

                this.setPageInfo(url, title, userContent);
            } else {
                // 현재 저장하려는 자료의 최상위 Element를 얻음
                var userContentWrapper = noteHub.findParentClass(srcElement);

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
    },

    isFacebook : function(url) {
        return url.indexOf("https://www.facebook.com") >= 0 ? true : false;
    },

    isFacebookPersonalPage : function(url) {
        return (url.indexOf('/posts/') != -1 || url.indexOf('/permalink/') != -1) ? true : false;
    },

    findParentClass : function(el) {
        while (el.parentNode) {
            el = el.parentNode;
            // el.className 가 없는 element는 indexOf Method 사용 시 property 에러를 리턴하기 때문에 조건 추가
            if (el.className && el.className.indexOf('mbm') != -1)
                return el;
        }
        return null;
    },

    setPageInfo : function(url, title, content) {
        this.datas.pageInfo.url = url;
        this.datas.pageInfo.title = title;
        this.datas.pageInfo.content = content;
        this.datas.pageInfo.htmldata=$(".bookmark-target").html();
    },

    savePageInfo : function(userInfo) {
        var url = this.datas.pageInfo.url;

        if (url != null && noteHub.datas.pageInfo.content != "") {
            noteHub.datas.userInfo = userInfo;

            noteHub.makeFingerprinting();

            $.post(noteHub.ajaxRequestData.pageInfoSaveRequestURL, noteHub.datas, function(result) {
                if (result.status) {
                    console.log('save success');
                    noteHub.pageInfoSaveRequestResult.showMessage();
                } else {
                    console.log('save error');
                    noteHub.pageInfoSaveRequestResult.showMessage(result.errorMsg);
                }
            });
        }
    },

    pageInfoSaveRequestResult : {},

    pageInfoSaveRequestResult : {
        showMessage : function(pageInfoSaveRequestResultMsg) {
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
        }
    },

    loadPageInfo : function() {
        console.log("loadPageInfo");
    },

    onOffExtension : function() {
        noteHub._cachedElement.isActiveExtension = !noteHub._cachedElement.isActiveExtension;

        noteHub.checkVisitPageType();

        if(noteHub._cachedElement.isActiveExtension) {
            this._cachedElement.MOUSE_VISITED_CLASSNAME = 'bookmark-target';
            this.initAddEventListener();

            // insert font-awesome.min.css
            $('head').append("<link href='//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css' rel='stylesheet'>");

            var wrapper =  $('<div>');
            wrapper.addClass('noteHub-init-alert-msg');
            $('body').append(wrapper);

            var listItemCntOfElementToBeHighlight = this._cachedElement.listOfElementToBeHighlight.length,
                listOfElementToBeHighlight = "";

            for(var i = 0 ; i < listItemCntOfElementToBeHighlight ; i++ ) {
                listOfElementToBeHighlight += noteHub.elementSpanWrapper(this._cachedElement.listOfElementToBeHighlight[i]);
            }

            var msgForNoneFacebookPage =
                    "<div class='note-hub' id='highlight-element-list'>" +
                    "<span>탐색되는 Element 단위 : </span>" + listOfElementToBeHighlight +
                    "</div>" +
                    "<div class='note-hub' id='highlight-element-add-btn-wrapper' style='text-align: center;'>" +
                    "<input type='text' id='element-add-input' style='width: 150px; height: 20px;' />" +
                    "&nbsp" +
                    "<input type='button' value='Element Add' id='element-add-btn' />" +
                    "</div>" +
                    "</div>",

                msgForFacebookPage = "</div>";

            var content =
                "<div class='notehub-alert notehub-alert-info notehub-alert-dismissible note-hub' id='ycs-handler' style='text-align: center !important;;'>"+
                "<div class='note-hub' style='float:right;'>" +
                "<button type='button' class='notehub-close' id='ycs-handler-close'>"+
                "<span>&times;</span>"+
                "<span>Close</span>"+
                "</button>" +
                "</div>" +
                "<span>" +
                "<strong>Note Hub</strong>가 실행중 입니다. 원하는 자료를 스크랩하세요. 종료하려면 Extension 아이콘을 다시 클릭하세요." +
                "</span>";

            content += (noteHub._cachedElement.isFacebookPage == true ? msgForFacebookPage : msgForFacebookPage);

            wrapper.append(content);

            wrapper.css('position', 'fixed');
            wrapper.css('top', '0');
            wrapper.css('left', '0');
            wrapper.css('width', '100%');
            wrapper.css('height', '0');
            wrapper.css('zIndex', '100000');
            wrapper.css('visibility', 'visible');
        } else {
            noteHub.initRemoveEventListener();
            $('.' + noteHub._cachedElement.MOUSE_VISITED_CLASSNAME).removeClass(noteHub._cachedElement.MOUSE_VISITED_CLASSNAME);
            noteHub._cachedElement.MOUSE_VISITED_CLASSNAME = null;
            $('.noteHub-init-alert-msg').remove();
        }
    },

    alertBoxClose : function() {
        $('body').on('click', '#ycs-handler-close', function() {
            $('.noteHub-init-alert-msg').remove();
        });
    },

    addElementToBeHighlight : function() {
        $('body').on('click', '#element-add-btn', function() {
            var addElementName = $('#element-add-input').val();
            addElementName = addElementName.toUpperCase();
            $('#element-add-input').val('');

            for(var i = 0 ; i < noteHub._cachedElement.listOfElementToBeHighlight.length ; i++) {
                if(noteHub._cachedElement.listOfElementToBeHighlight[i] == addElementName) {
                    alert('이미 등록된 태그');
                    return;
                }
            }

            noteHub._cachedElement.listOfElementToBeHighlight.push(addElementName);
            $('#highlight-element-list').append(noteHub.elementSpanWrapper(addElementName));
        });
    },

    removeElementToBeHighlight : function() {
        $('body').on('click', '.notehub-alert-span-item', function() {
            noteHub.highlightItemRemove(noteHub._cachedElement.listOfElementToBeHighlight, this.dataset.highlight);
            $('[data-highlight=' + this.dataset.highlight + ']').remove();
        });
    },

    elementSpanWrapper : function(element) {
        element = "<span class='notehub-alert-span-item' data-highlight='" + element + "'>" + element + "</span>";
        return element;
    },

    highlightItemRemove : function(itemList, item) {
        var index = itemList.indexOf(item);
        if(index != -1) {
            itemList.splice(index, 1);
        }
    },

    checkVisitPageType : function() {
        var url = document.URL;
        noteHub._cachedElement.isFacebookPage = url.indexOf("www.facebook.com") >= 0 ? true : false;
    }
};

/*
 * Context Menus 에서 보낸 이벤트에 대한 Listener 부분
 */
chrome.extension.onMessage.addListener(function(message, sender, callback) {
    if (message.functiontoInvoke == "savePageInfo") {
        noteHub.savePageInfo(message.userInfo);
    } else if (message.functiontoInvoke == "loadPageInfo") {
        noteHub.loadPageInfo();
    }

    if(message.functiontoInvoke == "onOffExtension") {
        noteHub.onOffExtension();
    }
});