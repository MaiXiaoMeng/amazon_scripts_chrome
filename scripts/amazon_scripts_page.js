eval($('#initialize').text());

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
    json_data = {};
    switch (true) {
        case url.indexOf('amazon.com/') > 0:
            json_data['marketplaceID'] = 'ATVPDKIKX0DER';
            json_data['post_code'] = '10002';
            json_data['site_code'] = 'US';
            break;
        case url.indexOf('amazon.ca') > 0:
            json_data['marketplaceID'] = 'A2EUQ1WTGCTBG2';
            json_data['post_code'] = 'A1B 2C3';
            json_data['site_code'] = 'CA';
            break;
        case url.indexOf('amazon.com.mx') > 0:
            json_data['marketplaceID'] = 'A1AM78C64UM0Y8';
            json_data['post_code'] = '77580';
            json_data['site_code'] = 'MX';
            break;
        case url.indexOf('amazon.co.uk') > 0:
            json_data['marketplaceID'] = 'A1F83G8C2ARO7P';
            json_data['post_code'] = 'SW17%209NT';
            json_data['site_code'] = 'UK';
            break;
        case url.indexOf('amazon.de') > 0:
            json_data['marketplaceID'] = 'A1PA6795UKMFR9';
            json_data['post_code'] = '89233';
            json_data['site_code'] = 'DE';
            break;
        case url.indexOf('amazon.es') > 0:
            json_data['marketplaceID'] = 'A1RKKUPIHCS9HS';
            json_data['post_code'] = '30560';
            json_data['site_code'] = 'ES';
            break;
        case url.indexOf('amazon.fr') > 0:
            json_data['marketplaceID'] = 'A13V1IB3VIYZZH';
            json_data['post_code'] = '30560';
            json_data['site_code'] = 'FR';
            break;
        case url.indexOf('amazon.it') > 0:
            json_data['marketplaceID'] = 'APJ6JRA9NG5V4';
            json_data['post_code'] = '55049';
            json_data['site_code'] = 'IT';
            break;
        case url.indexOf('amazon.co.jp') > 0:
            json_data['marketplaceID'] = 'A1VC38T7YXB528';
            json_data['post_code'] = '197-0408';
            json_data['site_code'] = 'JP';
            break;
        case url.indexOf('amazon.com.au') > 0:
            json_data['marketplaceID'] = 'A39IBJ37TRP1C6';
            json_data['post_code'] = 'ATVPDKIKX0DER';
            json_data['site_code'] = 'AU';
            break;
        default:
            json_data['marketplaceID'] = 'null';
            json_data['post_code'] = 'null';
            json_data['site_code'] = 'null';
            break;
    }
    return json_data
}

// 发送网络请求[前端专用]
function get_content(url, data = '', mode = 'GET', type = 'html') {
    console.log(`-> get_content mode:${mode} type:${type} url:${url}`);
    console.log(`-> get_content data:${data}`);
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(mode, url, false);
    if (type = 'json') {
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
        };
    };
    return fmt;
}


function get_asin_keyword_main() {
    exd = `2025-5-1`;
    update_info = `此功能需联系作者开通使用 作者QQ: 369593212`;

    target_asin = get_query_variable('asin');
    keywords = get_query_variable('keywords').split(',');
    is_complete = 1;

    for (let keywords_index = 0; keywords_index < keywords.length; keywords_index++) {
        if (frames[keywords_index].document.readyState != `complete` && frames[keywords_index].document.readyState != `interactive`) {
            if (is_complete == 0x1) {
                alert(keywords[keywords_index] + `页面还在加载`);
            }
            is_complete = 0;
        } else {
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
                        $(`[id="${keywords[keywords_index]}_ad_independent_rank"]`).html(`第1页第${ad_product_count}位`)
                    } else {
                        $(`[id="${keywords[keywords_index]}_nt_rank"]`).html(`第1页第${product_count}位`);
                        $(`[id="${keywords[keywords_index]}_nt_independent_rank"]`).html(`第1页第${nt_product_count}位`);
                    }
                }
            }
        }
    }
}

