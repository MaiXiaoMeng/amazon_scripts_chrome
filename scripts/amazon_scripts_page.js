/* jshint esversion: 6 */

eval($('#initialize').text());
vue.$notification.open({
    message: `亚马逊插件JS加载完成`,
    description: ``,
    placement: 'bottomRight',
});

// 字典转URL参数
var parseParam = function (param, key) {
    var paramStr = "";
    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += "&" + key + "=" + param;
    } else {
        $.each(param, function (i) {
            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + parseParam(this, k);
        });
    }
    return paramStr.substr(1);
};

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
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    });

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}


// 获取 URL 参数
function get_query_variable(variable) {
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
}

// 获取亚马逊站点的配置信息 
function get_amazon_conifg(url) {
    switch (true) {
        case url.indexOf('amazon.com/') > 0:
            json_data = {
                'marketplaceID': 'ATVPDKIKX0DER',
                'keepa_market_id': '1',
                'post_code': '10002',
                'site_code': 'US',
            };
            break;
        case url.indexOf('amazon.ca') > 0:
            json_data = {
                'marketplaceID': 'A2EUQ1WTGCTBG2',
                'keepa_market_id': '6',
                'post_code': 'A1B 2C3',
                'site_code': 'CA',
            };
            break;
        case url.indexOf('amazon.com.mx') > 0:
            json_data = {
                'marketplaceID': 'A1AM78C64UM0Y8',
                'keepa_market_id': '11',
                'post_code': '77580',
                'site_code': 'MX',
            };
            break;
        case url.indexOf('amazon.co.uk') > 0:
            json_data = {
                'marketplaceID': 'A1F83G8C2ARO7P',
                'keepa_market_id': '2',
                'post_code': 'SW17%209NT',
                'site_code': 'UK',
            };
            break;

        case url.indexOf('amazon.de') > 0:
            json_data = {
                'marketplaceID': 'A1PA6795UKMFR9',
                'keepa_market_id': '3',
                'post_code': '89233',
                'site_code': 'DE',
            };
            break;
        case url.indexOf('amazon.es') > 0:
            json_data = {
                'marketplaceID': 'A1RKKUPIHCS9HS',
                'keepa_market_id': '9',
                'post_code': '30560',
                'site_code': 'ES',
            };
            break;

        case url.indexOf('amazon.fr') > 0:
            json_data = {
                'marketplaceID': 'A13V1IB3VIYZZH',
                'keepa_market_id': '4',
                'post_code': '30560',
                'site_code': 'FR',
            };
            break;

        case url.indexOf('amazon.it') > 0:
            json_data = {
                'marketplaceID': 'APJ6JRA9NG5V4',
                'keepa_market_id': '8',
                'post_code': '55049',
                'site_code': 'IT',
            };
            break;
        case url.indexOf('amazon.co.jp') > 0:
            json_data = {
                'marketplaceID': 'A1VC38T7YXB528',
                'keepa_market_id': '5',
                'post_code': '197-0408',
                'site_code': 'JP',
            };
            break;
        case url.indexOf('amazon.com.au') > 0:
            json_data = {
                'marketplaceID': 'A39IBJ37TRP1C6',
                'keepa_market_id': '13',
                'post_code': '0200-0299',
                'site_code': 'AU',
            };
            break;
        default:
            json_data = {
                'marketplaceID': 'null',
                'keepa_market_id': 'null',
                'post_code': 'null',
                'site_code': 'null',
            };
            break;
    }
    return json_data;
}

// 发送网络请求[前端专用]
function get_content(url, data = '', mode = 'GET', type = 'html') {
    console.log(`-> get_content mode:${mode} type:${type} url:${url}`);
    console.log(`-> get_content data:${data}`);
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(mode, url, false);
    if (type == 'json') {
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    } else {
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    }
    xmlHttpRequest.send(data);
    console.log('-> get_content -> 获取数据成功');
    return xmlHttpRequest.responseText;
}

