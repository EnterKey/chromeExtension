// writen by pcs

function getListByAjax(){
	 $.ajax({
          url: "",
          dataType : 'json',
          success: function(data) {
            console.log(data);
          },
          error: function(e) {
          	//error handling
            console.log(e);
          }
      });
}
function setListByAjax(userKey,listdata){
	$.ajax({  
		type: 'POST',  
		url: "",  
		data: {userKey:userKey, list:listdata},  
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
