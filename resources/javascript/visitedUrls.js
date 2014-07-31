if ( typeof (visitPage) == typeof (undefined)) {
	visitPage = {};
}

visitPage.buildPopupDom = function () {
	var divName = 'visitedUrl_div', 
		popupDiv = $('#' + divName), 
		visitPageInfoList = new Array(), 
		key;
		
	if (window.localStorage.length > 0) {
		for (var i = 0, ie = window.localStorage.length ; i < ie; i++) {
			key = window.localStorage.key(i);
			visitPageInfoList.push(JSON.parse(window.localStorage.getItem(key)));
		}

		visitPageInfoList.sort(function(a, b) {
			return b.visitedCnt - a.visitedCnt;
		});

		var ul = $('<ul>');
		popupDiv.append(ul);

		for (var i = 0, ie = visitPageInfoList.length; i < ie; ++i) {
			var a = $('<a>').attr('href', visitPageInfoList[i].url).text('TITLE : ' + visitPageInfoList[i].title + ', Description : ' + visitPageInfoList[i].description + ', VisitCnt : ' + visitPageInfoList[i].visitedCnt);
			a.on('click', this.onAnchorClick);

			var li = $('<li>');
			li.append(a);
			ul.append(li);
		}
	}
};

visitPage.onAnchorClick = function (event) {
	chrome.tabs.create({
		selected : true,
		url : event.toElement.href
	});
	return false;
};

$(document).on('DOMContentLoaded', function() {
	visitPage.buildPopupDom();
});