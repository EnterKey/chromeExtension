function buildPopupDom() {
	var divName = 'visitedUrl_div';
	var popupDiv = document.getElementById(divName);

	var visitPageInfoList = new Array();
	var key;
	if (window.localStorage.length > 0) {
		for (var i = 0; i < window.localStorage.length; i++) {
			key = window.localStorage.key(i);
			visitPageInfoList.push(JSON.parse(window.localStorage.getItem(key)));
		}

		var ul = document.createElement('ul');
		popupDiv.appendChild(ul);
	
		console.dir(visitPageInfoList);
		for (var i = 0, ie = visitPageInfoList.length; i < ie; ++i) {
			var a = document.createElement('a');
			a.href = visitPageInfoList[i].url;
			a.appendChild(document.createTextNode('TITLE : ' + visitPageInfoList[i].title + ', URL : ' + visitPageInfoList[i].url + ', VisitCnt : ' + visitPageInfoList[i].visitedCnt));
			
			var li = document.createElement('li');
			li.appendChild(a);
			
			ul.appendChild(li);
		}
	}

}

function buildVisitedSiteList() {
	var visitPageInfo = {
		url : null,
		title : null,
		date : null,
		visitedCnt : 1
	}
	
	chrome.tabs.query({
		active : true,
		lastFocusedWindow : true
	}, function(tabs) {
		// callback
		var tab = tabs[0];
		/*
		 	tab info : 
		 	
		 	active: true
			favIconUrl: "http://www.naver.com/favicon.ico?1"
			height: 779
			highlighted: true
			id: 661
			incognito: false
			index: 0
			pinned: false
			selected: true
			status: "complete"
			title: "NAVER"
			url: "http://www.naver.com/"
			width: 720
			windowId: 653
			*
		 */
		
		var url = tab.url, title = tab.title;
		
		var visitedPageInfo = JSON.parse(window.localStorage.getItem(url));
		if (visitedPageInfo != null) {
			visitedPageInfo.visitedCnt += 1;
			window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
		} else {
			visitPageInfo.url = url;
			visitPageInfo.title = title;
			visitPageInfo.date = new Date();
			window.localStorage.setItem(visitPageInfo.url, JSON.stringify(visitPageInfo));
		}
		
		buildPopupDom();
	});
}

document.addEventListener('DOMContentLoaded', function() {
	buildVisitedSiteList();
});
