CONFIG = get_config();
REQUEST_HEADERS = CONFIG['request_headers'];

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        REQUEST_HEADERS.forEach(_REQUEST_HEADERS => {
            if (get_matching(_REQUEST_HEADERS.url, details.url) && _REQUEST_HEADERS.type == details.type) {
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
    }, { urls: ['<all_urls>'] }, ["blocking", "requestHeaders"]
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.tabs.sendMessage(sender.tab.id, {
        ecomtool_response: true,
        ust: 2,
    });
});
