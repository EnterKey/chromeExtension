var tempuserkey = 'TempUserKey';


function onAnchorClick(event) {
	console.dir(event);
	chrome.tabs.create({
		selected : true,
		url : event.toElement.href
	});
	return false;
};

function getPageInfo(){
	var pageInfo = {};
	chrome.tabs.getSelected(null, function(tab){
		pageInfo.url = tab.url;
		pageInfo.title = tab.title;
	});

	return pageInfo;
}

function getListByAjax(userKey){
	$.ajax({
		  type: 'POST', 
	  url: "http://localhost:4000/getlist",
	  data: {
	  	userKey:userKey
	  },
	  success: function(data) {
	    buildPopupDom(data);
	  },
	  error: function(e) {
	  	//error handling
	    console.log(e);
	  },
	  dataType : 'json'
	});
};

function setListByAjax(userKey, pageInfo){

	console.log(pageInfo);

	var post_data = {};
	post_data.pageInfo = {
		url: 'tempURL',
		title: 'tempTitle'
	};
	// post_data.pageInfo = pageInfo;
	post_data.userKey = tempuserkey;

	$.post("http://localhost:4000/setlist", post_data, function(err, res, body){
		console.log(err, res, body);
	});
};


function buildPopupDom(PageInfoList) {

	console.log(PageInfoList);

	if(PageInfoList == undefined || PageInfoList == null || PageInfoList.length <= 0){
		console.log('Data Error');
		return;
	}

	var divName = 'visitedUrl_div', 
		popupDiv = $('#' + divName); 

	for(i=0;i<PageInfoList.length;i++){
		var ul = $('<ul>');
		popupDiv.append(ul);

		for (var i = 0, ie = PageInfoList.length; i < ie; ++i) {
			var a = $('<a>').attr('href', PageInfoList[i].url).text('TITLE : ' + PageInfoList[i].title + ', URL : ' + PageInfoList[i].url);
			a.bind('click', onAnchorClick);

			var li = $('<li>');
			li.append(a);
			ul.append(li);
		}
	}
};

$(document).bind('DOMContentLoaded', function() {
	setListByAjax(tempuserkey, getPageInfo());
	getListByAjax(tempuserkey);
});