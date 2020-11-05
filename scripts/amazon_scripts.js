/* jshint esversion: 6 */

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
})()

// 设置 亚马逊的 区号
function set_amazon_postcode() {
    if (get_query_variable('postcode')) {
        post_code = get_query_variable('postcode');
        htm_code = get_content(`https://${document.domain}/gp/delivery/ajax/address-change.html?actionSource=glow&deviceType=web&locationType=LOCATION_INPUT&pageType=Gateway&storeContext=generic&zipCode=${post_code}`);
    }
}
// 发送 网络请求
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

// 获取 HTML 模板
function get_template_html(url, mode = '') {
    chrome_url = chrome.extension.getURL(url);
    template_html = get_content(chrome_url, type = 'html');
    response = typeof response == 'undefined' ? JSON.stringify({}) : response;
    template_html = template_html.replace("var vue_debug = true;", "var vue_debug = false;");
    template_html = template_html.replace("response = `${response}`", "response = ${response}");
    template_html = eval('`' + template_html + '`');
    if (mode === 'body') {
        body_html = /<body>([\s\S]*?)<\/body>/.exec(template_html)[0];
        script_html = /<script id="initialize">([\s\S]*?)<\/script>/.exec(template_html)[0];
        template_html = body_html + script_html;
    }
    return template_html;
}

// 解析 helium10 的 JSON 数据
function get_helium10_json(asin, marketplaceId) {
    console.log(`-> get_helium10_json( ${asin} , ${marketplaceId} )`);
    htm_json = JSON.parse(get_content(`https://members.helium10.com/extension/calculator-json?price=10&asin=${asin}&marketplaceId=${marketplaceId}`, type = 'html'));
    console.log(htm_json);
    if (htm_json.status == false) {
        // layer.msg(' 请先登录 helium10 ');
        console.log('-> get_helium10_json -> 请先登录 helium10');
    } else {
        // 解析图片链接
        image = htm_json.product.AttributeSets.ItemAttributes.SmallImage.URL;
        image = image.replace('_SL75_.', '').replace('http://ecx.images-amazon.com', 'https://images-na.ssl-images-amazon.com');
        console.log(`-> image:${image}`);

        // 解析产品标题
        title = htm_json.product.AttributeSets.ItemAttributes.Title;
        console.log(`-> title:${title}`);

        // 解析品牌名称
        brand_name = htm_json.product.AttributeSets.ItemAttributes.Brand;
        console.log(`-> brand_name:${brand_name}`);

        // 解析包装尺寸
        if (htm_json.product.AttributeSets.ItemAttributes.hasOwnProperty('PackageDimensions')) {
            package_height = Number(htm_json.product.AttributeSets.ItemAttributes.PackageDimensions.Height).toFixed(1);
            package_length = Number(htm_json.product.AttributeSets.ItemAttributes.PackageDimensions.Length).toFixed(1);
            package_width = Number(htm_json.product.AttributeSets.ItemAttributes.PackageDimensions.Width).toFixed(1);
            package_weight = Number(htm_json.product.AttributeSets.ItemAttributes.PackageDimensions.Weight).toFixed(1);
            package_dim = package_height + '*' + package_length + '*' + package_width;
            console.log(`-> package_height:${package_height} package_length:${package_length} package_width:${package_width} package_weight:${package_weight}`);
            console.log(`-> package_dim:${package_dim}`);
        }
        // 解析产品尺寸
        if (htm_json.product.AttributeSets.ItemAttributes.hasOwnProperty('ItemDimensions')) {
            item_height = Number(htm_json.product.AttributeSets.ItemAttributes.ItemDimensions.Height).toFixed(1);
            item_length = Number(htm_json.product.AttributeSets.ItemAttributes.ItemDimensions.Length).toFixed(1);
            item_width = Number(htm_json.product.AttributeSets.ItemAttributes.ItemDimensions.Width).toFixed(1);
            item_weight = Number(htm_json.product.AttributeSets.ItemAttributes.ItemDimensions.Weight).toFixed(1);
            item_dim = item_height + '*' + item_length + '*' + item_width;
            console.log(`-> item_height:${item_height} item_length:${item_length} item_width:${item_width} item_weight:${item_weight}`);
            console.log(`-> item_dim:${item_dim}`);
        }

        // 解析大类类目名称和排名
        if (htm_json.product.SalesRankings.SalesRank.length > 0) {
            big_cat = htm_json.product.SalesRankings.SalesRank[0].ProductCategoryId.split('_')[0];
            big_bsr = htm_json.product.SalesRankings.SalesRank[0].Rank;
            console.log(`-> big_cat:${big_cat} big_bsr:${big_bsr}`);
        }

        // 解析小类类目名称和排名
        small_cat = '';
        small_bsr = '';
        for (var i in htm_json.bsrList) {
            small_cat += i + '\n';
            small_bsr += htm_json.bsrList[i] + '\n';
        }
        console.log(`-> small_cat:${small_cat}-> small_bsr:${small_bsr}`);

        // 解析亚马逊的服务费用
        for (var dict in htm_json.feeEstimateFbaListArray) {
            list = htm_json.feeEstimateFbaListArray[dict];
            if (list.type == 'FBA Fulfillment Fees') {
                // 解析亚马逊的运费费用
                fba_fee = list.amount;
                console.log(`-> fba_fee:${fba_fee}`);
            }
        }

        // ASIN 的信息
        information = [
            {
                "key": "ASIN:",
                "value": typeof asin == 'undefined' ? 'null' : asin,
            },
            {
                "key": "品牌名:",
                "value": typeof brand_name == 'undefined' ? 'null' : brand_name,
            },
            {
                "key": "大类:",
                "value": typeof big_cat == 'undefined' ? 'null' : big_cat,
            },
            {
                "key": "大类BSR:",
                "value": typeof big_bsr == 'undefined' ? 'null' : big_bsr,
            },
            {
                "key": "小类:",
                "value": typeof small_cat == 'undefined' ? 'null' : small_cat,
            },
            {
                "key": "小类BSR:",
                "value": typeof small_bsr == 'undefined' ? 'null' : small_bsr,
            },
            {
                "key": "包装尺寸(inch):",
                "value": typeof package_dim == 'undefined' ? typeof item_dim == 'undefined' ? 'null' : item_dim : package_dim,
            },
            {
                "key": "重量(lbs):",
                "value": typeof package_weight == 'undefined' ? typeof item_weight == 'undefined' ? 'null' : item_weight : package_weight,
            },
            {
                "key": "FBA费用:",
                "value": typeof fba_fee == 'undefined' ? 'null' : fba_fee,
            }
        ];

        // 解析销量
        htm_code = get_content(`https://members.helium10.com/black-box/sales-chart?days=0&asin=${asin}&marketplace=${marketplaceId}`, type = 'html');
        json_code = /var data = (.*?);/.exec(htm_code)[1];
        htm_json = JSON.parse(json_code);
        console.log(htm_json);
        if (htm_json.status != "success") {
            console.log('-> get_helium10_json -> 请先登录 helium10');
        } else {
            monthly_sales = {};
            day_sales = {};

            w1_sale = 0;
            w2_sale = 0;
            w3_sale = 0;
            w4_sale = 0;
            h24_sale = Number(htm_json.sales[htm_json.sales.length - 1].y);
            for (var sales_index in htm_json.sales) {
                monthly = moment(new Date(htm_json.sales[sales_index].x)).format('YYYY-MM');
                day_1 = moment(new Date(htm_json.sales[sales_index].x)).format('YYYY-MM-DD');
                day_2 = moment(new Date()).format('YYYY-MM');
                sales = htm_json.sales[sales_index].y;
                monthly_sales[monthly] == undefined ? monthly_sales[monthly] = sales : monthly_sales[monthly] += sales;
                day_sales[day_1] = sales;

                d1 = new Date().setTime(Number(htm_json.sales[sales_index].x));
                d2 = new Date(new Date().getFullYear() + '-' + Number(new Date().getMonth() + 1) + '-' + new Date().getDate()).getTime();
                day_s = Number((d2 - d1) / 1000 / 60 / 60 / 24).toFixed(2);
                switch (true) {
                    case day_s < 6.5:
                        w1_sale += Number(htm_json.sales[sales_index].y);
                        continue;
                    case day_s < 13.5:
                        w2_sale += Number(htm_json.sales[sales_index].y);
                        continue;
                    case day_s < 20.5:
                        w3_sale += Number(htm_json.sales[sales_index].y);
                        continue;
                    case day_s < 27.5:
                        w4_sale += Number(htm_json.sales[sales_index].y);
                        continue;
                }
            }
            h24_sale = w1_sale == 0 ? 0 : h24_sale;
            sales_days = (new Date().setTime(Number(htm_json.sales[htm_json.sales.length - 1].x) - new Date().setTime(Number(htm_json.sales[0].x))) / 1000 / 60 / 60 / 24);

            monthly_sales_length = Object.keys(monthly_sales).length;
            monthly_sales_value = Object.keys(monthly_sales).map(key => monthly_sales[key]);
            day_sales_length = Object.keys(day_sales).length;
            day_sales_value = Object.keys(day_sales).map(key => day_sales[key]);
            if (monthly_sales_length > 30) {
                monthly_sales_max = Math.max.apply(null, monthly_sales_value.slice(monthly_sales_length - 30));
            } else {
                monthly_sales_max = Math.max.apply(null, monthly_sales_value);
            }
            if (day_sales_length > 30) {
                day_sales_max = Math.max.apply(null, day_sales_value.slice(day_sales_length - 30));
            } else {
                day_sales_max = Math.max.apply(null, day_sales_value);
            }
        }

        json_data = {
            'asin': typeof asin == 'undefined' ? 'null' : asin,
            'marketplaceId': typeof marketplaceId == 'undefined' ? 'null' : marketplaceId,
            'image': typeof image == 'undefined' ? 'null' : image,
            'title': typeof title == 'undefined' ? 'null' : title,
            'brand_name': typeof brand_name == 'undefined' ? 'null' : brand_name,
            "big_cat": typeof big_cat == 'undefined' ? 'null' : big_cat,
            "big_bsr": typeof big_bsr == 'undefined' ? 'null' : big_bsr,
            "small_cat": typeof small_cat == 'undefined' ? 'null' : small_cat,
            "small_bsr": typeof small_bsr == 'undefined' ? 'null' : small_bsr,
            "dim": typeof package_dim == 'undefined' ? typeof item_dim == 'undefined' ? 'null' : item_dim : package_dim,
            "weight": typeof package_weight == 'undefined' ? typeof item_weight == 'undefined' ? 'null' : item_weight : package_weight,
            "fba_fee": typeof fba_fee == 'undefined' ? 'null' : fba_fee,
            "h24_sale": typeof h24_sale == 'undefined' ? 'null' : h24_sale.toFixed(1),
            "w1_sale": typeof w1_sale == 'undefined' ? 'null' : w1_sale.toFixed(1),
            "w2_sale": typeof w2_sale == 'undefined' ? 'null' : w2_sale.toFixed(1),
            "w3_sale": typeof w3_sale == 'undefined' ? 'null' : w3_sale.toFixed(1),
            "w4_sale": typeof w4_sale == 'undefined' ? 'null' : w4_sale.toFixed(1),
            "w4eek_sum_sale": Number(w1_sale + w2_sale + w3_sale + w4_sale).toFixed(1),
            "sales_days": typeof sales_days == 'undefined' ? 'null' : sales_days.toFixed(1),
            "monthly_sales": typeof monthly_sales == 'undefined' ? 'null' : monthly_sales,
            "monthly_sales_length": typeof monthly_sales_length == 'undefined' ? 'null' : monthly_sales_length,
            "monthly_sales_max": typeof monthly_sales_max == 'undefined' ? 'null' : monthly_sales_max,
            "day_sales": typeof monthly_sales == 'undefined' ? 'null' : day_sales,
            "day_sales_length": typeof day_sales_length == 'undefined' ? 'null' : day_sales_length,
            "day_sales_max": typeof day_sales_max == 'undefined' ? 'null' : day_sales_max,
            "information": typeof information == 'undefined' ? 'null' : information
        };
    }
    console.log(json_data);
    return json_data;
}

// 向 background.js 发送消息
chrome.runtime.sendMessage({
    'ecomtool': location.href
});

