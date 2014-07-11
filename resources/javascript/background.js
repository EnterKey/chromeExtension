chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
	if (changeInfo.status === 'complete') {
		chrome.tabs.get(tabId, function(tab){
			var url = tab.url, title = tab.title;
			var visitedPageInfo = JSON.parse(window.localStorage.getItem(url));

			if (visitedPageInfo != null) {
				visitedPageInfo.visitedCnt += 1;
				window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
			} else {
				visitedPageInfo = {};
				visitedPageInfo.visitedCnt = 1;
				visitedPageInfo.url = url;
				visitedPageInfo.title = title;
				visitedPageInfo.date = new Date();
				window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
			}
		});
	}
});