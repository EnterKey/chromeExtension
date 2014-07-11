function onAnchorClick(event) {
	console.dir(event);
	chrome.tabs.create({
		selected : true,
		url : event.toElement.href
	});
	return false;
}

function buildPopupDom() {
	var divName = 'visitedUrl_div', 
		popupDiv = $('#' + divName), 
		visitPageInfoList = new Array(), 
		key;
		
	if (window.localStorage.length > 0) {
		for (var i = 0; i < window.localStorage.length; i++) {
			key = window.localStorage.key(i);
			visitPageInfoList.push(JSON.parse(window.localStorage.getItem(key)));
		}

		visitPageInfoList.sort(function(a, b) {
			return b.visitedCnt - a.visitedCnt;
		});

		var ul = $('<ul>');
		popupDiv.append(ul);

		for (var i = 0, ie = visitPageInfoList.length; i < ie; ++i) {
			var a = $('<a>').attr('href', visitPageInfoList[i].url).text('TITLE : ' + visitPageInfoList[i].title + ', URL : ' + visitPageInfoList[i].url + ', VisitCnt : ' + visitPageInfoList[i].visitedCnt);
			a.bind('click', onAnchorClick);

			var li = $('<li>');
			li.append(a);
			ul.append(li);
		}
	}
}

$(document).bind('DOMContentLoaded', function() {
	buildPopupDom();
});