// 监听 background.js 发来的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {


    if (request.hasOwnProperty(`ecomtool_response`)) {
        try {
            if (request.ust == 2) {
                function _0x1d12a5(_0x3f9015, _0xd7d01) {
                    xmlHttpRequest = new XMLHttpRequest();
                    xmlHttpRequest.open(`GET`, _0x3f9015, ![]);
                    xmlHttpRequest.setRequestHeader(`Content-Type`, `application/x-www-form-urlencoded`);
                    xmlHttpRequest.send(_0xd7d01);
                    return xmlHttpRequest.responseText;
                }

                function _0x395d81(_0x123b61, _0x340152) {
                    xmlHttpRequest = new XMLHttpRequest();
                    xmlHttpRequest.open(`GET`, _0x123b61, ![]);
                    xmlHttpRequest.setRequestHeader(`Content-Type`, `application/json; charset=UTF-8`);
                    xmlHttpRequest.send(_0x340152);
                    return xmlHttpRequest.responseText;
                }


                function _0x457163(_0x4f418d) {
                    return Math.max.apply(this, _0x4f418d);
                }

                function _0x51df16(_0x22f465, _0x4c2a10, _0x441002, _0x374501) {
                    max_num = _0x457163(_0x4c2a10);
                    change_to_chart_code = `<table style="font-size:` + _0x374501 + `px;">`;
                    for (chart_i = 0x0; chart_i < _0x4c2a10.length; chart_i++) {
                        num_interval_show = '';
                        if (_0x4c2a10[chart_i] > 0x0) {
                            num_height = _0x4c2a10[chart_i] / max_num * _0x441002;
                            num_interval_show = num_interval_show + `<table style="background: #135753;height:` + num_height + `px;font-size:` + num_height + `px;"><tr><td>&nbsp;</td></tr></table>`;
                            num_code = `<span style="background: #135753;" title="` + _0x22f465[chart_i] + ': ' + _0x4c2a10[chart_i] + '">' + num_interval_show + `</span>`;
                        } else {
                            num_code = '0';
                        }
                        change_to_chart_code = change_to_chart_code + `<td style="vertical-align:bottom">` + num_code + `</td>`;
                    }
                    change_to_chart_code = change_to_chart_code + `</table>`;
                    return change_to_chart_code;
                }

                function _0x2c27fe(_0x118e75, _0x49480f) {
                    htm_code = _0x395d81(`https://translate.google.cn/m?sl=auto&tl=` + _0x49480f + `&q=` + _0x118e75.replace(/%0A/g, `%0A(-)`));
                    trans_code = htm_code.split(`<div dir="ltr" class="t0">`)[0x1].split(`</div>`)[0x0];
                    trans_code = trans_code.replace(/&#39;/g, '\'').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/（/g, '(').replace(/）/g, ')').replace(/( -)/g, `(-)`).replace(/(- )/g, `(-)`).replace(/( - )/g, `(-)`);
                    trans_code = trans_code.replace(/\(-\)/g, `<br>`).replace(/<br> /g, `<br>`);
                    return trans_code;
                }

                // 使用授权日期信息
                exd = `2020-11-01`;
                update_info = ``;

                sc_code = '';

                // 获取 Amazon 站点的 marketplaceId
                marketplaceId = get_amazon_config(location.href).marketplaceID;
                keepa_market_id = get_amazon_config(location.href).keepa_market_id;
                console.log('marketplaceId -> ' + marketplaceId);
                switch (get_amazon_page_type('amazon')) {
                    case get_query_variable('mod') == 'check_index':
                        document.title = `亚马逊关键词首页收录查询`;
                        document.body.outerHTML = get_template_html('template/amazon_check_rank_index.html', mode = 'body');
                        break;
                    case get_query_variable('mod') == 'check_rank':
                        document.title = `亚马逊关键词首页排名查询`;
                        document.body.outerHTML = get_template_html('template/amazon_check_rank_index.html', mode = 'body');
                        break;
                    case get_query_variable('mod') == 'rank_index':
                        document.title = `亚马逊首页排名收录查询页面`;
                        document.body.outerHTML = get_template_html('template/amazon_rank_index.html', mode = 'body');
                        break;
                    case get_query_variable('mod') == 'keyword_rank':
                        document.title = `亚马逊关键词排名查询页面`;
                        document.body.outerHTML = get_template_html('template/amazon_keyword_rank.html', mode = 'body');
                        break;
                    case get_query_variable('mod') == 'check_keyword_rank':
                        document.title = `亚马逊关键词排名查询`;
                        document.body.outerHTML = get_template_html('template/amazon_check_keyword_rank.html', mode = 'body');
                        break;
                    case get_query_variable('mod') == 'asin_sale':
                        document.title = `亚马逊ASIN预估销量`;
                        asin = get_query_variable('asin');
                        response = JSON.stringify(get_helium10_json(asin, marketplaceId));
                        document.body.outerHTML = get_template_html('template/amazom_asin_sale.html', mode = 'body');
                        break;
                    default:
                        break;
                }

                if (get_amazon_page_type('amazon')) {
                    var page_menu = get_template_html('template/amazon_page_menu.html', mode = 'body');
                    if (document.body.innerHTML.indexOf('a-page') > -1) {
                        document.getElementById('a-page').insertAdjacentHTML('afterBegin', page_menu);
                    }
                    // mod=asin_compare 竞品比对监控
                    // mod=comp_rank ASIN 定位广告排名查询
                    // mod=keyword_search 关键词搜索量趋势调研
                    // mod=search&plat= 翻译搜索
                    // https://www.sellersprite.com/favicon.ico?reverse-asin/` + document.domain.slice(-0x2).replace('om', 'US').toUpperCase() + '/' + asin + `" target="_blank`;

                    //asin = (location.href.indexOf(`/dp/`) > -0x1 ? location.href.split(`/dp/`)[0x1].split('/')[0x0].split('#')[0x0].split('?')[0x0] : location.href.split(`/gp/product/`)[0x1].split('/')[0x0]).split('#')[0x0].split('?')[0x0];
                    //asin_sale_link = `https://` + document.domain + `/favicon.ico?mod=asin_sale&asin=` + asin + `" target="_blank`;
                    //open_helium10_link = `https://` + document.domain + `/favicon.ico?mod=asin_keepa&asins=` + asin + `" target="_blank`;
                    //open_keepa_link = `https://keepa.com/iframe_addon.html#` + keepa_market_id + `-0-` + asin + `" target="_blank`;
                    //source_1688_link = `https://kj.1688.com/pdt_tongkuan.html?productUrl=https%3A%2F%2F` + document.domain + `%2Fdp%2F` + asin + `" target="_blank`;
                    //positive_link = `https://translate.google.cn/favicon.ico?mod=trans_positive&plat=am_` + document.domain.slice(-0x2).replace('om', 'us') + `&page=3&asin=` + asin + `" target="_blank`;
                    //negative_link = `https://translate.google.cn/favicon.ico?mod=trans_negative&plat=am_` + document.domain.slice(-0x2).replace('om', 'us') + `&page=3&asin=` + asin + `" target="_blank`;
                    //function_name_a = [`切换当地邮编`, `主流量词`, `预估销量`, `Helium10价格排名走势`, `打开Keepa`, `导出变体`, `标题描述翻译`, `前6页差评翻译`, `前6页好评翻译`];
                    //function_a = [trans_postcode_link, reverse_asin_link, asin_sale_link, open_helium10_link, open_keepa_link, export_var_link, title_desc_trans_link, negative_link, positive_link];
                }

                // 判断是不是在亚马逊的Listing页面
                if (get_amazon_page_type('listing')) {
                    // 用红色字体显示评星评级
                    if (document.body.innerHTML.indexOf(`id="acrPopover"`) > -1) {
                        document.getElementById(`acrPopover`).insertAdjacentHTML(`afterend`, `<font color="red">` + document.getElementById(`acrPopover`).title + `</font>`);
                    }
                    // 获取当前页面的 Asin
                    if (document.body.innerHTML.indexOf(`id="ASIN"`) > -1) {
                        asin = document.getElementById(`ASIN`).value;
                    } else {
                        asin = document.body.innerHTML.split(`data-asin="`)[1].split('"')[0];
                    }
                    // 在当前页面的五行生成销量表格
                    json_data = get_helium10_json(asin, marketplaceId);
                    display_code = get_template_html('template/prodDetails.html');
                    document.getElementById(`feature-bullets`).insertAdjacentHTML(`beforebegin`, display_code);
                }

                // 判断是不是在亚马逊的反查流量词页面
                if (location.href.indexOf(`sellersprite.com/favicon.ico?reverse-asin`) > -0x1) {
                    if (new Date().getTime() >= new Date(exd)) {
                        alert(update_info);
                    } else {
                        document.title = `反查流量词`;
                        site = location.href.split(`reverse-asin/`)[1].split('/')[0];
                        site_code = site.replace('US', '1').replace('UK', '3').replace('DE', '4').replace('ES', `44551`).replace('FR', '5').replace('IT', `35691`).replace('JP', '6').replace('CA', '7');
                        marketplace_link = `https://www.amazon.` + site.replace('US', `com`).replace('UK', `co.uk`).replace('JP', `co.jp`).toLowerCase();
                        asin_a = location.href.split(`reverse-asin/`)[1].split('/')[1].split(',');
                        all_keyword_code = '';
                        keyword_export_code = '';
                        keyword_str = '';
                        for (j = 0; j < asin_a.length; j++) {
                            asin = asin_a[j];
                            // 获取关键词的搜索数据
                            reverse_asin_htm_code = get_content(`https://www.sellersprite.com/v2/product-research/keywordTrend/` + site_code + `?t=3&nrn=3&asin=` + asin, type = 'json');
                            // 如果获取数据出错就循环 10 次
                            for (k = 0; k < 10; k++) {
                                if (reverse_asin_htm_code.indexOf(`访问出错了`) > -1) {
                                    reverse_asin_htm_code = get_content(`https://www.sellersprite.com/v2/product-research/keywordTrend/` + site_code + `?t=3&nrn=3&asin=` + asin, type = 'json');
                                    if (reverse_asin_htm_code.indexOf(`访问出错了`) < 0) {
                                        break;
                                    }
                                }
                            }

                            reverse_asin_htm_json = JSON.parse(reverse_asin_htm_code);
                            console.log(reverse_asin_htm_json);

                            if (reverse_asin_htm_json.data.length > 0) {

                                keyword_htm_code = reverse_asin_htm_code.split(`data":[`)[0x1];
                                keyword_a = keyword_htm_code.split('{');
                                keyword_code = `
                                <table id="` + asin + `" style="border:1px solid; font-size:14px;">
                                    <tr>
                                        <td>流量词-` + asin + `</td><td align=center>` + site + `上月搜索量</td>
                                        <td align=center>一年搜索量趋势</td>
                                        <td align=center>搜索量购买率趋势</td>
                                        <td align=center>谷歌趋势</td>
                                        <td>前3页排名</td>
                                    </tr>`;

                                // 循环获取指定Asin的关键词数据
                                // for (let i = 0; i < reverse_asin_htm_json.data.length; i++) {
                                //     keyword = reverse_asin_htm_json.data[i].keyword
                                //     months = reverse_asin_htm_json.data[i].months
                                //     searches = reverse_asin_htm_json.data[i].searches
                                //     console.log(keyword);

                                //     for (let j = 0; j < months.length; j++) {
                                //         keyword_code = keyword_code + `
                                //         <tr>
                                //             <td>
                                //                 <a href="` + marketplace_link + `/s?k=` + keyword + '">' + keyword + `</a>
                                //             </td>
                                //             <td align=center>` + searches[j] + `</td>
                                //             <td align=center>` + months[j] + `</td>


                                //             <td align=center>
                                //                 <a href="https://www.sellersprite.com/favicon.ico?` + site + `?mod=search&q=` + keyword + `">搜索量购买率</a>
                                //             </td>
                                //             <td align=center>
                                //                 <a href="https://www.google.com/favicon.ico?mod=get_trend&site=` + site + `&keyword=` + keyword + `">谷歌趋势</a>
                                //             </td>
                                //             <td align=center>
                                //                 <a href="` + marketplace_link + `/empty.gif?page=3&keyword=` + keyword + `&asins=` + asin + `">查看排名</a>
                                //             </td>`;
                                // }

                                // function _0x51df16(_0x22f465, _0x4c2a10, _0x441002, _0x374501) {
                                //     max_num = _0x457163(_0x4c2a10);
                                //     change_to_chart_code = `<table style="font-size:` + _0x374501 + `px;">`;
                                //     for (chart_i = 0x0; chart_i < _0x4c2a10.length; chart_i++) {
                                //         num_interval_show = '';
                                //         if (_0x4c2a10[chart_i] > 0x0) {
                                //             num_height = _0x4c2a10[chart_i] / max_num * _0x441002;
                                //             num_interval_show = num_interval_show + `<table style="background: #135753;height:` + num_height + `px;font-size:` + num_height + `px;"><tr><td>&nbsp;</td></tr></table>`;
                                //             num_code = `<span style="background: #135753;" title="` + _0x22f465[chart_i] + ': ' + _0x4c2a10[chart_i] + '">' + num_interval_show + `</span>`;
                                //         } else {
                                //             num_code = '0';
                                //         }
                                //         change_to_chart_code = change_to_chart_code + `<td style="vertical-align:bottom">` + num_code + `</td>`;
                                //     }
                                //     change_to_chart_code = change_to_chart_code + `</table>`;
                                //     return change_to_chart_code;
                                // }




                                //     keyword_code = keyword_code + `</tr></table>`;
                                // }


                                for (i = 0x1; i < keyword_a.length; i++) {
                                    if (keyword_a[i].indexOf(`"keyword":`) > -0x1) {
                                        keyword = keyword_a[i].split(`"keyword":"`)[0x1].split('",')[0x0];
                                    } else {
                                        keyword = '';
                                    }
                                    if (keyword_a[i].indexOf(`"searches":`) > -0x1) {
                                        month_a = keyword_a[i].split(`"months":[`)[0x1].split(']')[0x0].replace(/"/g, '').replace(/-/g, '').split(',');
                                        search_a = keyword_a[i].split(`"searches":[`)[0x1].split(']')[0x0].split(',');
                                        search = search_a[search_a.length - 0x1];
                                        var _0x14387e = new Array(0xc);
                                        var _0x93bbd0 = new Array(0xc);
                                        for (k = 0x0; k < 0xc; k++) {
                                            _0x14387e[k] = month_a[month_a.length - 0xc + k];
                                            _0x93bbd0[k] = search_a[search_a.length - 0xc + k];
                                        }
                                        hot = _0x51df16(_0x14387e, _0x93bbd0, 0x14, 0xa);
                                    } else {
                                        search = '';
                                        hot = '';
                                    }
                                    keyword_code = keyword_code + `<tr><td><a href="` + marketplace_link + `/s?k=` + keyword + '">' + keyword + `</a></td><td align=center>` + search + `</td><td align=center>` + hot + `</td><td align=center><a href="https://www.sellersprite.com/favicon.ico?` + site + `?mod=search&q=` + keyword + `">搜索量购买率</a></td><td align=center><a href="https://www.google.com/favicon.ico?mod=get_trend&site=` + site + `&keyword=` + keyword + `">谷歌趋势</a></td><td align=center><a href="` + marketplace_link + `/empty.gif?page=3&keyword=` + keyword + `&asins=` + asin + `">查看排名</a></td>`;
                                    if (keyword_export_code.indexOf('"' + keyword + '"') < 0x0) {
                                        keyword_export_code = keyword_export_code + (keyword_export_code == '' ? '' : '') + '"' + keyword + '",' + search;
                                        keyword_str = keyword_str + (keyword_str == '' ? '' : ';') + keyword;
                                    }
                                }
                                keyword_code = keyword_code + `</tr></table>`;
                            } else {
                                keyword_code = '无';
                            }
                            all_keyword_code = all_keyword_code + keyword_code;
                        }
                        first_rank_code = asin_a.length == 0x1 ? ` <a style="text-decoration:none;" href="javascript:asin=location.href.split('reverse-asin/')[1].split('/')[1];htm_code=document.getElementById(asin).outerHTML;keyword_a=htm_code.split('s?k=');keyword='';for(i=1;i<keyword_a.length;i++){keyword=keyword+(keyword==''?'':',')+keyword_a[i].split('%22')[0];}open('` + marketplace_link + `/favicon.ico?mod=check_rank&asin='+asin+'&keyword='+keyword);void(0);"><input type="button" value="批量查询首页排名"></a>` : '';
                        display_code = `<a style="text-decoration:none;" download = "流量词.csv" href="data:text/csv;charset=utf-8,﻿` + encodeURIComponent(keyword_export_code) + `"><input type="button" value="导出流量词"></a> <a style="text-decoration:none;" href="https://www.sellersprite.com/favicon.ico?` + location.href.split(`reverse-asin/`)[0x1].split('/')[0x0].toLocaleUpperCase() + `?mod=search&q=` + keyword_str + `" target="_blank"><input type="button" value="批量查询搜索量购买率"></a> <a style="text-decoration:none;" href="https://www.google.com/favicon.ico?mod=get_trend&site=` + location.href.split(`reverse-asin/`)[0x1].split('/')[0x0].toLocaleUpperCase() + `&keyword=` + keyword_str + `" target="_blank"><input type="button" value="批量查询谷歌趋势"></a>` + first_rank_code + `<br>` + all_keyword_code;
                        if (asin_a.length == 0x0) {
                            location.href = `https://www.amazon.com/favicon.ico?mod=get_reverse_asin&asins=` + location.href.split(`reverse-asin/`)[0x1].split('/')[0x1] + `&code=` + encodeURIComponent(display_code);
                        } else {
                            document.body.outerHTML = `<body>` + display_code + sc_code + `</body>`;
                        }
                        void 0x0;
                    }
                }


                if (location.href.indexOf(`www.amazon`) > -0x1 && location.href.indexOf(`mod=asin_compare&asins=`) > -0x1) {
                    if (new Date().getTime() >= new Date(exd)) {
                        alert(update_info);
                    } else {
                        document.title = `竞品比对监控`;
                        asins = location.href.split(`asins=`)[0x1].split('&')[0x0];
                        asins_a = asins.split(',');
                        asin_table_code = `<tr><td align=center>竞品ASIN</td><td align=center>图片</td><td align=center>标题</td><td align=center>Buybox价格</td><td align=center>评论数</td><td align=center>评论星级</td><td align=center>相似产品</td></tr>`;
                        asins_str = '';
                        for (i = 0x0; i < asins_a.length; i++) {
                            htm_code = _0x395d81(`https://` + document.domain + `/gp/recs-more-like-this/ajax/more-like-this.html?asin=` + asins_a[i], '');
                            image = htm_code.split(`src="`)[0x1].split('"')[0x0].replace(`_SR108,108_AC_.`, '');
                            title = htm_code.split(`medium mlt-title">`)[0x1].split('<')[0x0];
                            if (htm_code.indexOf(`a-color-price">`) > -0x1) {
                                price = htm_code.split(`a-color-price">`)[0x1].split('<')[0x0];
                            } else {
                                price = '';
                            }
                            if (location.href.indexOf(`amazon.de`) > -0x1 || location.href.indexOf(`amazon.es`) > -0x1 || location.href.indexOf(`amazon.fr`) > -0x1 || location.href.indexOf(`amazon.it`) > -0x1) {
                                price = Number(decodeURI(price).replace(`&nbsp;`, ' ').replace(`CDN$ `, '').replace('$', '').replace('$', '').replace('£', '').replace('€', '').replace(' ', '').replace('.', '').replace(',', '.'));
                            } else {
                                price = Number(decodeURI(price).replace(`&nbsp;`, ' ').replace(`CDN$ `, '').replace('$', '').replace('$', '').replace('£', '').replace('€', '').replace(' ', '').replace(',', ''));
                            }
                            if (htm_code.indexOf(`product-reviews/` + asins_a[i]) > -0x1) {
                                asin_length = htm_code.split(`product-reviews/` + asins_a[i]).length - 0x1;
                                reviews = htm_code.split(`product-reviews/` + asins_a[i])[asin_length].split('>')[0x1].split('<')[0x0];
                                rating = htm_code.split(`a-icon-alt">`)[0x1].split(' ')[0x0].replace(',', '.');
                            } else {
                                reviews = '';
                                rating = '';
                            }
                            similar_code = '[' + asins_a[i] + ';' + price + ';' + reviews + ';' + rating + ']';
                            if (htm_code.indexOf(`<div data-asin="`) > -0x1) {
                                similar_a = htm_code.split(`<div data-asin="`);
                                for (j = 0x1; j < similar_a.length; j++) {
                                    similar_asin = similar_a[j].split('"')[0x0];
                                    if (similar_a[j].indexOf(`p13n-sc-price'>`) > -0x1) {
                                        similar_price = similar_a[j].split(`p13n-sc-price'>`)[0x1].split('<')[0x0];
                                    } else {
                                        similar_price = '';
                                    }
                                    if (similar_a[j].indexOf(`product-reviews/` + similar_asin) > -0x1) {
                                        similar_reviews = similar_a[j].split(`product-reviews/` + similar_asin)[0x2].split('>')[0x1].split('<')[0x0];
                                        similar_rating = similar_a[j].split(`eview">`)[0x1].split(`title="`)[0x1].split(' ')[0x0].replace(',', '.');
                                    } else {
                                        similar_reviews = '';
                                        similar_rating = '';
                                    }
                                    similar_code = similar_code + '[' + similar_a[j].split('"')[0x0] + ';' + similar_price + ';' + similar_reviews + ';' + similar_rating + ']';
                                }
                            } else {
                                similar_code = '';
                            }
                            asin_table_code = asin_table_code + `<tr><td align=center><a href="https://` + document.domain + `/dp/` + asins_a[i] + '">' + asins_a[i] + `</a></td><td id="` + asins_a[i] + `_image" align=center><img height=50 width=50 title="` + image + `" src="` + image + `"></td><td id="` + asins_a[i] + `_title">` + title + `</td><td id="` + asins_a[i] + `_price" align=center>` + price + `</td><td id="` + asins_a[i] + `_reviews" align=center>` + reviews + `</td><td id="` + asins_a[i] + `_rating" align=center>` + rating + `</td><td align=center><a href="https://` + document.domain + `/favicon.ico?mod=asin_compare&info=basic&asins=` + similar_code + `">比对</a></td></tr>`;
                            asins_str = asins_str + '[' + asins_a[i] + ';' + price + ';' + reviews + ';' + rating + ']';
                        }
                        para = 0x0;
                        if (para == 0x1) {
                            document.body.outerHTML = `<a style="text-decoration:none;" href="javascript:entire_para='';asins = location.href.split('asins=') [1].split('&') [0];asins_a = asins.split(',');for(i=0;i<asins_a.length;i++){entire_para=entire_para+'['+asins_a[i]+';'+document.getElementById(asins_a[i]+'_price').innerHTML+';'+document.getElementById(asins_a[i]+'_reviews').innerHTML+';'+document.getElementById(asins_a[i]+'_rating').innerHTML+']';}location.href='https://'+document.domain+'/favicon.ico?mod=asin_compare&info=sale&asins='+entire_para.replace('[;;;]','');"><input type="button" value="获取所有信息"></input></a><table style="font-size: 12.0px;">` + asin_table_code + `</table>` + sc_code;
                        } else {
                            location.href = `https://` + document.domain + `/favicon.ico?mod=asin_compare&info=sale&asins=` + asins_str.replace(`[;;;]`, '');
                        }
                        void 0x0;
                    }
                } else {
                    if (location.href.indexOf(`mod=asin_compare&info=sale`) > -0x1 && location.href.indexOf(`www.amazon`) > -0x1) {
                        if (new Date().getTime() >= new Date(exd)) {
                            alert(update_info);
                        } else {
                            document.title = `竞品比对监控`;
                            asins = location.href.split(`asins=`)[0x1];
                            asins_a = asins.split('[');
                            asin_table_code = `<tr><td align=center>竞品ASIN</td><td align=center>图片</td><td align=center width=30%>标题</td><td align=center>Buybox价格</td><td align=center>评论数</td><td align=center>评论星级</td><td align=center>品牌名</td><td align=center>大类</td><td align=center>大类排名</td><td align=center>小类</td><td align=center>小类排名</td><td align=center>包装尺寸(inch)</td><td align=center>包装重量(lbs)</td><td align=center>FBA运费</td><td align=center><font color=red>24小时订单数</font></td><td align=center>最近第1周订单数</td><td align=center>最近第2周订单数</td><td align=center>最近第3周订单数</td><td align=center>最近第4周订单数</td><td align=center>销售天数</td></tr>`;
                            profit_asin_table_code = asin_table_code.split(`</tr>`)[0x0] + `<td align=center>重量kg</td><td align=center>产品成本</td><td align=center><font color=red>利润</font></td><td align=center><font color=red>利润率</font></td></tr>`;
                            asins_link = `https://` + document.domain + `/favicon.ico?mod=asin_compare&asins=`;
                            is_out_date = 0x0;
                            for (i = 0x1; i < asins_a.length; i++) {
                                asins_a[i] = asins_a[i].replace(/&nbsp;/g, ' ');
                                asin = asins_a[i].split(';')[0x0];
                                asins_link = asins_link + (i == 0x1 ? '' : ',') + asin;
                                price = asins_a[i].split(';')[0x1];
                                reviews = asins_a[i].split(';')[0x2];
                                rating = asins_a[i].split(';')[0x3].split(']')[0x0];
                                htm_code = _0x1d12a5(`https://members.helium10.com/extension/calculator-json?price=10&asin=` + asin + `&marketplaceId=` + marketplaceID, '');
                                if (htm_code.indexOf(`{"status":false,"errorCode":2}`) > -0x1) {
                                    alert(`请先登录helium10`);
                                    open(`https://members.helium10.com`);
                                    void 0x0;
                                    break;
                                } else {
                                    if (htm_code.indexOf(`URL":"`) > -0x1) {
                                        image = htm_code.split(`URL":"`)[0x1].split('"')[0x0].replace(`_SL75_.`, '').replace(`http://ecx.images-amazon.com`, `https://images-na.ssl-images-amazon.com`);
                                    } else {
                                        image = '';
                                    }
                                    if (htm_code.indexOf(`Title":"`) > -0x1) {
                                        title = htm_code.split(`Title":"`)[0x1].replace(/\"/g, '引号').split('"')[0x0].replace(/引号/g, '"');
                                    } else {
                                        title = '';
                                    }
                                    if (htm_code.indexOf(`Brand":"`) > -0x1) {
                                        brand_name = htm_code.split(`Brand":"`)[0x1].split('"')[0x0];
                                    } else {
                                        brand_name = '';
                                    }
                                    if (htm_code.indexOf(`_display_on_website`) > -0x1) {
                                        big_cat = htm_code.split(`ProductCategoryId":"`)[0x1].split(`_display_on_website`)[0x0];
                                        big_bsr = htm_code.split(`ProductCategoryId":"`)[0x1].split(`Rank":"`)[0x1].split('"')[0x0];
                                    } else {
                                        big_cat = '';
                                        big_bsr = '';
                                    }
                                    if (htm_code.indexOf(`bsrList":{"`) > -0x1) {
                                        small_cat = htm_code.split(`bsrList":{"`)[0x1].split('"')[0x0];
                                        small_bsr = htm_code.split(`bsrList":{"`)[0x1].split(':"')[0x1].split('"')[0x0];
                                    } else {
                                        small_cat = '';
                                        small_bsr = '';
                                    }
                                    if (htm_code.indexOf(`PackageDimensions":{`) > -0x1) {
                                        package_temp = htm_code.replace(/{"@attributes":{"Units":"inches"},"0":/g, '').replace(/{"@attributes":{"Units":"pounds"},"0":/g, '').split(`PackageDimensions":{`)[0x1].split('}')[0x0];
                                        if (package_temp.indexOf(`"Height":"`) > -0x1) {
                                            package_dim = Number(package_temp.split(`"Height":"`)[0x1].split('"')[0x0]).toFixed(0x2) + '*' + Number(package_temp.split(`"Length":"`)[0x1].split('"')[0x0]).toFixed(0x2) + '*' + Number(package_temp.split(`"Width":"`)[0x1].split('"')[0x0]).toFixed(0x2);
                                        } else {
                                            package_dim = '';
                                        }
                                        if (package_temp.indexOf(`"Weight":"`) > -0x1) {
                                            package_weight = Number(package_temp.split(`"Weight":"`)[0x1].split('"')[0x0]).toFixed(0x2);
                                        } else {
                                            package_weight = 0x0;
                                        }
                                    } else {
                                        package_dim = '';
                                        package_weight = 0x0;
                                    }
                                    if (htm_code.indexOf(`ItemDimensions":{`) > -0x1) {
                                        item_temp = htm_code.replace(/{"@attributes":{"Units":"inches"},"0":/g, '').replace(/{"@attributes":{"Units":"pounds"},"0":/g, '').split(`ItemDimensions":{`)[0x1].split('}')[0x0];
                                        if (item_temp.indexOf(`"Height":"`) > -0x1) {
                                            item_dim = Number(item_temp.split(`"Height":"`)[0x1].split('"')[0x0]).toFixed(0x2) + '*' + Number(item_temp.split(`"Length":"`)[0x1].split('"')[0x0]).toFixed(0x2) + '*' + Number(item_temp.split(`"Width":"`)[0x1].split('"')[0x0]).toFixed(0x2);
                                        } else {
                                            item_dim = '';
                                        }
                                        if (item_temp.indexOf(`"Weight":"`) > -0x1) {
                                            item_weight = Number(item_temp.split(`"Weight":"`)[0x1].split('"')[0x0]).toFixed(0x2);
                                        } else {
                                            item_weight = 0x0;
                                        }
                                    } else {
                                        item_dim = '';
                                        item_weight = 0x0;
                                    }
                                    dim = package_dim == '' ? item_dim : package_dim;
                                    weight = package_weight == 0x0 ? item_weight : package_weight;
                                    if (htm_code.indexOf(`FBA Fulfillment Fees","amount":"`) > -0x1) {
                                        fba_fee = htm_code.split(`FBA Fulfillment Fees","amount":"`)[0x1].split('"')[0x0];
                                    } else {
                                        fba_fee = '';
                                    }
                                    h24_sale = 0x0;
                                    w1_sale = 0x0;
                                    w2_sale = 0x0;
                                    w3_sale = 0x0;
                                    w4_sale = 0x0;
                                    htm_code = _0x1d12a5(`https://members.helium10.com/black-box/sales-chart?days=0&asin=` + asin + `&marketplace=` + marketplaceID, '');
                                    sales_days = '';
                                    if (htm_code.split(`sales":[`)[0x1].split(']')[0x0] != '') {
                                        _0x51eec0 = htm_code.split(`sales":[`)[0x1].split(']')[0x0].split(`x":`);
                                        for (j = 0x1; j < _0x51eec0.length; j++) {
                                            d1 = new Date();
                                            d1.setTime(Number(_0x51eec0[j].split(',')[0x0]));
                                            d2 = new Date(new Date().getFullYear() + '-' + Number(new Date().getMonth() + 0x1) + '-' + new Date().getDate()).getTime();
                                            day_s = (d2 - d1) / 0x3e8 / 0x3c / 0x3c / 0x18;
                                            h24_sale = Number(_0x51eec0[_0x51eec0.length - 0x1].split(`y":`)[0x1].split('}')[0x0]);
                                            if (day_s < 6.5) {
                                                w1_sale = w1_sale + Number(_0x51eec0[j].split(`y":`)[0x1].split('}')[0x0]);
                                            } else {
                                                if (day_s < 13.5) {
                                                    w2_sale = w2_sale + Number(_0x51eec0[j].split(`y":`)[0x1].split('}')[0x0]);
                                                } else {
                                                    if (day_s < 20.5) {
                                                        w3_sale = w3_sale + Number(_0x51eec0[j].split(`y":`)[0x1].split('}')[0x0]);
                                                    } else {
                                                        if (day_s < 27.5) {
                                                            w4_sale = w4_sale + Number(_0x51eec0[j].split(`y":`)[0x1].split('}')[0x0]);
                                                        }
                                                    }
                                                }
                                            }
                                            if (w1_sale == 0x0) {
                                                h24_sale = 0x0;
                                            }
                                        }
                                        d = new Date();
                                        sales_days = (d.setTime(Number(_0x51eec0[_0x51eec0.length - 0x1].split(',')[0x0])) - d.setTime(Number(_0x51eec0[0x1].split(',')[0x0]))) / 0x3e8 / 0x3c / 0x3c / 0x18;
                                    }
                                    asin_table_code = asin_table_code + `<tr><td align=center><a href="https://` + document.domain + `/dp/` + asin + '">' + asin + `</a></td><td id="` + asin + `_image" align=center vertical-align=middle><img height=50 weight=50 title="` + image + `" src="` + image + `"></td><td id="` + asin + `_title"><span title="` + title + '">' + title.substring(0x0, 0xc8) + `</span></td><td id="` + asin + `_price" align=center>` + decodeURI(price) + `</td><td id="` + asin + `_reviews" align=center>` + decodeURI(reviews) + `</td><td id="` + asin + `_rating" align=center>` + decodeURI(rating) + `</td><td id="` + asin + `_brand_name" align=center>` + brand_name + `</td><td id="` + asin + `_big_cat" align=center>` + big_cat + `</td><td id="` + asin + `_big_bsr" align=center>` + big_bsr + `</td><td id="` + asin + `_small_cat" align=center>` + small_cat + `</td><td id="` + asin + `_small_bsr" align=center>` + small_bsr + `</td><td id="` + asin + `_dim" align=center>` + dim + `</td><td id="` + asin + `_weight" align=center>` + weight + `</td><td id="` + asin + `_fba_fee" align=center>` + fba_fee + `</td><td id="` + asin + `_h24_sale" align=center><font color=red>` + h24_sale.toFixed(0x1) + `</font></td><td id="` + asin + `_w1_sale" align=center>` + w1_sale.toFixed(0x1) + `</td><td id="` + asin + `_w2_sale" align=center>` + w2_sale.toFixed(0x1) + `</td><td id="` + asin + `_w3_sale" align=center>` + w3_sale.toFixed(0x1) + `</td><td id="` + asin + `_w4_sale" align=center>` + w4_sale.toFixed(0x1) + `</td><td id="` + asin + `_sales_days" align=center>` + sales_days + `</td></tr>`;
                                    profit_asin_table_code = profit_asin_table_code + `<tr><td align=center><a href="https://` + document.domain + `/dp/` + asin + '">' + asin + `</a></td><td id="` + asin + `_image" align=center vertical-align=middle><img height=50 weight=50 title="` + image + `" src="` + image + `"></td><td id="` + asin + `_title"><span title="` + title + '">' + title.substring(0x0, 0xc8) + `</span></td><td align=center><input size=3 id="` + asin + `_price" value="` + price + `" onkeyup="get_profit()"></td><td id="` + asin + `_reviews" align=center>` + decodeURI(reviews) + `</td><td id="` + asin + `_rating" align=center>` + decodeURI(rating) + `</td><td id="` + asin + `_brand_name" align=center>` + brand_name + `</td><td id="` + asin + `_big_cat" align=center>` + big_cat + `</td><td id="` + asin + `_big_bsr" align=center>` + big_bsr + `</td><td id="` + asin + `_small_cat" align=center>` + small_cat + `</td><td id="` + asin + `_small_bsr" align=center>` + small_bsr + `</td><td id="` + asin + `_dim" align=center>` + dim + `</td><td id="` + asin + `_weight" align=center>` + weight + `</td><td align=center><input size=2.5 id="` + asin + `_fba_fee" value="` + fba_fee + `" onkeyup="get_profit()"></td><td id="` + asin + `_h24_sale" align=center><font color=red>` + h24_sale.toFixed(0x1) + `</font></td><td id="` + asin + `_w1_sale" align=center>` + w1_sale.toFixed(0x1) + `</td><td id="` + asin + `_w2_sale" align=center>` + w2_sale.toFixed(0x1) + `</td><td id="` + asin + `_w3_sale" align=center>` + w3_sale.toFixed(0x1) + `</td><td id="` + asin + `_w4_sale" align=center>` + w4_sale.toFixed(0x1) + `</td><td id="` + asin + `_sales_days" align=center>` + sales_days + `</td><td align=center><input size=2.5 id="` + asin + `_weight_kg" value="` + (weight * 0.4532).toFixed(0x2) + `" onkeyup="get_profit()"></td><td align=center><input size=2 id="` + asin + `_cost" value="0" onkeyup="get_profit()"></td><td align=center><input size=2.5 id="` + asin + `_profit" value=""></td><td align=center><input size=4 id="` + asin + `_profit_rate" value=""></td></tr>`;
                                }
                            }
                            if (is_out_date == 0x0) {
                                document.body.outerHTML = `<span style="font-size: 12.0px;"><a style="text-decoration:none;"><input type="button" value="导出竞品信息"></a></span><span style="font-size: 12.0px;"><a style="text-decoration:none;"><input type="button" value="利润计算模式"></a></span><span style="font-size: 12.0px;"><a style="text-decoration:none;" href="javascript:var _0x20e3=['jsjiami.com.v6','\x4a\x68\x6a\x41\x73\x43\x6a\x4e\x69\x61\x6d\x71\x74\x78\x69\x2e\x63\x68\x6f\x6d\x45\x2e\x76\x59\x6e\x36\x4a\x54\x64\x50\x3d\x3d','\x6d\x61\x78','\x61\x70\x70\x6c\x79','\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x73\x42\x79\x54\x61\x67\x4e\x61\x6d\x65','\x74\x61\x62\x6c\x65','\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c','\x73\x70\x6c\x69\x74','\x68\x32\x34\x5f\x73\x61\x6c\x65','\x77\x31\x5f\x73\x61\x6c\x65','\x77\x32\x5f\x73\x61\x6c\x65','\x77\x33\x5f\x73\x61\x6c\x65','\x77\x34\x5f\x73\x61\x6c\x65','\x6c\x65\x6e\x67\x74\x68','\u6700\u8fd1\u7b2c','\u5468\u603b\u9500\u91cf\x3a\x20','\x74\x6f\x46\x69\x78\x65\x64','\u6700\u8fd1\u7b2c\x31\u5929\u9500\u91cf\x3a\x20','\u5468\u65e5\u5747\x3a\x20'];var _0x6914=function(_0x4db45a,_0x50987d){_0x4db45a=~~'0x'['concat'](_0x4db45a);var _0x45fcd2=_0x20e3[_0x4db45a];return _0x45fcd2;};(function(_0x147897,_0x408734){var _0x5041eb=0x0;for(_0x408734=_0x147897['shift'](_0x5041eb>>0x2);_0x408734!==(_0x147897['shift'](_0x5041eb>>0x3)+'')['replace'](/[JhACNqtxhEYnJTdP=]/g,'');_0x5041eb++){_0x5041eb=_0x5041eb^0x2eb41;}}(_0x20e3,_0x6914));function getMaxByArray2(_0x29f93a){return Math[_0x6914('0')][_0x6914('1')](this,_0x29f93a);}htm_code=document[_0x6914('2')](_0x6914('3'))[0x0][_0x6914('4')];h24_sale_a=htm_code[_0x6914('5')](_0x6914('6'));w1_sale_a=htm_code[_0x6914('5')](_0x6914('7'));w2_sale_a=htm_code[_0x6914('5')](_0x6914('8'));w3_sale_a=htm_code[_0x6914('5')](_0x6914('9'));w4_sale_a=htm_code[_0x6914('5')](_0x6914('a'));h24_sum=0x0;w1_sum=0x0;w2_sum=0x0;w3_sum=0x0;w4_sum=0x0;for(i=0x1;i<w1_sale_a[_0x6914('b')];i++){h24_sum=h24_sum+Number(h24_sale_a[i][_0x6914('5')]('\x3e')[0x2][_0x6914('5')]('\x3c')[0x0]);w1_sum=w1_sum+Number(w1_sale_a[i][_0x6914('5')]('\x3e')[0x1][_0x6914('5')]('\x3c')[0x0]);w2_sum=w2_sum+Number(w2_sale_a[i][_0x6914('5')]('\x3e')[0x1][_0x6914('5')]('\x3c')[0x0]);w3_sum=w3_sum+Number(w3_sale_a[i][_0x6914('5')]('\x3e')[0x1][_0x6914('5')]('\x3c')[0x0]);w4_sum=w4_sum+Number(w4_sale_a[i][_0x6914('5')]('\x3e')[0x1][_0x6914('5')]('\x3c')[0x0]);}sum_a=[w1_sum,w2_sum,w3_sum,w4_sum];sum_max=getMaxByArray2(sum_a);sum_a_show=['','','',''];for(i=0x0;i<sum_a[_0x6914('b')];i++){if(sum_a[i]>0x0){for(j=0x1;j<=sum_a[i]/sum_max*0x1e;j++){sum_a_show[i]=sum_a_show[i]+'\x2d';}}}sum_display_code='';for(i=0x0;i<sum_a[_0x6914('b')];i++){sum_display_code=sum_display_code+(sum_display_code==''?'':'\x0a')+_0x6914('c')+Number(0x4-i)+_0x6914('d')+sum_a_show[0x4-i-0x1]+sum_a[0x4-i-0x1][_0x6914('e')](0x0);}day_a=[h24_sum,w1_sum/0x7,w2_sum/0x7,w3_sum/0x7,w4_sum/0x7];day_max=getMaxByArray2(day_a);day_a_show=['','','','',''];for(i=0x0;i<day_a[_0x6914('b')];i++){if(day_a[i]>0x0){for(j=0x1;j<=day_a[i]/day_max*0x1e;j++){day_a_show[i]=day_a_show[i]+'\x2d';}}}day_display_code='';for(i=0x0;i<day_a[_0x6914('b')];i++){day_display_code=day_display_code+(day_display_code==''?'':'\x0a')+(i==day_a[_0x6914('b')]-0x1?_0x6914('f'):_0x6914('c')+Number(day_a[_0x6914('b')]-0x1-i)+_0x6914('10'))+day_a_show[day_a[_0x6914('b')]-0x1-i]+day_a[day_a[_0x6914('b')]-0x1-i][_0x6914('e')](0x0);}alert(sum_display_code+'\x0a'+day_display_code);void 0x0;"><input type="button" value="销量总计4周趋势"></a></span><table style="font-size: 12.0px;">` + asin_table_code + `</table>` + sc_code;
                                history.replaceState(null, null, asins_link);
                                var _0x3c2e85 = `<html><head><meta charset='utf-8' /></head><body>` + document.getElementsByTagName(`table`)[0x0].outerHTML + `</body></html>`;
                                var _0x158b1b = new Blob([_0x3c2e85], {
                                    'type': `application/vnd.ms-excel`
                                });
                                var _0x51eec0 = document.getElementsByTagName('a')[0x0];
                                _0x51eec0.href = URL.createObjectURL(_0x158b1b);
                                _0x51eec0.download = `竞品信息文件.xls`;
                                if (update_info.length < 0x5) {
                                    if (location.href.indexOf(`amazon.com`) > -0x1) {
                                        cur_rate_value = 6.9;
                                        first_fee_value = 0x19;
                                        vat_rate_value = 0x0;
                                    } else {
                                        if (location.href.indexOf(`amazon.ca`) > -0x1) {
                                            cur_rate_value = 0x5;
                                            first_fee_value = 0x19;
                                            vat_rate_value = 0x0;
                                        } else {
                                            if (location.href.indexOf(`amazon.co.uk`) > -0x1) {
                                                cur_rate_value = 0x8;
                                                first_fee_value = 0x1c;
                                                vat_rate_value = 7.5;
                                            } else {
                                                if (location.href.indexOf(`amazon.de`) > -0x1 || location.href.indexOf(`amazon.es`) > -0x1 || location.href.indexOf(`amazon.fr`) > -0x1 || location.href.indexOf(`amazon.it`) > -0x1) {
                                                    cur_rate_value = 7.5;
                                                    first_fee_value = 0x1c;
                                                    vat_rate_value = location.href.indexOf(`amazon.de`) > -0x1 ? 0x10 : 0x0;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    cur_rate_value = '';
                                    first_fee_value = '';
                                    vat_rate_value = '';
                                }
                                var _0x1bf43f = `<html><head><meta charset='utf-8' /><script language='javascript'>function get_profit(){referral_rate=document.forms[0].referral_rate.value;cur_rate=document.forms[0].cur_rate.value;vat_rate=document.forms[0].vat_rate.value;first_fee=document.forms[0].first_fee.value;table_a=document.getElementsByTagName('table')[0].outerHTML.split('<tr>');for(i=2;i<table_a.length;i++){asin=table_a[i].split('dp/')[1].split('"')[0];price=eval('document.forms[0].'+asin+'_price.value');fba_fee=eval('document.forms[0].'+asin+'_fba_fee.value');weight=eval('document.forms[0].'+asin+'_weight_kg.value');cost=eval('document.forms[0].'+asin+'_cost.value');if(weight!=0&&cost!=''&&cur_rate!=''&&vat_rate!=''&&first_fee!=''&&price!='无'){eval('document.forms[0].'+asin+'_profit.value=(cur_rate*(price*(1-referral_rate)*(1-vat_rate/100)-fba_fee)-cost-weight*first_fee).toFixed(2)');eval('document.forms[0].'+asin+'_profit_rate.value=((cur_rate*(price*(1-referral_rate)*(1-vat_rate/100)-fba_fee)-cost-weight*first_fee)/price/cur_rate*100).toFixed(2)+\'%\'');}else{eval('document.forms[0].'+asin+'_profit.value=\'\'');eval('document.forms[0].'+asin+'_profit_rate.value=\'\'');}}}</script></head><body><form><div style='font-size: 12.0px;'>佣金费率: <input size=2.5 id='referral_rate' value='0.15' onkeyup='get_profit()'> 汇率: <input size=2.5 id='cur_rate' onkeyup='get_profit()' value='` + cur_rate_value + `'> VAT税率: <input size=2.5 id='vat_rate' onkeyup='get_profit()' value='` + vat_rate_value + `'>% 头程费用(元/kg): <input size=2.5 id='first_fee' onkeyup='get_profit()' value='` + first_fee_value + `'></div><table style='font-size: 12.0px;'>` + profit_asin_table_code + `</table></form><script language='javascript'>get_profit();</script></body></html>`;
                                var _0x158b1b = new Blob([_0x1bf43f], {
                                    'type': `text/html`
                                });
                                var _0x51eec0 = document.getElementsByTagName('a')[0x1];
                                _0x51eec0.href = URL.createObjectURL(_0x158b1b);
                                _0x51eec0.download = `竞品信息文件.html`;
                                void 0x0;
                            }
                        }
                    } else {
                        if (location.href.indexOf(`mod=asin_compare`) > -0x1 && location.href.indexOf(`www.amazon`) > -0x1) {
                            if (new Date().getTime() >= new Date(exd)) {
                                alert(update_info);
                            } else {
                                document.title = `亚马逊竞品比对监控工具`;
                                query_link = `javascript:open(location.href+'&asins='+document.getElementById('asins').value.replace(/\n/g,','));void(0);`;
                                keepa_link = `javascript:open('https://` + document.domain + `/favicon.ico?mod=asin_keepa&asins=` + '\' +' + `document.getElementById('asins').value.replace(/\n/g,','));void(0);`;
                                reverse_asin_link = `javascript:open('https://www.sellersprite.com/favicon.ico?reverse-asin/` + document.domain.slice(-0x2).replace('om', 'US').toUpperCase() + `/'+document.getElementById('asins').value.replace(/\n/g,','));void(0);`;
                                open_asin_link = `javascript:a=document.getElementById('asins').value.replace(/\n/g, ',').split(',');for(i=0;i<a.length;i++){open('https://'+document.domain+'/dp/'+a[i]);}void(0);`;
                                query_code = `<div align=center style="font-size:20px;"><br><br><span style="color:yellow; font-size:28px;">亚马逊竞品比对监控工具</span><br><br><a style="text-decoration:none;" href="` + query_link + `"><input type="button" value="比对排名销量" style="font-size:20px; width:130px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></a> <a style="text-decoration:none;" href="` + keepa_link + `"><input type="button" value="比对价格排名走势" style="font-size:20px; width:180px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></a> <a style="text-decoration:none;" href="` + reverse_asin_link + `"><input type="button" value="批量反查词" style="font-size:20px; width:120px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></a> <a style="text-decoration:none;" href="` + open_asin_link + `"><input type="button" value="批量打开ASIN页面" style="font-size:20px; width:180px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></a>`;
                                asin_code = `<br><br><span style="color:yellow;">输入竞品ASIN(可输入多个,换行输入或英文逗号分隔)</span><br><textarea id="asins" rows=20 cols=71 placeholder="如:B074CMHQW5,B07DZTLQZL" style="font-size:16px;"></textarea></div>`;
                                document.body.outerHTML = `<body bgcolor="black"><div align=center>` + query_code + asin_code + `</div>` + sc_code + `</body>`;
                                void 0x0;
                            }
                        } else {
                            if (location.href.indexOf(`mod=asin_keepa`) > -0x1 && location.href.indexOf(`www.amazon`) > -0x1) {
                                if (new Date().getTime() >= new Date(exd)) {
                                    alert(update_info);
                                } else {
                                    document.title = `ASIN价格排名走势`;
                                    asin_a = location.href.split(`asins=`)[0x1].split('&')[0x0].split(',');
                                    display_code = '';
                                    for (i = 0x0; i < asin_a.length; i++) {
                                        asin = asin_a[i].trim();
                                        htm_code = _0x1d12a5(`https://members.helium10.com/extension/calculator-json?price=10&asin=` + asin + `&marketplaceId=` + marketplaceID, '');
                                        if (htm_code.indexOf(`{"status":false,"errorCode":2}`) > -0x1) {
                                            location.href = `https://members.helium10.com`;
                                        } else {
                                            if (htm_code.indexOf(`URL":"`) > -0x1) {
                                                image_url = htm_code.split(`URL":"`)[0x1].split('"')[0x0].replace(`_SL75_.`, `_SL200_.`).replace(`http://ecx.images-amazon.com`, `https://images-na.ssl-images-amazon.com`);
                                            } else {
                                                image_url = '';
                                            }
                                            if (htm_code.indexOf(`Title":"`) > -0x1) {
                                                title = htm_code.split(`Title":"`)[0x1].replace(/\"/g, '引号').split('"')[0x0].replace(/引号/g, '"');
                                            } else {
                                                title = '';
                                            }
                                        }
                                        display_code = display_code + (display_code == '' ? '' : `<br>`) + `<table style="border:1px solid; font-size: 12px; align:center;"><tr><td width=250><span align=center><img src="` + image_url + `"></span><br>ASIN: <a href="dp/` + asin + '">' + asin + `</a><br>标题: ` + title + `</td><td><iframe style="border:0px solid;" scrolling="no" width=600 height=410 src="https://members.helium10.com/chart/index?asin=` + asin + `&marketplace=` + marketplaceID + `&range=30"></iframe></td><td><iframe style="border:0px solid;" scrolling="no" width=600 height=410 src="https://members.helium10.com/black-box/review-chart?asin=` + asin + `&marketplace=` + marketplaceID + `&days=90"></iframe></td></tr></table>`;
                                    }
                                    document.body.outerHTML = `<body bgcolor="white">` + display_code + sc_code + `</body>`;
                                    void 0x0;
                                }
                            }
                        }
                    }
                }
                if (location.href.indexOf('q=') > -0x1 && location.href.indexOf(`www.sellersprite.com/favicon.ico`) > -0x1) {
                    if (new Date().getTime() >= new Date(exd)) {
                        alert(update_info);
                    } else {
                        document.title = `关键词调研`;
                        site = location.href.split(`favicon.ico?`)[0x1].split('?')[0x0];
                        keywords = location.href.split('q=')[0x1];
                        keywords_a = keywords.split(';');
                        display_code = '';
                        for (k = 0x0; k < keywords_a.length; k++) {
                            if (keywords_a[k] != '') {
                                htm_code = _0x395d81(`https://www.sellersprite.com/v2/keyword/history-trend-month/` + site + `?q=` + keywords_a[k], '');
                                keyword_code = `<tr style="font-size:11px;">关键词: ` + decodeURI(keywords_a[k]) + `</tr>`;
                                searches_a = htm_code.split(`"search","data":[`)[0x1].split(']')[0x0].split(',');
                                sales_a = htm_code.split(`"purchase","data":[`)[0x1].split(']')[0x0].split(',');
                                rate_a = htm_code.split(`"rate","data":[`)[0x1].split(']')[0x0].split(',');
                                time_a = htm_code.split(`"time","data":[`)[0x1].split(']')[0x0].split(',');
                                searches_code = `<td style="border:1px solid;"><table style="font-size:10px;"><tr><td>月份</td><td>` + site + `月搜索量</td></tr>`;
                                total_searches = 0x0;
                                max_searches = 0x0;
                                for (i = 0x1; i < searches_a.length; i++) {
                                    searches_num = Number(searches_a[i].replace(`null`, '0'));
                                    total_searches = total_searches + searches_num;
                                    if (max_searches < searches_num) {
                                        max_searches = searches_num;
                                    }
                                }
                                for (i = 0x1; i < searches_a.length; i++) {
                                    month = `<td>` + time_a[i].replace('"', '').replace('"', '').replace('年', '').replace('月', '').substring(0x2, 0x6) + `</td>`;
                                    searches_num = Number(searches_a[i].replace(`null`, '0'));
                                    searches_interval_show = '';
                                    if (searches_num > 0x0) {
                                        for (j = 0x1; j <= searches_num / max_searches * 0x14; j++) {
                                            searches_interval_show = searches_interval_show + `&nbsp;`;
                                        }
                                        searches = `<td><font style="background: #135753;">` + searches_interval_show + `</font>` + searches_a[i] + `</td>`;
                                    } else {
                                        searches = `<td></td>`;
                                    }
                                    searches_code = searches_code + `<tr>` + month + searches;
                                }
                                searches_code = searches_code + `</tr></table></td>`;
                                sales_code = `<td style="border:1px solid;"><table style="font-size:10px;"><tr><td>月份</td><td>` + site + `月购买量</td></tr>`;
                                total_sales = 0x0;
                                max_sales = 0x0;
                                for (i = 0x1; i < sales_a.length; i++) {
                                    sales_num = Number(sales_a[i].replace(`null`, '0'));
                                    total_sales = total_sales + sales_num;
                                    if (max_sales < sales_num) {
                                        max_sales = sales_num;
                                    }
                                }
                                for (i = 0x1; i < sales_a.length; i++) {
                                    month = `<td>` + time_a[i].replace('"', '').replace('"', '').replace('年', '').replace('月', '').substring(0x2, 0x6) + `</td>`;
                                    sales_num = Number(sales_a[i].replace(`null`, '0'));
                                    sales_interval_show = '';
                                    if (sales_num > 0x0) {
                                        for (j = 0x1; j <= sales_num / max_sales * 0x14; j++) {
                                            sales_interval_show = sales_interval_show + `&nbsp;`;
                                        }
                                        sales = `<td><font style="background: #135753;">` + sales_interval_show + `</font>` + sales_a[i] + `</td>`;
                                    } else {
                                        sales = `<td></td>`;
                                    }
                                    sales_code = sales_code + `<tr>` + month + sales;
                                }
                                sales_code = sales_code + `</tr></table></td>`;
                                rate_code = `<td style="border:1px solid;"><table style="font-size:10px;"><tr><td>月份</td><td>` + site + `月购买率</td></tr>`;
                                total_rate = 0x0;
                                max_rate = 0x0;
                                for (i = 0x1; i < rate_a.length; i++) {
                                    rate_num = Number(rate_a[i].replace(`null`, '0'));
                                    total_rate = total_rate + rate_num;
                                    if (max_rate < rate_num) {
                                        max_rate = rate_num;
                                    }
                                }
                                for (i = 0x1; i < rate_a.length; i++) {
                                    month = `<td>` + time_a[i].replace('"', '').replace('"', '').replace('年', '').replace('月', '').substring(0x2, 0x6) + `</td>`;
                                    rate_num = Number(rate_a[i].replace(`null`, '0'));
                                    rate_interval_show = '';
                                    if (rate_num > 0x0) {
                                        for (j = 0x1; j <= rate_num / max_rate * 0x14; j++) {
                                            rate_interval_show = rate_interval_show + `&nbsp;`;
                                        }
                                        rate = `<td><font style="background: #135753;">` + rate_interval_show + `</font>` + rate_a[i] + `%</td>`;
                                    } else {
                                        rate = `<td></td>`;
                                    }
                                    rate_code = rate_code + `<tr>` + month + rate;
                                }
                                rate_code = rate_code + `</tr></table></td>`;
                                display_code = display_code + (k % 0x3 == 0x0 ? `<tr>` : '') + `<td><table>` + keyword_code + `<tr>` + searches_code + sales_code + rate_code + `</tr></table></td>` + (k % 0x3 == 0x2 ? `</tr>` : '');
                            }
                        }
                        document.body.outerHTML = `<body><table>` + display_code + `</table>` + sc_code + `</body>`;
                        void 0x0;
                    }
                } else {
                    if (location.href.indexOf(`keyword=`) > -0x1 && location.href.indexOf(`completion.amazon`) > -0x1) {
                        if (new Date().getTime() >= new Date(exd)) {
                            alert(update_info);
                        } else {
                            document.title = `关联词获取`;
                            marketplaceID = location.href.split(`site=`)[0x1].split('&')[0x0].toLocaleUpperCase().replace('FR', `A13V1IB3VIYZZH`).replace('UK', `A1F83G8C2ARO7P`).replace('DE', `A1PA6795UKMFR9`).replace('US', `ATVPDKIKX0DER`).replace('CA', `A2EUQ1WTGCTBG2`).replace('MX', `A1AM78C64UM0Y8`).replace('ES', `A1RKKUPIHCS9HS`).replace('IT', `APJ6JRA9NG5V4`).replace('JP', `A1VC38T7YXB528`).replace('AU', `A39IBJ37TRP1C6`);
                            keywords = location.href.split(`keyword=`)[0x1];
                            keywords_a = keywords.split(';');
                            display_code = '';
                            for (k = 0x0; k < keywords_a.length; k++) {
                                if (keywords_a[k] != '') {
                                    htm_code = _0x395d81(`https://` + document.domain + `/api/2017/suggestions?site-variant=desktop&mid=` + marketplaceID + `&alias=aps&limit=13&prefix=` + keywords_a[k]);
                                    if (display_code.indexOf(decodeURI(keywords_a[k])) < 0x0) {
                                        display_code = display_code + (k == 0x0 ? '' : `<br>`) + decodeURI(keywords_a[k]);
                                    }
                                    if (htm_code.indexOf(`KEYWORD","value":"`) > -0x1) {
                                        related_keywords_a = htm_code.split(`KEYWORD","value":"`);
                                        for (i = 0x1; i < related_keywords_a.length; i++) {
                                            if (display_code.indexOf(decodeURI(related_keywords_a[i].split(`","`)[0x0])) < 0x0) {
                                                display_code = display_code + `<br>` + decodeURI(related_keywords_a[i].split(`","`)[0x0]);
                                            }
                                        }
                                    }
                                }
                            }
                            document.body.outerHTML = `<body><a style="text-decoration:none;" href="javascript:site=location.href.split('site=')[1].split('&')[0];htm_code=document.body.innerHTML;a=htm_code.split('<div style=%22font-size:14px;%22>')[1].split('</div>')[0].split('<br>');keyword_str='';for(i=0;i<a.length;i++){keyword_str=keyword_str+(i==0?'':';')+a[i];}location.href='https://'+document.domain+'/?site='+site+'&keyword='+encodeURI(keyword_str);"><input type="button" value="获取本页关联词"></a><a style="text-decoration:none;" download = "关键词.csv" href="data:text/csv;charset=utf-8,﻿` + encodeURIComponent(display_code.replace(/<br>/g, '')) + `"><input type="button" value="导出关键词"></a><br><div style="font-size:14px;">` + display_code + `</div>` + sc_code + `</body>`;
                            void 0x0;
                        }
                    } else {
                        if (location.href.indexOf(`mod=get_trend`) > -0x1 && location.href.indexOf(`www.google.com/favicon.ico`) > -0x1) {
                            if (new Date().getTime() >= new Date(exd)) {
                                alert(update_info);
                            } else {
                                document.title = `关键词谷歌趋势`;
                                site = location.href.split(`site=`)[0x1].split('&')[0x0];
                                time = location.href.split(`time=`)[0x1].split('&')[0x0];
                                time_code = time == `12m` ? `12-m` : `5-y`;
                                keywords = location.href.split(`keyword=`)[0x1];
                                keywords_a = keywords.split(';');
                                display_code = '';
                                for (k = 0x0; k < keywords_a.length; k++) {
                                    if (keywords_a[k] != '') {
                                        display_code = display_code + `<iframe style="border:1px solid;" scrolling="no" width="100%" height="420" src='https://trends.google.com/trends/embed/explore/TIMESERIES?req={%22comparisonItem%22:[{%22keyword%22:%22` + keywords_a[k] + `%22,%22geo%22:%22` + site + `%22,%22time%22:%22today%20` + time_code + `%22}],%22category%22:0,%22property%22:%22%22}&tz=-480&forceMobileMode=false&isPreviewMode=true&eq=q=` + keywords_a[k] + `&date=today%20` + time_code + `&hl=zhCN'></iframe>`;
                                    }
                                }
                                document.body.outerHTML = `<body>` + display_code + sc_code + `</body>`;
                                void 0x0;
                            }
                        } else {
                            if (location.href.indexOf(`mod=keyword_search`) > -0x1 && location.href.indexOf(`www.amazon`) > -0x1) {
                                if (new Date().getTime() >= new Date(exd)) {
                                    alert(update_info);
                                } else {
                                    document.title = `亚马逊关键词调研工具`;
                                    related_keyword_link = `javascript:open('https://completion.amazon.'+location.href.split('www.amazon.')[1].split('/')[0].replace('ca','com').replace('com.mx','com').replace('de','co.uk').replace('es','co.uk').replace('fr','co.uk').replace('it','co.uk')+'/?site='+location.href.split('www.amazon.')[1].split('/')[0].toUpperCase().replace('COM.MX','MX').replace('COM','US').replace('CO.UK','UK').replace('CO.JP','JP')+'&keyword='+encodeURI(document.getElementById('keywords').value.replace(/\n/g,';')));void(0);`;
                                    sellersprite_query_link = `javascript:open('https://www.sellersprite.com/favicon.ico?'+location.href.split('www.amazon.')[1].split('/')[0].toUpperCase().replace('COM.MX','MX').replace('COM','US').replace('CO.UK','UK').replace('CO.JP','JP')+'?mod=search&q='+document.getElementById('keywords').value.replace(/\n/g,';').toLowerCase());void(0);`;
                                    google_query_12m_link = `javascript:open('https://www.google.com/favicon.ico?mod=get_trend&time=12m&site='+location.href.split('www.amazon.')[1].split('/')[0].toUpperCase().replace('COM.MX','MX').replace('COM','US').replace('CO.UK','UK').replace('CO.JP','JP')+'&keyword='+document.getElementById('keywords').value.replace(/\n/g,';'));void(0);`;
                                    google_query_5y_link = `javascript:open('https://www.google.com/favicon.ico?mod=get_trend&time=5y&site='+location.href.split('www.amazon.')[1].split('/')[0].toUpperCase().replace('COM.MX','MX').replace('COM','US').replace('CO.UK','UK').replace('CO.JP','JP')+'&keyword='+document.getElementById('keywords').value.replace(/\n/g,';'));void(0);`;
                                    query_code = `<div align=center style="font-size:20px;"><br><br><span style="color:yellow; font-size:28px;">亚马逊关键词调研工具</span><br><br><span style="color:yellow;"><a style="text-decoration:none;" href="` + related_keyword_link + `"><input type="button" value="获取关联词" style="font-size:20px; width:120px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></input></a> <a style="text-decoration:none;" href="` + sellersprite_query_link + `"><input type="button" value="查询搜索量购买率" style="font-size:20px; width:200px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></input></a> <a style="text-decoration:none;" href="` + google_query_12m_link + `"><input type="button" value="查询Google趋势12月" style="font-size:20px; width:200px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></input></a> <a style="text-decoration:none;" href="` + google_query_5y_link + `"><input type="button" value="查询Google趋势5年" style="font-size:20px; width:200px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></input></a>`;
                                    keyword_code = `<br><br><span style="color:yellow;">输入关键词(可输入多个,需换行输入):</span><br><textarea id="keywords" rows=20 cols=71 placeholder="如:iphone x case&#10;case for iphone x" style="font-size:16px;"></textarea></div>`;
                                    document.body.outerHTML = `<body bgcolor="black"><div align=center>` + query_code + keyword_code + `</div>` + sc_code + `</body>`;
                                    void 0x0;
                                }
                            }
                        }
                    }
                }

                if (location.href.indexOf(`translate.google.cn/favicon.ico?mod=search&plat=am_`) > -0x1) {

                } else {
                    if (location.href.indexOf(`translate.google.cn/favicon.ico?mod=product_trans`) > -0x1) {
                        document.title = `ASIN标题描述翻译`;
                        title = location.href.split(`title=`)[0x1].split(`&bullet=`)[0x0];
                        bullet = location.href.split(`bullet=`)[0x1].split(`&aplus=`)[0x0];
                        aplus = location.href.split(`aplus=`)[0x1].replace(/(%0A){1,}/g, `%0A`).split(`&productDescription=`)[0x0];
                        productDescription = location.href.split(`productDescription=`)[0x1].replace(/(%0A){1,}/g, `%0A`);
                        display_code = `<table style="font-size:13px;" border="1" cellpadding="5" cellspacing="0" width="98%" bgcolor="#EEEEEE" bordercolordark="#FFFFFF" bordercolorlight="#999999">`;
                        document.body.outerHTML = `<body>` + display_code + `<tr>
                        <td>标题</td>
                        <td>` + decodeURIComponent(title) + `</td>
                        <td>` + _0x2c27fe(title, `zh-CN`) + `</td></tr>
                        <tr><td>五点描述</td>
                        <td>` + (bullet == '' ? '' : `<li>` + decodeURIComponent(bullet.replace(/%0A/g, `<br><li>`))) + `</td>
                        <td>` + (bullet == '' ? '' : `<li>` + _0x2c27fe(bullet, `zh-CN`).replace(/<br>/g, `<br><li>`)) + `</td><
                        /tr><tr><td>A+描述</td><td>` + decodeURIComponent(aplus.replace(/%0A/g, `<br>`)) + `</td>
                        <td>` + (aplus == '' ? '' : _0x2c27fe(aplus, `zh-CN`)) + `</td></tr><tr>
                        <td>详细描述</td><td>` + decodeURIComponent(productDescription.replace(/%0A/g, `<br>`)) + `</td>
                        <td>` + (productDescription == '' ? '' : _0x2c27fe(productDescription, `zh-CN`)) + `</td></tr></table>` + sc_code + `
                        </body>`;
                        f
                    } else {
                        if (location.href.indexOf(`translate.google.cn/favicon.ico?mod=trans_`) > -0x1) {
                            if (new Date().getTime() >= new Date(exd)) {
                                alert(update_info);
                            } else {
                                review_type = location.href.split(`trans_`)[0x1].split('&')[0x0];
                                page_no = location.href.split(`page=`)[0x1].split('&')[0x0];
                                asin = location.href.split(`&asin=`)[0x1].split('&')[0x0];
                                plat = location.href.split(`plat=`)[0x1].split('&')[0x0];
                                document.title = asin + '_前' + Number(page_no) * 0x2 + '页' + (review_type == `positive` ? '好评' : '差评');
                                review_link = (plat == `am_us` ? `https://www.amazon.com` : plat == `am_ca` ? `https://www.amazon.ca` : plat == `am_mx` ? `https://www.amazon.com.mx` : plat == `am_uk` ? `https://www.amazon.co.uk` : plat == `am_de` ? `https://www.amazon.de` : plat == `am_es` ? `https://www.amazon.es` : plat == `am_fr` ? `https://www.amazon.fr` : plat == `am_it` ? `https://www.amazon.it` : plat == `am_jp` ? `https://www.amazon.co.jp` : '') + `/hz/reviews-render/ajax/reviews/get/?deviceType=desktop&filterByStar=` + (review_type == `positive` ? `positive` : `critical`) + `&formatType=current_format&pageSize=20&reviewerType=all_reviews&scope=reviewsAjax1&shouldAppend=undefined&sortBy=recent&asin=` + asin + `&pageNumber=`;
                                display_code = '';
                                page = 0x1;
                                while (page <= page_no) {
                                    htm_code = _0x395d81(review_link + page);
                                    if (htm_code.indexOf(`["append","#cm_cr-review_list","<div id=`) > -0x1) {
                                        if (htm_code.indexOf(`info-review-count`) > -0x1) {
                                            title_code = `<div style="font-size:15px; color:` + (review_type == `positive` ? `blue` : `red`) + `;">` + htm_code.split(`info-review-count`)[0x1].split('>')[0x1].split('<')[0x0] + htm_code.split(`cr-filter-info-text`)[0x1].split('>')[0x1].split('<')[0x0].replace(/\n/g, '') + `</div>`;
                                        } else {
                                            title_code = `<div style="font-size:15px; color:` + (review_type == `positive` ? `blue` : `red`) + `;">` + htm_code.split(`info-review-rating-count`)[0x1].split(`<span>`)[0x1].split('<')[0x0].replace(/\n/g, '') + htm_code.split(`cr-filter-info-text`)[0x1].split('>')[0x1].split('<')[0x0].replace(/\n/g, '') + `</div>`;
                                        }
                                        _0x51eec0 = htm_code.split(`["append","#cm_cr-review_list","<div id=`);
                                        table_code = `<table style="font-size:13px;" border="1" cellpadding="5" cellspacing="0" width="98%" bgcolor="#EEEEEE" bordercolordark="#FFFFFF" bordercolorlight="#999999"><tr><td>VP</td><td width=180>评论时间</td><td width=120>评论人</td><td width=80>评分</td><td width=550>评论原文</td><td>评论译文</td></tr>`;
                                        for (i = 0x1; i < _0x51eec0.length; i++) {
                                            reviewer_name = _0x51eec0[i].split(`a-profile-name`)[0x1].split('>')[0x1].split('<')[0x0];
                                            rating = _0x51eec0[i].split(`a-icon-alt`)[0x1].split('>')[0x1].split('<')[0x0];
                                            review_title = _0x51eec0[i].split(`review-title-content`)[0x1].split(`<span>`)[0x1].split(`</span>`)[0x0];
                                            review_date = _0x51eec0[i].split(` review-date`)[0x1].split('>')[0x1].split('<')[0x0];
                                            if (_0x51eec0[i].indexOf(`avp-badge`) > -0x1) {
                                                review_vp = _0x51eec0[i].split(`avp-badge`)[0x1].split('>')[0x1].split('<')[0x0];
                                            } else {
                                                review_vp = '';
                                            }
                                            review_content = _0x51eec0[i].split(`review-text-content`)[0x1].split(`<span>`)[0x1].split(`</span>`)[0x0].replace(/\n/g, '');
                                            table_code = table_code + `<tr><td>` + review_vp + `</td><td width=180>` + review_date + `</td><td width=120>` + reviewer_name + `</td><td width=80>` + rating + `</td><td width=550>` + review_title + `<br>` + review_content + `</td><td>` + _0x2c27fe(review_title + `%0A` + review_content, `zh-CN`) + `</td></tr>`;
                                        }
                                        display_code = display_code + title_code + table_code + `</table>`;
                                    }
                                    page++;
                                }
                                document.body.outerHTML = `<body><span style="font-size: 13.0px;"><a style="text-decoration:none;"><input type="button" value="导出评论"></a></span><br>` + (display_code == '' ? '无' : display_code) + sc_code + `</body>`;
                                table_code = '';
                                if (display_code != '') {
                                    table_a = document.getElementsByTagName(`table`);
                                    for (i = 0x0; i < table_a.length; i++) {
                                        table_code = table_code + document.getElementsByTagName(`table`)[i].outerHTML.replace(/<br>/g, '. ');
                                    }
                                }
                                var _0x3c2e85 = `<html><head><meta charset='utf-8' /></head><body>` + table_code + `</body></html>`;
                                var _0x158b1b = new Blob([_0x3c2e85], {
                                    'type': `application/vnd.ms-excel`
                                });
                                var _0x51eec0 = document.getElementsByTagName('a')[0x0];
                                _0x51eec0.href = URL.createObjectURL(_0x158b1b);
                                _0x51eec0.download = document.title + `文件.xls`;
                            }
                        }
                    }
                }



                get_rank_link = `javascript:` + encodeURI(`var _0xodI='jsjiami.com.v6',_0x5486=[_0xodI,'\x6f\x70\x65\x6e','\x47\x45\x54','\x73\x65\x74\x52\x65\x71\x75\x65\x73\x74\x48\x65\x61\x64\x65\x72','\x43\x6f\x6e\x74\x65\x6e\x74\x2d\x54\x79\x70\x65','\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e\x3b\x20\x63\x68\x61\x72\x73\x65\x74\x3d\x55\x54\x46\x2d\x38','\x73\x65\x6e\x64','\x72\x65\x73\x70\x6f\x6e\x73\x65\x54\x65\x78\x74','\x68\x72\x65\x66','\x73\x70\x6c\x69\x74','\x61\x73\x69\x6e\x3d','\x63\x6f\x6d\x70\x5f\x61\x73\x69\x6e\x3d','\x6c\x65\x6e\x67\x74\x68','\x32\x30\x32\x35\x2d\x35\x2d\x31','\u6b64\u529f\u80fd\u9700\u8054\u7cfb\u4f5c\u8005\u5f00\u901a\u4f7f\u7528\x2e\x0a\u4f5c\u8005\x51\x51\x3a\x20\x33\x36\x39\x35\x39\x33\x32\x31\x32','\x64\x6f\x63\x75\x6d\x65\x6e\x74','\x62\x6f\x64\x79','\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c','\x69\x6e\x64\x65\x78\x4f\x66','\x69\x64\x3d\x22\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x2d\x6e\x6f\x6e\x65\x22','\u9875\u9762\u8fd8\u5728\u52a0\u8f7d','\x71\x75\x61\x6c\x69\x66\x69\x65\x72\x3d','\x30\x30\x30','\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64','\x41\x53\x49\x4e','\x76\x61\x6c\x75\x65','\x5f\x72\x61\x6e\x6b\x5f\x73\x70\x5f\x64\x65\x74\x61\x69\x6c','\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x2d\x6e\x6f\x6e\x65','\x6f\x75\x74\x65\x72\x48\x54\x4d\x4c','\x72\x65\x70\x6c\x61\x63\x65','\x26\x71\x75\x6f\x74\x3b','\x68\x74\x74\x70\x73\x3a\x2f\x2f','\x64\x6f\x6d\x61\x69\x6e','\x2f\x67\x70\x2f\x6e\x65\x6d\x6f\x2f\x73\x70\x64\x2f\x68\x61\x6e\x64\x6c\x65\x72\x73\x2f\x73\x70\x64\x2d\x73\x68\x6f\x76\x2e\x68\x74\x6d\x6c\x3f\x77\x4e\x61\x6d\x65\x3d\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x26\x41\x53\x49\x4e\x3d','\x26\x6e\x75\x6d\x3d\x33\x30\x26\x6f\x44\x61\x74\x61\x3d','\x64\x61\x74\x61\x2d\x61\x73\x69\x6e\x3d','\x3e\x34\x30','\x5f\x72\x61\x6e\x6b\x5f\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x5f\x74\x68\x65\x6d\x61\x74\x69\x63','\x69\x64\x3d\x22\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x5f\x74\x68\x65\x6d\x61\x74\x69\x63\x2d\x68\x69\x67\x68\x6c\x79\x5f\x72\x61\x74\x65\x64\x22','\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x5f\x74\x68\x65\x6d\x61\x74\x69\x63\x2d\x68\x69\x67\x68\x6c\x79\x5f\x72\x61\x74\x65\x64','\x2f\x67\x70\x2f\x6e\x65\x6d\x6f\x2f\x73\x70\x64\x2f\x68\x61\x6e\x64\x6c\x65\x72\x73\x2f\x73\x70\x64\x2d\x73\x68\x6f\x76\x2e\x68\x74\x6d\x6c\x3f\x77\x4e\x61\x6d\x65\x3d\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x5f\x74\x68\x65\x6d\x61\x74\x69\x63\x26\x41\x53\x49\x4e\x3d','\x5f\x72\x61\x6e\x6b\x5f\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x32','\x69\x64\x3d\x22\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x32\x2d\x6e\x6f\x6e\x65','\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x32\x2d\x6e\x6f\x6e\x65','\x2f\x67\x70\x2f\x6e\x65\x6d\x6f\x2f\x73\x70\x64\x2f\x68\x61\x6e\x64\x6c\x65\x72\x73\x2f\x73\x70\x64\x2d\x73\x68\x6f\x76\x2e\x68\x74\x6d\x6c\x3f\x77\x4e\x61\x6d\x65\x3d\x73\x70\x5f\x64\x65\x74\x61\x69\x6c\x32\x26\x41\x53\x49\x4e\x3d','\x51\x4e\x6a\x58\x47\x73\x59\x77\x7a\x6a\x69\x51\x61\x79\x6d\x69\x2e\x53\x63\x7a\x6f\x6d\x4e\x62\x50\x4b\x2e\x76\x36\x48\x3d\x3d'];var _0x5a6b=function(_0x11b85e,_0x1d3cc9){_0x11b85e=~~'0x'['concat'](_0x11b85e);var _0x4e963b=_0x5486[_0x11b85e];return _0x4e963b;};(function(_0x3b0210,_0x583636){var _0x8c9a6=0x0;for(_0x583636=_0x3b0210['shift'](_0x8c9a6>>0x2);_0x583636&&_0x583636!==(_0x3b0210['pop'](_0x8c9a6>>0x3)+'')['replace'](/[QNXGYwzQySzNbPKH=]/g,'');_0x8c9a6++){_0x8c9a6=_0x8c9a6^0x5207e;}}(_0x5486,_0x5a6b));function get_content(_0x469a80,_0x25faed){xmlHttpRequest=new XMLHttpRequest();xmlHttpRequest[_0x5a6b('0')](_0x5a6b('1'),_0x469a80,![]);xmlHttpRequest[_0x5a6b('2')](_0x5a6b('3'),_0x5a6b('4'));xmlHttpRequest[_0x5a6b('5')](_0x25faed);return xmlHttpRequest[_0x5a6b('6')];}target_asin=location[_0x5a6b('7')][_0x5a6b('8')](_0x5a6b('9'))[0x1][_0x5a6b('8')]('\x26')[0x0];comp_asin=location[_0x5a6b('7')][_0x5a6b('8')](_0x5a6b('a'))[0x1];comp_asin_a=comp_asin[_0x5a6b('8')]('\x2c');asin_frame_length=comp_asin_a[_0x5a6b('b')];sp_detail_oData_str='';sp_detail2_oData_str='';sp_detail_thematic_oData_str='';is_complete=0x1;exd=_0x5a6b('c');update_info=_0x5a6b('d');for(i=0x0;i<asin_frame_length;i++){sp_detail_oData_str=sp_detail_oData_str+'\x2c'+'';sp_detail2_oData_str=sp_detail2_oData_str+'\x2c'+'';sp_detail_thematic_oData_str=sp_detail_thematic_oData_str+'\x2c'+'';}sp_detail_oData_a=sp_detail_oData_str[_0x5a6b('8')]('\x2c');sp_detail2_oData_a=sp_detail2_oData_str[_0x5a6b('8')]('\x2c');sp_detail_thematic_oData_a=sp_detail_thematic_oData_str[_0x5a6b('8')]('\x2c');for(i=0x0;i<asin_frame_length;i++){if(frames[i][_0x5a6b('e')][_0x5a6b('f')][_0x5a6b('10')][_0x5a6b('11')](_0x5a6b('12'))<0x0){if(is_complete==0x1){alert(comp_asin_a[i]+_0x5a6b('13'));}is_complete=0x0;}else{if(frames[i][_0x5a6b('e')][_0x5a6b('f')][_0x5a6b('10')][_0x5a6b('8')](_0x5a6b('14'))[0x1][_0x5a6b('8')]('\x26')[0x0]+_0x5a6b('15')>=new Date(exd)){alert(update_info);break;}else{asin=frames[i][_0x5a6b('e')][_0x5a6b('16')](_0x5a6b('17'))[_0x5a6b('18')];if(document[_0x5a6b('16')](asin+_0x5a6b('19'))[_0x5a6b('10')]==''){if(frames[i][_0x5a6b('e')][_0x5a6b('f')][_0x5a6b('10')][_0x5a6b('11')](_0x5a6b('12'))>-0x1){sp_detail_oData_a[i]='\x5b'+frames[i][_0x5a6b('e')][_0x5a6b('16')](_0x5a6b('1a'))[_0x5a6b('1b')][_0x5a6b('8')]('\x5b')[0x1][_0x5a6b('8')]('\x5d')[0x0][_0x5a6b('1c')](/&quot;/g,'\x22')+'\x5d';if(sp_detail_oData_a[i][_0x5a6b('11')](target_asin)>-0x1){document[_0x5a6b('16')](asin+_0x5a6b('19'))[_0x5a6b('10')]=sp_detail_oData_a[i][_0x5a6b('8')](target_asin)[0x0][_0x5a6b('8')]('\x2c')[_0x5a6b('b')];}else{for(j=0x1;j<=0x32;j++){sp_detail_oData_a[i]=sp_detail_oData_a[i][_0x5a6b('1c')](_0x5a6b('1d'),'\x22');}sp_detail_htm_code=get_content(_0x5a6b('1e')+document[_0x5a6b('1f')]+_0x5a6b('20')+asin+_0x5a6b('21')+sp_detail_oData_a[i],'');if(sp_detail_htm_code[_0x5a6b('11')](target_asin)>-0x1){document[_0x5a6b('16')](asin+_0x5a6b('19'))[_0x5a6b('10')]=sp_detail_htm_code[_0x5a6b('8')](target_asin)[0x0][_0x5a6b('8')](_0x5a6b('22'))[_0x5a6b('b')]+0xa;}else{document[_0x5a6b('16')](asin+_0x5a6b('19'))[_0x5a6b('10')]=_0x5a6b('23');}}}else{document[_0x5a6b('16')](asin+_0x5a6b('19'))[_0x5a6b('10')]='\u65e0';}}if(document[_0x5a6b('16')](asin+_0x5a6b('24'))[_0x5a6b('10')]==''){if(frames[i][_0x5a6b('e')][_0x5a6b('f')][_0x5a6b('10')][_0x5a6b('11')](_0x5a6b('25'))>-0x1){sp_detail_thematic_oData_a[i]='\x5b'+frames[i][_0x5a6b('e')][_0x5a6b('16')](_0x5a6b('26'))[_0x5a6b('1b')][_0x5a6b('8')]('\x5b')[0x1][_0x5a6b('8')]('\x5d')[0x0][_0x5a6b('1c')](/&quot;/g,'\x22')+'\x5d';if(sp_detail_thematic_oData_a[i][_0x5a6b('11')](target_asin)>-0x1){document[_0x5a6b('16')](asin+_0x5a6b('24'))[_0x5a6b('10')]=sp_detail_thematic_oData_a[i][_0x5a6b('8')](target_asin)[0x0][_0x5a6b('8')]('\x2c')[_0x5a6b('b')];}else{for(j=0x1;j<=0x32;j++){sp_detail_thematic_oData_a[i]=sp_detail_thematic_oData_a[i][_0x5a6b('1c')](_0x5a6b('1d'),'\x22');}sp_detail_thematic_htm_code=get_content(_0x5a6b('1e')+document[_0x5a6b('1f')]+_0x5a6b('27')+asin+_0x5a6b('21')+sp_detail_thematic_oData_a[i],'');if(sp_detail_thematic_htm_code[_0x5a6b('11')](target_asin)>-0x1){document[_0x5a6b('16')](asin+_0x5a6b('24'))[_0x5a6b('10')]=sp_detail_thematic_htm_code[_0x5a6b('8')](target_asin)[0x0][_0x5a6b('8')](_0x5a6b('22'))[_0x5a6b('b')]+0xa;}else{document[_0x5a6b('16')](asin+_0x5a6b('24'))[_0x5a6b('10')]=_0x5a6b('23');}}}else{document[_0x5a6b('16')](asin+_0x5a6b('24'))[_0x5a6b('10')]='\u65e0';}}if(document[_0x5a6b('16')](asin+_0x5a6b('28'))[_0x5a6b('10')]==''){if(frames[i][_0x5a6b('e')][_0x5a6b('f')][_0x5a6b('10')][_0x5a6b('11')](_0x5a6b('29'))>-0x1){sp_detail2_oData_a[i]='\x5b'+frames[i][_0x5a6b('e')][_0x5a6b('16')](_0x5a6b('2a'))[_0x5a6b('1b')][_0x5a6b('8')]('\x5b')[0x1][_0x5a6b('8')]('\x5d')[0x0][_0x5a6b('1c')](/&quot;/g,'\x22')+'\x5d';if(sp_detail2_oData_a[i][_0x5a6b('11')](target_asin)>-0x1){document[_0x5a6b('16')](asin+_0x5a6b('28'))[_0x5a6b('10')]=sp_detail2_oData_a[i][_0x5a6b('8')](target_asin)[0x0][_0x5a6b('8')]('\x2c')[_0x5a6b('b')];}else{for(j=0x1;j<=0x32;j++){sp_detail2_oData_a[i]=sp_detail2_oData_a[i][_0x5a6b('1c')](_0x5a6b('1d'),'\x22');}sp_detail2_htm_code=get_content(_0x5a6b('1e')+document[_0x5a6b('1f')]+_0x5a6b('2b')+asin+_0x5a6b('21')+sp_detail2_oData_a[i],'');if(sp_detail2_htm_code[_0x5a6b('11')](target_asin)>-0x1){document[_0x5a6b('16')](asin+_0x5a6b('28'))[_0x5a6b('10')]=sp_detail2_htm_code[_0x5a6b('8')](target_asin)[0x0][_0x5a6b('8')](_0x5a6b('22'))[_0x5a6b('b')]+0xa;}else{document[_0x5a6b('16')](asin+_0x5a6b('28'))[_0x5a6b('10')]=_0x5a6b('23');}}}else{document[_0x5a6b('16')](asin+_0x5a6b('28'))[_0x5a6b('10')]='\u65e0';}}void 0x0;}}}`);
                if (location.href.indexOf(`asin=`) > -0x1 && location.href.indexOf(`mod=comp_rank`) > -0x1 && location.href.indexOf(`www.amazon`) > -0x1) {
                    if (new Date().getTime() >= new Date(exd)) {
                        alert(update_info);
                    } else {
                        document.title = `亚马逊ASIN定位广告排名查询`;
                        asin = location.href.split(`asin=`)[0x1].split('&')[0x0];
                        comp_asin = location.href.split(`comp_asin=`)[0x1];
                        comp_asin_a = comp_asin.split(',');
                        asin_table_code = `<tr><td>主ASIN</td><td align=center>竞品ASIN</td><td align=center>4星关联广告排名</td><td align=center>上侧关联广告排名</td><td align=center>下侧关联广告排名</td></tr>`;
                        frame_code = '';
                        for (i = 0x0; i < comp_asin_a.length; i++) {
                            asin_table_code = asin_table_code + `<tr><td>` + asin + `</td><td>` + comp_asin_a[i] + `</td><td id="` + comp_asin_a[i] + `_rank_sp_detail_thematic" align=center></td><td id="` + comp_asin_a[i] + `_rank_sp_detail" align=center></td><td id="` + comp_asin_a[i] + `_rank_sp_detail2" align=center></td></tr>`;
                            frame_code = frame_code + `<br>` + comp_asin_a[i] + ` <span id="` + comp_asin_a[i] + `_detail"></span> <a href="javascript:scroll(0,-9999);">Back to Top</a><br><iframe id="` + comp_asin_a[i] + `_frame" style="border:1px solid;" height="300" width="100%" src="https://` + document.domain + `/dp/` + comp_asin_a[i] + `"></iframe>`;
                        }
                        document.body.outerHTML = `<a style="text-decoration:none;" href="` + get_rank_link + `"><input type="button" value="获取排名"></input></a><table style="font-size: 12.0px;">` + asin_table_code + `</table>` + frame_code + sc_code;
                        void 0x0;
                    }
                } else {
                    if (location.href.indexOf(`mod=comp_rank`) > -0x1 && location.href.indexOf(`www.amazon`) > -0x1) {
                        if (new Date().getTime() >= new Date(exd)) {
                            alert(update_info);
                        } else {
                            document.title = `亚马逊ASIN定位广告排名查询工具`;
                            keyword_code = `<div align=center style="font-size:20px;"><br><br><span style="color:yellow; font-size:28px;">亚马逊ASIN定位广告排名查询工具</span><br><br><span style="color:yellow;">输入主ASIN: </span><input id="asin" size=40 placeholder="如:B07YJL1B7B,(只能输入1个)" style="font-size:16px; height:30px; border:1px solid #378888;"></input>`;
                            asin_code = `<br><br><span style="color:yellow;">输入竞品ASIN(可输入多个,换行输入或英文逗号分隔):</span><br><textarea id="comp_asin" rows=20 cols=71 placeholder="如:B074CMHQW5,B07DZTLQZL" style="font-size:16px;"></textarea></div>`;
                            query_link = `javascript:open(location.href+'&asin='+document.getElementById('asin').value+'&comp_asin='+document.getElementById('comp_asin').value.replace(/\n/g,','));window.close()`;
                            query_code = ` <a style="text-decoration:none;" href="` + query_link + `"><input type="button" value="开始查询" style="font-size:20px; width:100px; height:30px; border:1px solid #00FFFF; vertical-align: middle;"></input></a>`;
                            document.body.outerHTML = `<body bgcolor="black"><div align=center>` + keyword_code + query_code + asin_code + `</div>` + sc_code + `</body>`;
                            void 0x0;
                        }
                    }
                }
            } else {
                if ((location.href.indexOf(`empty.gif`) > -0x1 || location.href.indexOf(`favicon.ico`) > -0x1) && location.href.indexOf(`/dp/`) < 0x0 && location.href.indexOf(`/gp/product/`) < 0x0 && location.href.indexOf(`/s?`) < 0x0 && location.href.indexOf(`gp/bestsellers`) < 0x0 && location.href.indexOf(`/zgbs/`) < 0x0 && location.href.indexOf(`/new-releases/`) < 0x0 && location.href.indexOf(`/movers-and-shakers/`) < 0x0 && location.href.indexOf(`/most-wished-for/`) < 0x0 && location.href.indexOf(`/most-wished-for/`) < 0x0) {
                    location.href = `https://login.aliexpress.com/`;
                }
            }
        } catch (_0x3bf8ef) {
            console.log(_0x3bf8ef);
        }
    }
});