function get_amazon_keyword_ranking() {
    // 获取当天日期
    date = get_date("YYYY-mm-dd", new Date());
    // 获取 Amazon 站点的 代码
    site_code = get_amazon_conifg(location.href).site_code;
    // 获取 Amazon 站点的 marketplaceId
    marketplaceId = get_amazon_conifg(location.href).marketplaceID;
    // 获取当前页面的关键词
    keyword = $('#keyword').text();
    // 获取当前页面的框架数量
    total_page = Number($('#page').text());
    // 初始化总排名计算变量
    total_product_count = 0;
    total_nt_product_count = 0;
    total_ad_product_count = 0;
    // 初始化判断框架是否全部加载完成变量
    not_complete = 0;
    table_code = get_template_html(template.amazon_search_asin_table_haed);
    // 循环读取页面的所有框架
    for (current_page = 1; current_page <= total_page; current_page++) {
        // 判断框架页面是否加载完毕
        if (frames[current_page - 1].document.readyState != `complete` && frames[current_page - 1].document.readyState != `interactive`) {
            not_complete = 1;
            alert(`第${current_page}页数据还在加载 状态 : ${frames[current_page - 1].document.readyState}`);
            break;
        }
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
            spon_code = sponsored == 'Sponsored' ? `<font color=red><b>广告</b></font>` : '';
            rank_sign = sponsored == 'Sponsored' ? `AD` : 'NT';
            sponsored == 'Sponsored' ? ad_product_count += 1 : nt_product_count += 1;
            sponsored == 'Sponsored' ? total_ad_product_count += 1 : total_nt_product_count += 1;
            reviews = $(s_search_result[search_index]).find('div.a-row.a-size-small > span > a > span.a-size-base').text();
            rating = $(s_search_result[search_index]).find('.a-icon-alt').text().substring(0, 3);
            price = $(s_search_result[search_index]).find('span[data-a-color="base"].a-price > span.a-offscreen').text();
            choice_code = $(s_search_result[search_index]).find('div.a-section.a-spacing-micro.s-min-height-small > span').attr('aria-label');
            choice_code = choice_code != undefined ? `<font style="background: #135753; color:white;">Amazon's Choice</font>` : '';
            bsr_code = $(s_search_result[search_index]).find('span[data-a-badge-color="sx-orange"] > span > span.a-badge-text').text();
            bsr_code = bsr_code == 'Best Seller' ? `<font style="background: #DAA520; color:white;">Best&nbsp;&nbsp;Seller</font>` : '';
            prime_code = $(s_search_result[search_index]).find('i.a-icon-prime').attr('aria-label');
            prime_code = prime_code == 'Amazon Prime' ? `<font style="color: #009ED6;"><b>prime</b></font>` : ''
            table_code += get_template_html(template.amazon_search_asin_table);
        }
    }
    asin_table_code = get_template_html(template.amazon_search_asin_table_rank_haed);
    asin_export_code = `日期,站点,ASIN,关键词,自然排名,广告排名,单独自然排名,单独广告排名`;
    asins = $('#asin').text().split(',');
    for (let asins_index = 0; asins_index < asins.length; asins_index++) {
        asin_current = asins[asins_index];
        // 获取Asin的自然排名
        asin_a_nt_page = $(table_code).find(`td#${asins[asins_index]}_NT_P`).text();
        asin_a_nt_rank = $(table_code).find(`td#${asins[asins_index]}_NT_R`).text();
        asin_a_nt_total_rank = $(table_code).find(`td#${asins[asins_index]}_Total`).text();
        asin_a_nt_independent_rank = $(table_code).find(`td#${asins[asins_index]}_NT_independent_R`).text();
        asin_a_nt_independent_total_rank = $(table_code).find(`td#${asins[asins_index]}_independent_Total`).text();
        // 获取Asin的广告排名
        asin_a_ad_page = $(table_code).find(`td#${asins[asins_index]}_AD_P`).text();
        asin_a_ad_rank = $(table_code).find(`td#${asins[asins_index]}_AD_R`).text();
        asin_a_ad_total_rank = $(table_code).find(`td#${asins[asins_index]}_Total`).text();
        asin_a_ad_independent_rank = $(table_code).find(`td#${asins[asins_index]}_AD_independent_R`).text();
        asin_a_ad_independent_total_rank = $(table_code).find(`td#${asins[asins_index]}_independent_Total`).text();
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
        asin_table_code += get_template_html(template.amazon_search_asin_table_rank);
        asin_export_code += `\n${date},${site_code},${asins[asins_index]},${keyword},${asin_a_nt_total},${asin_a_ad_total}, ${asin_a_nt_independent_total},${asin_a_ad_independent_total}`;
    }

    if (not_complete == 0) {
        document.body.innerHTML = `
        <a style = "text-decoration:none;" download = "关键词排名查询结果.csv" href = "data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(asin_export_code)}" >
            <input type = "button" value = "导出查询结果" > 
        </a>
        <table style="font-size: 12.0px;">${asin_table_code}</table > 
        <hr noshade = "noshade" size = 1 >
        <table style = "font-size: 12.0px;">${table_code}</table>`;
    };

};