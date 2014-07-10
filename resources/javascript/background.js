// chrome.tabs.onUpdated.addListener(function(tabId, props) {
// 	/*
// 	 * to do..
// 	 */
// });

// chrome.tabs.onActivated.addListener(function(activeInfo) {
// 	var visitPageInfo = {
// 		url : null,
// 		title : null,
// 		date : null,
// 		visitedCnt : 1
// 	}
	
// 	console.log('hello');
// 	chrome.tabs.get(activeInfo.tabId, function(tab) {
// 		var url = tab.url, title = tab.title;
		
// 		var visitedPageInfo = JSON.parse(window.localStorage.getItem(url));
// 		if (visitedPageInfo != null) {
// 			visitedPageInfo.visitedCnt += 1;
// 			window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
// 		} else {
// 			visitPageInfo.url = url;
// 			visitPageInfo.title = title;
// 			visitPageInfo.date = new Date();
// 			window.localStorage.setItem(visitPageInfo.url, JSON.stringify(visitPageInfo));
// 		}
// 	});
// });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
	if (changeInfo.status === 'complete') {
		chrome.tabs.get(tabId, function(tab){
			var url = tab.url, title = tab.title;
			var visitedPageInfo = JSON.parse(window.localStorage.getItem(url));

			console.log(url, title, visitedPageInfo);
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