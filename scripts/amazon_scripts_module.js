// 换行符换逗号
function newline_for_comma(string) {
    return string.toString().replace('\\n', ",");
}

// 获取亚马逊站点的配置信息 
function get_amazon_config(url) {
    var json_data = {};
    switch (true) {
        case url.indexOf('amazon.com/') > 0:
            json_data = {
                'marketplaceID': 'ATVPDKIKX0DER',
                'keepa_market_id': '1',
                'post_code': '10002',
                'site_code': 'US',
                'site_plat': 'am_us',
                'site_to_lang': 'en'
            };
            break;
        case url.indexOf('amazon.ca') > 0:
            json_data = {
                'marketplaceID': 'A2EUQ1WTGCTBG2',
                'keepa_market_id': '6',
                'post_code': 'A1B 2C3',
                'site_code': 'CA',
                'site_plat': 'am_ca',
                'site_to_lang': 'en'
            };
            break;
        case url.indexOf('amazon.com.mx') > 0:
            json_data = {
                'marketplaceID': 'A1AM78C64UM0Y8',
                'keepa_market_id': '11',
                'post_code': '77580',
                'site_code': 'MX',
                'site_plat': 'am_mx',
                'site_to_lang': 'es'
            };
            break;
        case url.indexOf('amazon.co.uk') > 0:
            json_data = {
                'marketplaceID': 'A1F83G8C2ARO7P',
                'keepa_market_id': '2',
                'post_code': 'SW17%209NT',
                'site_code': 'UK',
                'site_plat': 'am_uk',
                'site_to_lang': 'en'
            };
            break;

        case url.indexOf('amazon.de') > 0:
            json_data = {
                'marketplaceID': 'A1PA6795UKMFR9',
                'keepa_market_id': '3',
                'post_code': '89233',
                'site_code': 'DE',
                'site_plat': 'am_de',
                'site_to_lang': 'de'
            };
            break;
        case url.indexOf('amazon.es') > 0:
            json_data = {
                'marketplaceID': 'A1RKKUPIHCS9HS',
                'keepa_market_id': '9',
                'post_code': '30560',
                'site_code': 'ES',
                'site_plat': 'am_es',
                'site_to_lang': 'es'
            };
            break;
        case url.indexOf('amazon.fr') > 0:
            json_data = {
                'marketplaceID': 'A13V1IB3VIYZZH',
                'keepa_market_id': '4',
                'post_code': '30560',
                'site_code': 'FR',
                'site_plat': 'am_fr',
                'site_to_lang': 'fr'
            };
            break;
        case url.indexOf('amazon.it') > 0:
            json_data = {
                'marketplaceID': 'APJ6JRA9NG5V4',
                'keepa_market_id': '8',
                'post_code': '55049',
                'site_code': 'IT',
                'site_plat': 'am_it',
                'site_to_lang': 'it'
            };
            break;
        case url.indexOf('amazon.co.jp') > 0:
            json_data = {
                'marketplaceID': 'A1VC38T7YXB528',
                'keepa_market_id': '5',
                'post_code': '197-0408',
                'site_code': 'JP',
                'site_plat': 'am_jp',
                'site_to_lang': 'jo'
            };
            break;
        case url.indexOf('amazon.com.au') > 0:
            json_data = {
                'marketplaceID': 'A39IBJ37TRP1C6',
                'keepa_market_id': '13',
                'post_code': '0200-0299',
                'site_code': 'AU',
                'site_plat': 'am_au',
                'site_to_lang': 'en'
            };
            break;
        default:
            json_data = {
                'marketplaceID': 'null',
                'keepa_market_id': 'null',
                'post_code': 'null',
                'site_code': 'null',
                'site_plat': 'null',
                'site_to_lang': 'null'
            };
            break;
    }
    return json_data;
}

