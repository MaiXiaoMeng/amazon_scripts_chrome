CONFIG = get_config();
REQUEST_HEADERS = CONFIG['request_headers'];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.tabs.sendMessage(sender.tab.id, {});
});

// 如果需要监听同步信息的话,监听器必须是同步的,不能是回调函数
// 实际上监听只异步请求只需要调用一次
(() => {
    if (typeof listener == 'undefined') {
        listener = function (details) {
            REQUEST_HEADERS.forEach(_REQUEST_HEADERS => {
                if (get_matching(_REQUEST_HEADERS.url, details.url) && _REQUEST_HEADERS.type.some(item => item == details.type)) {
                    _REQUEST_HEADERS.headers.forEach(_headers => {
                        console.log(`URL:${details.url} EDIT HEADERS => NAME:${_headers.name} VALUE:${_headers.value}`);
                        if (details.requestHeaders.some(item => item.name == _headers.name)) {
                            for (let index = 0; index < details.requestHeaders.length; index++) {
                                if (details.requestHeaders[index].name == _headers.name) {
                                    details.requestHeaders[index].value = _headers.value;
                                }
                            }
                        } else {
                            details.requestHeaders.push(_headers)
                        }
                    })
                }
            });
            return { requestHeaders: details.requestHeaders };
        };
    }
    chrome.webRequest.onBeforeSendHeaders.addListener(listener,
        { "urls": ['<all_urls>'] },
        ["extraHeaders", "requestHeaders", "blocking"]);
})()