// 获取HTML模板[前端专用]
function get_template_html(chrome_url) {
    template_html = eval('`' + get_content(chrome_url, type = 'html') + '`');
    return template_html;
}
// 获取指定格式的日期
function get_date(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

// 判断框架页面是否加载完毕
function get_frame_loading_finished(frame_page) {
    for (current_page = 1; current_page <= frame_page; current_page++) {
        if (frames[current_page - 1].document.readyState != `complete` && frames[current_page - 1].document.readyState != `interactive`) {
            status = true;
            vue.$notification.open({
                message: `框架全部页面未完成加载`,
                description: `第${current_page}页 状态 : ${frames[current_page - 1].document.readyState}`,
                placement: 'bottomRight',
            });
            return false;
        }
    }
    return true;
}

function get_asin_keyword_main() {
    target_asin = get_query_variable('asin');
    keywords = get_query_variable('keywords').split(',');
    if (get_frame_loading_finished(keywords.length)) {
        for (let keywords_index = 0; keywords_index < keywords.length; keywords_index++) {
            htm_code = frames[keywords_index].document.body.innerHTML;
            product_count = 0;
            nt_product_count = 0;
            ad_product_count = 0;
            $(`[id="${keywords[keywords_index]}_ad_rank"]`).html(`第1页 无`);
            $(`[id="${keywords[keywords_index]}_ad_independent_rank"]`).html(`第1页 无`);
            $(`[id="${keywords[keywords_index]}_nt_rank"]`).html(`第1页 无`);
            $(`[id="${keywords[keywords_index]}_nt_independent_rank"]`).html(`第1页 无`);
            s_search_result = $(htm_code).find("div[data-component-type='s-search-result']");
            for (let search_index = 0; search_index < s_search_result.length; search_index++) {
                product_count += 1;
                asin = $(s_search_result[search_index]).attr('data-asin');
                sponsored = $(s_search_result[search_index]).find('.a-size-mini.a-color-secondary').text();
                sponsored == 'Sponsored' ? ad_product_count += 1 : nt_product_count += 1;
                if (target_asin === asin) {
                    if (sponsored === 'Sponsored') {
                        $(`[id="${keywords[keywords_index]}_ad_rank"]`).html(`第1页第${product_count}位`);
                        $(`[id="${keywords[keywords_index]}_ad_independent_rank"]`).html(`第1页第${ad_product_count}位`);
                    } else {
                        $(`[id="${keywords[keywords_index]}_nt_rank"]`).html(`第1页第${product_count}位`);
                        $(`[id="${keywords[keywords_index]}_nt_independent_rank"]`).html(`第1页第${nt_product_count}位`);
                    }
                }
            }
        }
    }

}

function get_amazon_search_page_result(html_list) {
    // 初始化总排名计算变量
    total_product_count = 0;
    total_nt_product_count = 0;
    total_ad_product_count = 0;
    table_code_list = [
        [
            'ASIN',
            '主图',
            '标题',
            '价格',
            '是否FBA',
            '评论数',
            '评分',
            '类型',
            '页码',
            '页面排名',
            '总排名',
            '是否广告',
            '页面自然排名',
            '页面广告排名',
            '单独自然排名',
            '单独广告排名',
            'Bestseller',
            'Amazon\'s Choice'
        ]
    ];
    table_code_rink_list = [
        [
            '日期',
            '站点',
            'ASIN',
            '关键词',
            '自然排名',
            '广告排名',
            '单独自然排名',
            '单独广告排名',

        ]
    ];
    table_code_data = [];
    table_code_rink_data = [];
    // 循环读取页面的所有框架
    for (current_page = 1; current_page <= html_list.length; current_page++) {
        // 初始化排名计算变量
        product_count = 0;
        nt_product_count = 0;
        ad_product_count = 0;
        // 获取当前框架的源码
        htm_code = html_list[current_page - 1];
        s_search_result = $(htm_code).find("div[data-component-type='s-search-result']");
        for (let search_index = 0; search_index < s_search_result.length; search_index++) {
            product_count += 1;
            total_product_count += 1;
            asin = $(s_search_result[search_index]).attr('data-asin');
            title = $(s_search_result[search_index]).find('a.a-link-normal.a-text-normal > span.a-color-base.a-text-normal').text();
            image = $(s_search_result[search_index]).find('div.a-section.aok-relative > img.s-image ').attr('src');
            sponsored = $(s_search_result[search_index]).find('.a-size-mini.a-color-secondary').text();
            spon_code = sponsored == 'Sponsored' ? `广告` : '';
            rank_sign = sponsored == 'Sponsored' ? `AD` : 'NT';
            sponsored == 'Sponsored' ? ad_product_count += 1 : nt_product_count += 1;
            sponsored == 'Sponsored' ? total_ad_product_count += 1 : total_nt_product_count += 1;
            reviews = $(s_search_result[search_index]).find('div.a-row.a-size-small > span > a > span.a-size-base').text();
            rating = $(s_search_result[search_index]).find('.a-icon-alt').text().substring(0, 3);
            price = $(s_search_result[search_index]).find('span[data-a-color="base"].a-price > span.a-offscreen').text();
            choice_code = $(s_search_result[search_index]).find('div.a-section.a-spacing-micro.s-min-height-small > span').attr('aria-label');
            choice_code = choice_code != undefined ? `Amazon's Choice` : '';
            bsr_code = $(s_search_result[search_index]).find('span[data-a-badge-color="sx-orange"] > span > span.a-badge-text').text();
            prime_code = $(s_search_result[search_index]).find('i.a-icon-prime').attr('aria-label');
            code_data = {
                'asin': asin,
                'image': image,
                'title': title,
                'price': price,
                'prime_code': prime_code,
                'reviews': reviews,
                'rating': rating,
                'rank_sign': rank_sign,
                'current_page': current_page,
                'product_count': product_count,
                'total_product_count': total_product_count,
                'spon_code': spon_code,
                'nt_product_count': nt_product_count,
                'ad_product_count': ad_product_count,
                'total_nt_product_count': total_nt_product_count,
                'total_ad_product_count': total_ad_product_count,
                'bsr_code': bsr_code,
                'choice_code': choice_code,
            };
            table_code_data.push(code_data);
            table_code_list.push(Object.keys(code_data).map(key => code_data[key]));
        }
    }
    // for (let asins_index = 0; asins_index < asins.length; asins_index++) {
    //     asin_current = asins[asins_index];
    //     // 获取Asin的自然排名
    //     asin_a_nt_page = $(`#${asins[asins_index]}_NT_P`).text();
    //     asin_a_nt_rank = $(`#${asins[asins_index]}_NT_R`).text();
    //     asin_a_nt_total_rank = $(`#${asins[asins_index]}_Total`).text();
    //     asin_a_nt_independent_rank = $(`#${asins[asins_index]}_NT_independent_R`).text();
    //     asin_a_nt_independent_total_rank = $(`#${asins[asins_index]}_independent_Total`).text();
    //     // 获取Asin的广告排名
    //     asin_a_ad_page = $(`#${asins[asins_index]}_AD_P`).text();
    //     asin_a_ad_rank = $(`#${asins[asins_index]}_AD_R`).text();
    //     asin_a_ad_total_rank = $(`#${asins[asins_index]}_Total`).text();
    //     asin_a_ad_independent_rank = $(`#${asins[asins_index]}_AD_independent_R`).text();
    //     asin_a_ad_independent_total_rank = $(`#${asins[asins_index]}_independent_Total`).text();
    //     // 组合成字符串
    //     asin_a_nt_total = `第${asin_a_nt_page}页第${asin_a_nt_rank}位[${asin_a_nt_total_rank}]`;
    //     asin_a_ad_total = `第${asin_a_ad_page}页第${asin_a_ad_rank}位[${asin_a_ad_total_rank}]`;
    //     asin_a_nt_independent_total = `第${asin_a_nt_page}页第${asin_a_nt_independent_rank}位[${asin_a_nt_independent_total_rank}]`;
    //     asin_a_ad_independent_total = `第${asin_a_ad_page}页第${asin_a_ad_independent_rank}位[${asin_a_ad_independent_total_rank}]`;
    //     // 验证 组合成字符串的字符串
    //     asin_a_nt_total = asin_a_nt_total.indexOf('第页') > -1 ? '无' : asin_a_nt_total;
    //     asin_a_ad_total = asin_a_ad_total.indexOf('第页') > -1 ? '无' : asin_a_ad_total;
    //     asin_a_nt_independent_total = asin_a_nt_independent_total.indexOf('第页') > -1 ? '无' : asin_a_nt_independent_total;
    //     asin_a_ad_independent_total = asin_a_ad_independent_total.indexOf('第页') > -1 ? '无' : asin_a_ad_independent_total;
    //     code_data = {
    //         'date': date,
    //         'site_code': site_code,
    //         'asin_current': asin_current,
    //         'keyword': keyword,
    //         'asin_a_nt_total': asin_a_nt_total,
    //         'asin_a_ad_total': asin_a_ad_total,
    //         'asin_a_nt_independent_total': asin_a_nt_independent_total,
    //         'asin_a_ad_independent_total': asin_a_ad_independent_total,
    //     };
    //     table_code_rink_data.push(code_data);
    //     table_code_rink_list.push(Object.keys(code_data).map(key => code_data[key]));
    // }
}

function get_amazon_keyword_ranking(download_excel) {
    // 获取当天日期
    date = get_date("YYYY-mm-dd", new Date());
    // 获取 Amazon 站点的 代码
    site_code = get_amazon_conifg(location.href).site_code;
    // 获取 Amazon 站点的 marketplaceId
    marketplaceId = get_amazon_conifg(location.href).marketplaceID;
    // 获取当前页面的Asin数组
    asins = get_query_variable('asins').split(',');
    // 获取当前页面的关键词
    keyword = get_query_variable('keyword');
    // 获取当前页面的框架数量
    total_page = get_query_variable('page');
    if (get_frame_loading_finished(total_page)) {
        message_key = 'get_amazon_keyword_ranking';
        vue.$message.loading({
            content: '亚马逊页面解析中',
            key: message_key,
            duration: 0
        });
        // 初始化总排名计算变量
        total_product_count = 0;
        total_nt_product_count = 0;
        total_ad_product_count = 0;
        table_code_list = [
            [
                'ASIN',
                '主图',
                '标题',
                '价格',
                '是否FBA',
                '评论数',
                '评分',
                '类型',
                '页码',
                '页面排名',
                '总排名',
                '是否广告',
                '页面自然排名',
                '页面广告排名',
                '单独自然排名',
                '单独广告排名',
                'Bestseller',
                'Amazon\'s Choice'
            ]
        ];
        table_code_rink_list = [
            [
                '日期',
                '站点',
                'ASIN',
                '关键词',
                '自然排名',
                '广告排名',
                '单独自然排名',
                '单独广告排名',

            ]
        ];
        table_code_data = [];
        table_code_rink_data = [];
        // 循环读取页面的所有框架
        for (current_page = 1; current_page <= total_page; current_page++) {
            // 初始化排名计算变量
            product_count = 0;
            nt_product_count = 0;
            ad_product_count = 0;
            // 获取当前框架的源码
            htm_code = frames[current_page - 1].document.body.innerHTML;
            s_search_result = $(htm_code).find("div[data-component-type='s-search-result']");
            for (let search_index = 0; search_index < s_search_result.length; search_index++) {
                product_count += 1;
                total_product_count += 1;
                asin = $(s_search_result[search_index]).attr('data-asin');
                title = $(s_search_result[search_index]).find('a.a-link-normal.a-text-normal > span.a-color-base.a-text-normal').text();
                image = $(s_search_result[search_index]).find('div.a-section.aok-relative > img.s-image ').attr('src');
                sponsored = $(s_search_result[search_index]).find('.a-size-mini.a-color-secondary').text();
                spon_code = sponsored == 'Sponsored' ? `广告` : '';
                rank_sign = sponsored == 'Sponsored' ? `AD` : 'NT';
                sponsored == 'Sponsored' ? ad_product_count += 1 : nt_product_count += 1;
                sponsored == 'Sponsored' ? total_ad_product_count += 1 : total_nt_product_count += 1;
                reviews = $(s_search_result[search_index]).find('div.a-row.a-size-small > span > a > span.a-size-base').text();
                rating = $(s_search_result[search_index]).find('.a-icon-alt').text().substring(0, 3);
                price = $(s_search_result[search_index]).find('span[data-a-color="base"].a-price > span.a-offscreen').text();
                choice_code = $(s_search_result[search_index]).find('div.a-section.a-spacing-micro.s-min-height-small > span').attr('aria-label');
                choice_code = choice_code != undefined ? `Amazon's Choice` : '';
                bsr_code = $(s_search_result[search_index]).find('span[data-a-badge-color="sx-orange"] > span > span.a-badge-text').text();
                prime_code = $(s_search_result[search_index]).find('i.a-icon-prime').attr('aria-label');
                code_data = {
                    'asin': asin,
                    'image': image,
                    'title': title,
                    'price': price,
                    'prime_code': prime_code,
                    'reviews': reviews,
                    'rating': rating,
                    'rank_sign': rank_sign,
                    'current_page': current_page,
                    'product_count': product_count,
                    'total_product_count': total_product_count,
                    'spon_code': spon_code,
                    'nt_product_count': nt_product_count,
                    'ad_product_count': ad_product_count,
                    'total_nt_product_count': total_nt_product_count,
                    'total_ad_product_count': total_ad_product_count,
                    'bsr_code': bsr_code,
                    'choice_code': choice_code,
                };
                table_code_data.push(code_data);
                table_code_list.push(Object.keys(code_data).map(key => code_data[key]));
            }
        }
        vue.table_code_list_data = table_code_data;
        for (let asins_index = 0; asins_index < asins.length; asins_index++) {
            asin_current = asins[asins_index];
            // 获取Asin的自然排名
            asin_a_nt_page = $(`#${asins[asins_index]}_NT_P`).text();
            asin_a_nt_rank = $(`#${asins[asins_index]}_NT_R`).text();
            asin_a_nt_total_rank = $(`#${asins[asins_index]}_Total`).text();
            asin_a_nt_independent_rank = $(`#${asins[asins_index]}_NT_independent_R`).text();
            asin_a_nt_independent_total_rank = $(`#${asins[asins_index]}_independent_Total`).text();
            // 获取Asin的广告排名
            asin_a_ad_page = $(`#${asins[asins_index]}_AD_P`).text();
            asin_a_ad_rank = $(`#${asins[asins_index]}_AD_R`).text();
            asin_a_ad_total_rank = $(`#${asins[asins_index]}_Total`).text();
            asin_a_ad_independent_rank = $(`#${asins[asins_index]}_AD_independent_R`).text();
            asin_a_ad_independent_total_rank = $(`#${asins[asins_index]}_independent_Total`).text();
            // 组合成字符串
            asin_a_nt_total = `第${asin_a_nt_page}页第${asin_a_nt_rank}位[${asin_a_nt_total_rank}]`;
            asin_a_ad_total = `第${asin_a_ad_page}页第${asin_a_ad_rank}位[${asin_a_ad_total_rank}]`;
            asin_a_nt_independent_total = `第${asin_a_nt_page}页第${asin_a_nt_independent_rank}位[${asin_a_nt_independent_total_rank}]`;
            asin_a_ad_independent_total = `第${asin_a_ad_page}页第${asin_a_ad_independent_rank}位[${asin_a_ad_independent_total_rank}]`;
            // 验证 组合成字符串的字符串
            asin_a_nt_total = asin_a_nt_total.indexOf('第页') > -1 ? '无' : asin_a_nt_total;
            asin_a_ad_total = asin_a_ad_total.indexOf('第页') > -1 ? '无' : asin_a_ad_total;
            asin_a_nt_independent_total = asin_a_nt_independent_total.indexOf('第页') > -1 ? '无' : asin_a_nt_independent_total;
            asin_a_ad_independent_total = asin_a_ad_independent_total.indexOf('第页') > -1 ? '无' : asin_a_ad_independent_total;
            code_data = {
                'date': date,
                'site_code': site_code,
                'asin_current': asin_current,
                'keyword': keyword,
                'asin_a_nt_total': asin_a_nt_total,
                'asin_a_ad_total': asin_a_ad_total,
                'asin_a_nt_independent_total': asin_a_nt_independent_total,
                'asin_a_ad_independent_total': asin_a_ad_independent_total,
            };
            table_code_rink_data.push(code_data);
            table_code_rink_list.push(Object.keys(code_data).map(key => code_data[key]));
        }
        vue.table_code_rink_list_data = table_code_rink_data;
        $("#iframe_list").remove();
        if (download_excel) {
            var table_code_list_sheet = XLSX.utils.aoa_to_sheet(table_code_list);
            var table_code_rink_list_sheet = XLSX.utils.aoa_to_sheet(table_code_rink_list);
            openDownloadDialog(sheet_to_blob(table_code_list_sheet), keyword + ' 页面情况.xlsx');
            openDownloadDialog(sheet_to_blob(table_code_rink_list_sheet), keyword + ' 排名情况.xlsx');
        }
        vue.$message.success({
            content: '亚马逊页面解析完成',
            key: message_key,
            duration: 2
        });

    }
}

function get_amazon_search_page_keepa() {
    keyword = document.getElementById(`twotabsearchtextbox`).value;
    search_count_code = $(document.body.innerHTML).find("div[data-component-type='s-search-result']").length;
    get_amazon_search_page_result([document.body.innerHTML]);
    vue.table_code_data = table_code_data;
    console.log(table_code_data);
}