// 判断亚马逊当前的页面类型
function get_amazon_page_type(type) {
    switch (true) {
        case type == 'search':
            return (location.href.indexOf(`www.amazon`) > -1 && (location.href.indexOf(`/s?`) > -1))
        case type == 'listing':
            return (location.href.indexOf(`www.amazon`) > -1 && (location.href.indexOf(`/dp/`) > -1 || location.href.indexOf(`/gp/product/`) > -1))
        case type == 'expand':
            return (location.href.indexOf(`www.amazon`) > -1 && (location.href.indexOf(`/favicon.ico?mod=`) > -1))
        case type == 'amazon':
            return (location.href.indexOf(`www.amazon`) > -1)
    }
}

// 获取 URL 参数
function get_query_variable(variable) {
    try {
        query = window.location.search.substring(1);
        query = decodeURIComponent(query).replace('%0A', ',').replace('%20', ' ');
        vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return (false);
    } catch (error) {
        console.log(error);
        return (false);
    }

}

// 获取 列表里面的字典最大的数
function get_list_max(array) {
    var max = 0;
    for (let index = 0; index < array.length; index++) {
        if (array[index].sales > max) {
            max = array[index].sales;
        }
    }
    return max;
}

// 字典对象转URL参数
function get_parse_param(param, key) {
    var paramStr = "";
    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += "&" + key + "=" + param;
    } else {
        $.each(param, function (i) {
            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + get_parse_param(this, k);
        });
    }
    return paramStr.substr(1);
};

// Excel Sheet 对象数据转 blob 数据
function sheet_to_blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    var wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

// 打开下载文件对话框
function open_download_dialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url);
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || '';
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

// 调用谷歌翻译
function get_translation(sting, lang) {
    var url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-Hans&tl=${lang}&dt=t&q=${sting}`
    return JSON.parse(get_content(url, '', 'GET'))[0][0][0]
}

// URL 路径算法
function get_matching(reg, input) {
    var reg_split = reg.split('*');
    for (let index = 0; index < input.length; index++) {
        if (index == reg_split.length) {
            return reg.charAt(reg.length - 1) == '*' ? true : false
        }
        let _reg_split = reg_split[index++];
        let index_of = input.indexOf(_reg_split);
        if (index_of == -1) {
            return false;
        } else {
            input = input.substring(index_of + _reg_split.length);
        }
    }
    return true;
}

// 发送 网络请求
function get_content(url, data = '', mode = 'GET', type = 'html') {
    console.log(`-> get_content mode:${mode} type:${type} url:${url}`);
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(mode, url, false);
    if (type == 'json') {
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    } else {
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xmlHttpRequest.send(data);
    return xmlHttpRequest.responseText;
}

// 初始化 serializeObject
function initSerializeObject() {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
}

// 查询购物车库存
function get_cart_inventory() {
    initSerializeObject();
    let nav_cart_url = $('#nav-cart').attr('href');
    let add_to_cart_from_url = $('#addToCart').attr('action');
    let add_to_cart_from = $('#addToCart').serializeObject();
    add_to_cart_from.quantity = 1110;
    $.post(add_to_cart_from_url, add_to_cart_from, () => {
        $.get(nav_cart_url, (html_code) => {
            let quantity_box = $(html_code).find('input[name="quantityBox"]').val();
            $("#selectQuantity").after(`<font color="red">剩余库存:${quantity_box}(仅参考)</font>`)
        })
    });
}

// 获取 Config 配置
function get_config(url = '/config/config.json') {
    let chrome_url = chrome.extension.getURL(url);
    let config_json = get_content(chrome_url);
    return JSON.parse(config_json);
}

// 加载 额外的 Java Script 模块
function inject_custom_main(path, label_name) {
    return new Promise(function (resolve, reject) {
        if (label_name == 'js') {
            eval(get_content(path, type = 'html'))
            resolve();
        } else {
            reject();
        }
    });
}

// 加载 额外的 Java Script 模块
(async () => {
    await inject_custom_main('https://cdn.jsdelivr.net/npm/momentjs@1.1.17/moment.js', 'js');
    await inject_custom_main('https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js', 'js');
})()