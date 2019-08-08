function DB_error(d) {
    if(d.data == "Database error!" || d.status == 400 ||
		d.status == 401 ||
		d.status == 403 ||
		d.status == 404 ||
		d.status == 405 ||
		d.status == 406 ||
		d.status == 415 ||
		d.status == 500 ||
		d.status == 502 ||
		d.status == 503) {
        alert("Server error!\nCould not connect to database.");
        return true;
    }
}


//------------------------------------------------------------------------------

function loadData(parent, http, server, callback) { // loading list of objects of goods & set parent.goods
    // - args - scope,http-service,is server:action,callback

    function afterFc(data) {
        if(DB_error(data)) return;
        parent.data = data.data;
        if(callback) callback(data.data);
    }
	http.get(server).then(function(data) {
            afterFc(data);
	});
}

//------------------------------------------------------------------------------

function getPage(totalItems, currentPage, pageItemSize) { // constructing pagination object
    var totalItems = totalItems;
    var startIndex = null;
    var endIndex = null;
    var pageItemSize = pageItemSize || 12;
    var pages = [];
    var totalPage = Math.ceil(totalItems / pageItemSize);
    var startPage = null;
    var endPage = null;
    var currentPage = currentPage || 1;



    if(totalPage < 10) {
        startPage = 1;
        endPage = totalPage;
    } else {
        if(currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else {
            if(currentPage + 4 > totalPage) {
                startPage = totalPage - 9;
                endPage = totalPage;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
    }
    for(var j = startPage; j <= endPage; j++)
        pages.push(j);
    startIndex = (currentPage - 1) * pageItemSize;
    endIndex = Math.min(startIndex + pageItemSize - 1, totalItems - 1);

    return {
        totalItems: totalItems,
        startIndex: startIndex,
        endIndex: endIndex,
        pageItemSize: pageItemSize,
        pages: pages,
        totalPage: totalPage,
        startPage: startPage,
        endPage: endPage,
        currentPage: currentPage
    };
}

//------------------------------------------------------------------------------

// scrolling element to top of window
function scrollTop(id) {
    // - arg - string-id
    function getTop(elem) {
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var top = box.top + scrollTop - clientTop;
        return top;
    }
//    var elem = document.getElementById(id);
//    var top = getTop(elem);
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

//------------------------------------------------------------------------------