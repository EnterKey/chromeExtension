function onAnchorClick(event) {
	chrome.tabs.create({
		selected : true,
		url : event.srcElement.href
	});
	return false;
}

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

		visitPageInfoList.sort(function(a, b) {
			return b.visitedCnt - a.visitedCnt;
		});

		var ul = document.createElement('ul');
		popupDiv.appendChild(ul);

		for (var i = 0, ie = visitPageInfoList.length; i < ie; ++i) {
			var a = document.createElement('a');
			a.href = visitPageInfoList[i].url;
			a.appendChild(document.createTextNode('TITLE : ' + visitPageInfoList[i].title + ', URL : ' + visitPageInfoList[i].url + ', VisitCnt : ' + visitPageInfoList[i].visitedCnt));
			a.addEventListener('click', onAnchorClick);

			var li = document.createElement('li');
			li.appendChild(a);
			ul.appendChild(li);
		}
	}
}

document.addEventListener('DOMContentLoaded', function() {
	buildPopupDom();
});
