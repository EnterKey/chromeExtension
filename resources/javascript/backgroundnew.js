// writen by pcs

function getListByAjax(userKey){
	 $.ajax({
	 	  type: 'POST', 
          url: "http://localhost:4000/getlist",
          data: {userKey:userKey},
          success: function(data) {
            console.log(data);
          },
          error: function(e) {
          	//error handling
            console.log(e);
          },
          dataType : 'json'
      });
}
function setListByAjax(userKey,data){
	$.ajax({  
		type: 'POST',
		url: "http://localhost:4000/setlist",  
		data: {userKey:userKey, item:data},  
		success: function(data) {
            console.log(data);
        },
        error: function(e) {
            console.log(e);
        },
		dataType: 'json'
	});  
}

// writen by pcs

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
	if (changeInfo.status === 'complete') {
		chrome.tabs.get(tabId, function(tab){
			var url = tab.url, title = tab.title;
			getListByAjax();
			var visitedPageInfo =getListByAjax();// JSON.parse(window.localStorage.getItem(url));

			if (visitedPageInfo != null) {
				visitedPageInfo.visitedCnt += 1;
				setListByAjax(visitedPageInfo);
				//window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
			} else {
				visitedPageInfo = {};
				visitedPageInfo.visitedCnt = 1;
				visitedPageInfo.url = url;
				visitedPageInfo.title = title;
				visitedPageInfo.date = new Date();
				setListByAjax(visitedPageInfo);
				//window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
			}
		});
	}
});
