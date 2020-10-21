function open_stat(_0x876771) {
    switch (document.domain.replace(`www.`, '')) {
        case `amazon.com`:
            marketplaceID = `ATVPDKIKX0DER`;
            break;
        case `amazon.ca`:
            marketplaceID = `A2EUQ1WTGCTBG2`;
            break;
        case `amazon.com.mx`:
            marketplaceID = `A1AM78C64UM0Y8`;
            break;
        case `amazon.co.uk`:
            marketplaceID = `A1F83G8C2ARO7P`;
            break;
        case `amazon.de`:
            marketplaceID = `A1PA6795UKMFR9`;
            break;
        case `amazon.es`:
            marketplaceID = `A1RKKUPIHCS9HS`;
            break;
        case `amazon.fr`:
            marketplaceID = `A13V1IB3VIYZZH`;
            break;
        case `amazon.it`:
            marketplaceID = `APJ6JRA9NG5V4`;
            break;
        case `amazon.co.jp`:
            marketplaceID = `A1VC38T7YXB528`;
            break;
        case `amazon.com.au`:
            marketplaceID = `A39IBJ37TRP1C6`;
    }

    function _0x1cfe3d(_0x523df7, _0x5c4802) {
        xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open(`GET`, _0x523df7, ![]);
        xmlHttpRequest.setRequestHeader(`Content-Type`, `application/json; charset=UTF-8`);
        xmlHttpRequest.send(_0x5c4802);
        return xmlHttpRequest.responseText;
    }

    is_bestseller = 0x0;
    if (location.href.indexOf(`page=`) > -0x1) {
        current_page = location.href.split(`&page=`)[0x1].split('&')[0x0];
    } else {
        if (location.href.indexOf(`pg=`) < 0x0) {
            current_page = 0x1;
        } else {
            current_page = location.href.split(`&pg=`)[0x1].split('&')[0x0];
        }
    }
    next_page_code = `<a href="` + location.href.replace(`html`, `html?`).replace(`html??`, `html?`).replace(`&pg=1`, '').split(`&page=`)[0x0] + `&pg=` + Number(Number(current_page) + 0x1) + `&page=` + Number(Number(current_page) + 0x1) + `">下一页</a>` + ' ';
    former_page_code = `<a href="javascript:location.href=location.href;">返回普通视图</a> <a href="` + location.href.split(`&page=`)[0x0].replace(`&pg=2`, '') + `&pg=` + Number(Number(current_page) - 0x1) + `&page=` + Number(Number(current_page) - 0x1) + `">上一页</a>` + ' ';
    keyword = document.getElementById(`twotabsearchtextbox`).value;
    htm_code = document.body.innerHTML;
    if (htm_code.indexOf(`zg-badge-text">#`) > -0x1) {
        search_count_code = document.getElementsByTagName(`title`)[0x0].innerHTML + `   本页产品数: `;
    } else {
        if (htm_code.indexOf(`s-result-count">`) > -0x1) {
            search_count_code = htm_code.split(`s-result-count">`)[0x1].split(`</div>`)[0x0] + `   本页产品数: `;
        } else {
            search_count_code = htm_code.split(`a-spacing-top-small">`)[0x1].split(`</div>`)[0x0] + `   本页产品数: `;
        }
    }
    if (htm_code.indexOf(`"s-search-results"`) > -0x1) {
        htm_code = htm_code.split(`"s-search-results"`)[0x1].split(`-deals?`)[0x0];
    }
    if (htm_code.indexOf(`zg-badge-text">#`) > -0x1) {
        page_2_code = _0x1cfe3d(location.href + (location.href.indexOf('?') > -0x1 ? `&pg=2` : `/?pg=2`));
        htm_code = htm_code + page_2_code;
        a = htm_code.split(`zg-badge-text">#`);
        is_bestseller = 0x1;
    } else {
        pageNo = document.getElementById(`pageNo`).value;
        if (pageNo > 0x1) {
            for (page_i = 0x2; page_i <= pageNo; page_i++) {
                htm_code = htm_code + _0x1cfe3d(location.href + `&page=` + page_i);
            }
        }
        if (htm_code.indexOf(`data-index="`) > -0x1) {
            a = htm_code.split(`data-index="`);
        } else {
            a = htm_code.split(`data-asin="`);
        }
    }
    img_width = 0xf0;
    frame_width = 0xfa;
    keepa_height = 0x96;
    var _0xa04c48 = former_page_code + next_page_code + search_count_code;
    display_code = '';
    table_code = `<tr><td>ASIN</td><td>图片网址</td><td align=center>标题</td><td>价格</td><td>是否FBA</td><td>评论数</td><td>评分</td><td>页码</td><td>页面排名</td></tr>`;
    total_review = 0x0;
    max_review = 0x0;
    product_count = 0x0;
    natural_product_count = 0x0;
    total_prime = 0x0;
    total_price = 0x0;
    max_price = 0x0;
    real_product_count = 0x0;
    price_interval_a = [`(0,10]`, `(10,30]`, `(30,50]`, `(50,100]`, `(100,200]`, `200+`];
    price_interval_count_a = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
    price_interval_show_a = ['', '', '', '', '', ''];
    review_interval_a = ['0', `(0,100]`, `(100,500]`, `(500,1000]`, `(1000,3000]`, `3000+`];
    review_interval_count_a = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
    review_interval_show_a = ['', '', '', '', '', ''];
    ave_price_interval_a = [`1-3名均价`, `4-10名均价`, `11-20名均价`, `21-30名均价`, `31-50名均价`, `50名以上均价`];
    ave_price_interval_count_a = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
    ave_price_interval_sum_a = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
    ave_price_interval_value_a = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
    ave_price_interval_show_a = ['', '', '', '', '', ''];
    ave_review_interval_a = [`1-3名平均评论数`, `4-10名平均评论数`, `11-20名平均评论数`, `21-30名平均评论数`, `31-50名平均评论数`, `50名以上平均评论数`];
    ave_review_interval_sum_a = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
    ave_review_interval_value_a = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
    ave_review_interval_show_a = ['', '', '', '', '', ''];
    letter_a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    for (i = 0x1; i < a.length; i++) {
        if (a[i - 0x1].indexOf(`data-asin=""`) < 0x0 && (is_bestseller == 0x1 || a[i - 0x1].indexOf(`threepsl`) < 0x0 && a[i].indexOf(`s-result-item`) > -0x1)) {
            product_count = product_count + 0x1;
            if (a[i].indexOf(`slredirect`) > -0x1) {
                spon_code = `<br><font color=red size=5><b>广告</b></font>`;
                if (a[i].indexOf(`dp%2F`) > -0x1) {
                    product_id = a[i].split(`dp%2F`)[0x1].split('%')[0x0];
                } else {
                    if (a[i].indexOf(`dp/`) > -0x1) {
                        product_id = a[i].split(`dp/`)[0x1].split('/')[0x0];
                    } else {
                        product_id = '';
                    }
                }
            } else {
                spon_code = '';
                if (a[i].indexOf(`dp/`) > -0x1) {
                    product_id = a[i].split(`dp/`)[0x1].split('/')[0x0];
                } else {
                    product_id = '';
                }
            }
            product_id_code = `<br><a href="https://` + document.domain + `/dp/` + product_id + '">' + product_id + `</a>`;
            if (a[i].indexOf(`product-reviews`) > -0x1) {
                reviews = a[i].split(`product-reviews`)[0x2].split('>')[0x1].split('<')[0x0].replace('.', '').replace(',', '').replace(' ', '');
                rating = a[i].split(`a-icon-alt">`)[0x1].split(' ')[0x0].replace(`5つ星のうち`, '').replace('<i', '');
            } else {
                if (a[i].indexOf(`customerReviews`) > -0x1) {
                    reviews_a = a[i].split(`customerReviews`)[0x1].split('</')[0x0].split('>');
                    reviews = reviews_a[reviews_a.length - 0x1].replace('.', '').replace(',', '').replace(' ', '');
                    if (a[i].indexOf(`a-icon-alt">`) > -0x1) {
                        rating = a[i].split(`a-icon-alt">`)[0x1].split(' ')[0x0].replace(`5つ星のうち`, '').replace('<i', '');
                    } else {
                        if (a[i].indexOf(`aria-label="`) > -0x1) {
                            rating = a[i].split(`aria-label="`)[0x1].split(' ')[0x0].replace(`5つ星のうち`, '').replace('<i', '');
                        } else {
                            rating = 0x0;
                        }
                    }
                } else {
                    reviews = 0x0;
                    rating = 0x0;
                }
            }
            if (spon_code == '') {
                if (reviews == 0x0) {
                    review_interval_show_a[0x0] = review_interval_show_a[0x0] + `&nbsp`;
                    review_interval_count_a[0x0] = review_interval_count_a[0x0] + 0x1;
                } else {
                    if (reviews <= 0x64) {
                        review_interval_show_a[0x1] = review_interval_show_a[0x1] + `&nbsp`;
                        review_interval_count_a[0x1] = review_interval_count_a[0x1] + 0x1;
                    } else {
                        if (reviews <= 0x1f4) {
                            review_interval_show_a[0x2] = review_interval_show_a[0x2] + `&nbsp`;
                            review_interval_count_a[0x2] = review_interval_count_a[0x2] + 0x1;
                        } else {
                            if (reviews <= 0x3e8) {
                                review_interval_show_a[0x3] = review_interval_show_a[0x3] + `&nbsp`;
                                review_interval_count_a[0x3] = review_interval_count_a[0x3] + 0x1;
                            } else {
                                if (reviews <= 0xbb8) {
                                    review_interval_show_a[0x4] = review_interval_show_a[0x4] + `&nbsp`;
                                    review_interval_count_a[0x4] = review_interval_count_a[0x4] + 0x1;
                                } else {
                                    review_interval_show_a[0x5] = review_interval_show_a[0x5] + `&nbsp`;
                                    review_interval_count_a[0x5] = review_interval_count_a[0x5] + 0x1;
                                }
                            }
                        }
                    }
                }
                natural_product_count = natural_product_count + 0x1;
                total_review = total_review + Number(reviews);
                if (Number(reviews) > max_review) {
                    max_review = Number(reviews);
                }
            }
            review_code = `<a href="https://` + document.domain + `/product-reviews/` + product_id + `">Reviews: <span id="` + product_id + `_reviews">` + reviews + `</span></a> (<span id="` + product_id + `_rating">` + rating + `</span>)`;
            rating_code = `<br>Rating: <span id="` + product_id + `_rating">` + rating + `</span>`;
            if (htm_code.indexOf(`zg-badge-text">#`) > -0x1) {
                if (a[i].indexOf(`p13n-sc-price`) > -0x1) {
                    price = a[i].split(`p13n-sc-price`)[0x1].split('>')[0x1].split('<')[0x0].split(' ')[0x0].split(decodeURI(`%C2%A0`))[0x0];
                } else {
                    price = '无';
                }
            } else {
                if (a[i].replace(`a-offscreen">[Sponsored]`, '').indexOf(`a-offscreen">`) > -0x1) {
                    price = a[i].replace(`a-offscreen">[Sponsored]`, '').split(`a-offscreen">`)[0x1].split('<')[0x0];
                    if (price.length > 0x64) {
                        price = '无';
                    }
                } else {
                    price = '无';
                }
            }
            if (document.domain.indexOf(`amazon.de`) > -0x1 || document.domain.indexOf(`amazon.es`) > -0x1 || document.domain.indexOf(`amazon.fr`) > -0x1 || document.domain.indexOf(`amazon.it`) > -0x1) {
                price = Number(price.replace('￥', '').replace(`CDN$&nbsp;`, '').replace(`CDN$`, '').replace('$', '').replace('$', '').replace('£', '').replace(`&nbsp;€`, '').replace(`EUR `, '').replace('.', '').replace(',', '.'));
            } else {
                price = Number(price.replace('￥', '').replace(`CDN$&nbsp;`, '').replace(`CDN$`, '').replace('$', '').replace('$', '').replace('£', '').replace(`&nbsp;€`, '').replace(`EUR `, '').replace(',', ''));
            }
            if (price != '无' && spon_code == '') {
                price_num = price;
                total_price = total_price + price_num;
                if (price_num > max_price) {
                    max_price = price_num;
                }
                real_product_count = real_product_count + 0x1;
                if (price_num <= 0xa) {
                    price_interval_show_a[0x0] = price_interval_show_a[0x0] + `&nbsp`;
                    price_interval_count_a[0x0] = price_interval_count_a[0x0] + 0x1;
                } else {
                    if (price_num <= 0x1e) {
                        price_interval_show_a[0x1] = price_interval_show_a[0x1] + `&nbsp`;
                        price_interval_count_a[0x1] = price_interval_count_a[0x1] + 0x1;
                    } else {
                        if (price_num <= 0x32) {
                            price_interval_show_a[0x2] = price_interval_show_a[0x2] + `&nbsp`;
                            price_interval_count_a[0x2] = price_interval_count_a[0x2] + 0x1;
                        } else {
                            if (price_num <= 0x64) {
                                price_interval_show_a[0x3] = price_interval_show_a[0x3] + `&nbsp`;
                                price_interval_count_a[0x3] = price_interval_count_a[0x3] + 0x1;
                            } else {
                                if (price_num <= 0xc8) {
                                    price_interval_show_a[0x4] = price_interval_show_a[0x4] + `&nbsp`;
                                    price_interval_count_a[0x4] = price_interval_count_a[0x4] + 0x1;
                                } else {
                                    price_interval_show_a[0x5] = price_interval_show_a[0x5] + `&nbsp`;
                                    price_interval_count_a[0x5] = price_interval_count_a[0x5] + 0x1;
                                }
                            }
                        }
                    }
                }
                if (natural_product_count <= 0x3) {
                    ave_price_interval_count_a[0x0] = ave_price_interval_count_a[0x0] + 0x1;
                    ave_price_interval_sum_a[0x0] = ave_price_interval_sum_a[0x0] + price_num;
                    ave_price_interval_value_a[0x0] = ave_price_interval_sum_a[0x0] / ave_price_interval_count_a[0x0];
                    ave_review_interval_sum_a[0x0] = ave_review_interval_sum_a[0x0] + Number(reviews);
                    ave_review_interval_value_a[0x0] = ave_review_interval_sum_a[0x0] / ave_price_interval_count_a[0x0];
                } else {
                    if (natural_product_count <= 0xa) {
                        ave_price_interval_count_a[0x1] = ave_price_interval_count_a[0x1] + 0x1;
                        ave_price_interval_sum_a[0x1] = ave_price_interval_sum_a[0x1] + price_num;
                        ave_price_interval_value_a[0x1] = ave_price_interval_sum_a[0x1] / ave_price_interval_count_a[0x1];
                        ave_review_interval_sum_a[0x1] = ave_review_interval_sum_a[0x1] + Number(reviews);
                        ave_review_interval_value_a[0x1] = ave_review_interval_sum_a[0x1] / ave_price_interval_count_a[0x1];
                    } else {
                        if (natural_product_count <= 0x14) {
                            ave_price_interval_count_a[0x2] = ave_price_interval_count_a[0x2] + 0x1;
                            ave_price_interval_sum_a[0x2] = ave_price_interval_sum_a[0x2] + price_num;
                            ave_price_interval_value_a[0x2] = ave_price_interval_sum_a[0x2] / ave_price_interval_count_a[0x2];
                            ave_review_interval_sum_a[0x2] = ave_review_interval_sum_a[0x2] + Number(reviews);
                            ave_review_interval_value_a[0x2] = ave_review_interval_sum_a[0x2] / ave_price_interval_count_a[0x2];
                        } else {
                            if (natural_product_count <= 0x1e) {
                                ave_price_interval_count_a[0x3] = ave_price_interval_count_a[0x3] + 0x1;
                                ave_price_interval_sum_a[0x3] = ave_price_interval_sum_a[0x3] + price_num;
                                ave_price_interval_value_a[0x3] = ave_price_interval_sum_a[0x3] / ave_price_interval_count_a[0x3];
                                ave_review_interval_sum_a[0x3] = ave_review_interval_sum_a[0x3] + Number(reviews);
                                ave_review_interval_value_a[0x3] = ave_review_interval_sum_a[0x3] / ave_price_interval_count_a[0x3];
                            } else {
                                if (natural_product_count <= 0x32) {
                                    ave_price_interval_count_a[0x4] = ave_price_interval_count_a[0x4] + 0x1;
                                    ave_price_interval_sum_a[0x4] = ave_price_interval_sum_a[0x4] + price_num;
                                    ave_price_interval_value_a[0x4] = ave_price_interval_sum_a[0x4] / ave_price_interval_count_a[0x4];
                                    ave_review_interval_sum_a[0x4] = ave_review_interval_sum_a[0x4] + Number(reviews);
                                    ave_review_interval_value_a[0x4] = ave_review_interval_sum_a[0x4] / ave_price_interval_count_a[0x4];
                                } else {
                                    ave_price_interval_count_a[0x5] = ave_price_interval_count_a[0x5] + 0x1;
                                    ave_price_interval_sum_a[0x5] = ave_price_interval_sum_a[0x5] + price_num;
                                    ave_price_interval_value_a[0x5] = ave_price_interval_sum_a[0x5] / ave_price_interval_count_a[0x5];
                                    ave_review_interval_sum_a[0x5] = ave_review_interval_sum_a[0x5] + Number(reviews);
                                    ave_review_interval_value_a[0x5] = ave_review_interval_sum_a[0x5] / ave_price_interval_count_a[0x5];
                                }
                            }
                        }
                    }
                }
            }
            price_code = `<br><font color="#bd1a1d"><b><span id="` + product_id + `_price">` + price + `</span></b></font>`;
            if (htm_code.indexOf(`zg-badge-text">#`) > -0x1) {
                if (a[i].indexOf(`data-rows="2">`) > -0x1) {
                    productTitle = a[i].split(`data-rows="2">`)[0x1].split('</')[0x0].trim();
                } else {
                    if (a[i].indexOf(`title="`) > -0x1) {
                        productTitle = a[i].split(`title="`)[0x1].split('"')[0x0];
                    } else {
                        productTitle = '';
                    }
                }
            } else {
                if (a[i].indexOf(`alt="`) > -0x1) {
                    if (a[i].split(`alt="`)[0x1].indexOf(`a-text-normal" dir="auto">`) > -0x1) {
                        productTitle = a[i].split(`alt="`)[0x1].split(`a-text-normal" dir="auto">`)[0x1].split(`</span>`)[0x0];
                    } else {
                        productTitle = '';
                    }
                }
            }
            title_code = `<br><a href="https://` + document.domain + `/dp/` + product_id + '">' + productTitle.substr(0x0, document.domain.indexOf(`amazon.co.jp`) > -0x1 ? 0x14 : 0x1e) + `...</a>`;
            if (a[i].indexOf(`>Choice<`) > -0x1) {
                choice_code = `<font style="background: #135753; color:white;">AmazonChoice</font>`;
            } else {
                choice_code = '';
            }
            if (a[i].indexOf(`>Best Seller<`) > -0x1) {
                bsr_code = `<font style="background: #DAA520; color:white;">&nbsp;&nbsp;&nbsp;Best&nbsp;&nbsp;Seller&nbsp;&nbsp;&nbsp;</font>`;
            } else {
                bsr_code = '';
            }
            if (a[i].indexOf(`src="`) > -0x1) {
                productImage = a[i].split(`src="`)[0x1].split('"')[0x0].replace(`.jpg`, `_SR` + img_width + ',' + img_width + `_.jpg`);
            } else {
                productImage = '';
            }
            image_code = `<label><input type="checkbox" id="` + product_id + `" name="asin_list">` + product_count + '.' + choice_code + bsr_code + `<img width=` + img_width + ` height=` + img_width + ` src="` + productImage + `"></label>`;
            if (a[i].indexOf(`a-icon-prime`) > -0x1) {
                prime_code = `<br><font style="color: #009ED6;"><b>prime</b></font>`;
                total_prime = total_prime + 0x1;
            } else {
                prime_code = '';
            }
            if (a[i].indexOf(`>by </span>`) > -0x1) {
                brand_name = a[i].split(`>by </span>`)[0x1].split('>')[0x1].split('<')[0x0];
                brand_count = htm_code.split('">' + brand_name + `</span>`).length - 0x1;
                brand_code = `<br>by <b>` + brand_name + '(' + brand_count + `)</b>`;
            } else {
                if (a[i].indexOf(`</h2>`) > -0x1) {
                    if (a[i].split(`</h2>`)[0x1].split(`</div>`)[0x0].indexOf(`</span><span class="a-size-base">`) > -0x1) {
                        brand_name = a[i].split(`</h2>`)[0x1].split(`</div>`)[0x0].split(`</span><span class="a-size-base">`)[0x1].split('<')[0x0];
                        brand_count = htm_code.split('">' + brand_name + `</span>`).length - 0x1;
                        brand_code = `<br>by <b>` + brand_name + '(' + brand_count + `)</b>`;
                    } else {
                        brand_code = '';
                    }
                } else {
                    brand_code = '';
                }
            }
            reverse_keyword_code = `<br><a href="https://www.sellersprite.com/favicon.ico?reverse-asin/` + document.domain.slice(-0x2).replace('om', 'US').toUpperCase() + '/' + product_id + `">主流量词</a>`;
            asin_sale_code = `<br><a href="https://` + document.domain + `/favicon.ico?mod=asin_sale&asin=` + product_id + `">查看Helium10销量</a>`;
            keepa_code = `<br><a href="https://keepa.com/iframe_addon.html#` + document.domain.replace(`www.amazon.com`, '1').replace(`www.amazon.ca`, '6').replace(`www.amazon.com.mx`, '11').replace(`www.amazon.co.uk`, '2').replace(`www.amazon.de`, '3').replace(`www.amazon.es`, '9').replace(`www.amazon.fr`, '4').replace(`www.amazon.it`, '8').replace(`www.amazon.co.jp`, '5').replace(`www.amazon.com.au`, '13') + `-0-` + product_id + `">打开Keepa</a>`;
            keepa_pic_code = `<br><iframe style="border:1px solid;" scrolling="no" width=` + frame_width + ` height=` + keepa_height + ` src="https://graph.keepa.com/pricehistory.png?domain=` + document.domain.replace(`www.amazon.`, '') + `&width=1&height=1&range=` + _0x876771 + `&salesrank=1&asin=` + product_id + `"></iframe>`;
            display_code = display_code + `<div style="border: 1.0px  #dedede;vertical-align: top;text-align: left;color: #666666;width: ` + img_width + `.0px;padding: 5.0px 5.0px;margin: 5.0px 5.0px 5.0px 0;word-break: break-all;display: inline-block;font-size: 12.0px;">` + image_code + review_code + price_code + product_id_code + title_code + reverse_keyword_code + asin_sale_code + keepa_code + keepa_pic_code + prime_code + brand_code + spon_code + `</div>`;
            if (spon_code == '') {
                table_code = table_code + `<tr><td>` + product_id + `</td><td><img height=40 src="` + productImage + `" title="` + productImage + `"></td><td>` + productTitle + `</td><td>` + price + `</td><td>` + prime_code.replace(`<br><font style="color: #009ED6;"><b>`, '').replace(`</b></font>`, '') + `</td><td>` + reviews + `</td><td>` + rating + `</td><td>` + current_page + `</td><td>` + natural_product_count + `</td></tr>`;
            }
        }
    }
    ave_price = total_price / real_product_count;
    ave_price = ave_price.toFixed(0x2);
    price_interval_code = `<tr><td>自然产品</td><td>价格分布</td><td align=center>筛选</td>`;
    for (i = 0x0; i < price_interval_a.length; i++) {
        begin_number = i < price_interval_a.length - 0x1 ? price_interval_a[i].split('(')[0x1].split(',')[0x0] : price_interval_a[i].split('+')[0x0];
        end_number = i < price_interval_a.length - 0x1 ? price_interval_a[i].split(',')[0x1].split(']')[0x0] : 0x2710;
        price_interval_code = price_interval_code + `<tr><td>` + price_interval_a[i] + `</td><td><font style="background: #135753;">` + price_interval_show_a[i] + `</font>` + price_interval_count_a[i] + `</td><td><a style="text-decoration:none;" href="javascript:asin_a=document.getElementsByName('asin_list');a=document.getElementById('display_code').innerHTML.split('name=%22asin_list');for(i=0;i<asin_a.length;i++){if(a[i+1].indexOf('_price')>-1 && a[i+1].indexOf('广告')<0){if(Number(a[i+1].split('_price%22>')[1].split('<')[0])>` + begin_number + ` && Number(a[i+1].split('_price%22>')[1].split('<')[0])<=` + end_number + `){asin_a[i].checked=true;}}}void(0);"><input id="check_all" type="button" value="选择"></a></td></tr>`;
    }
    price_interval_code = price_interval_code + `</tr>`;
    ave_review = total_review / natural_product_count;
    ave_review = ave_review.toFixed(0x0);
    review_interval_code = `<tr><td>自然产品</td><td>评论分布</td><td align=center>筛选</td>`;
    for (i = 0x0; i < review_interval_a.length; i++) {
        begin_number = i == 0x0 ? -0x1 : i < review_interval_a.length - 0x1 ? review_interval_a[i].split('(')[0x1].split(',')[0x0] : review_interval_a[i].split('+')[0x0];
        end_number = i == 0x0 ? 0x0 : i < review_interval_a.length - 0x1 ? review_interval_a[i].split(',')[0x1].split(']')[0x0] : 0xf4240;
        review_interval_code = review_interval_code + `<tr><td>` + review_interval_a[i] + `</td><td><font style="background: #135753;">` + review_interval_show_a[i] + `</font>` + review_interval_count_a[i] + `</td><td><a style="text-decoration:none;" href="javascript:asin_a=document.getElementsByName('asin_list');a=document.getElementById('display_code').innerHTML.split('name=%22asin_list');for(i=0;i<asin_a.length;i++){if(a[i+1].indexOf('_review')>-1 && a[i+1].indexOf('广告')<0){if(Number(a[i+1].split('_reviews%22>')[1].split('<')[0])>` + begin_number + ` && Number(a[i+1].split('_reviews%22>')[1].split('<')[0])<=` + end_number + `){asin_a[i].checked=true;}}}void(0);"><input id="check_all" type="button" value="选择"></a></td></tr>`;
    }
    review_interval_code = review_interval_code + `</tr>`;
    ave_price_interval_code = `<tr><td>自然产品排名划分</td><td>总均价: ` + ave_price + `</td><td align=center>筛选</td>`;
    for (i = 0x0; i < ave_price_interval_a.length; i++) {
        begin_number = i < ave_price_interval_a.length - 0x1 ? ave_price_interval_a[i].split('-')[0x0] : Number(ave_price_interval_a[i].split('名')[0x0]) + 0x1;
        end_number = i < ave_price_interval_a.length - 0x1 ? ave_price_interval_a[i].split('-')[0x1].split('名')[0x0] : 0x2710;
        if (ave_price_interval_sum_a[i] > 0x0) {
            for (j = 0x1; j <= ave_price_interval_value_a[i] / max_price * 0x28; j++) {
                ave_price_interval_show_a[i] = ave_price_interval_show_a[i] + `&nbsp;`;
            }
        }
        ave_price_interval_code = ave_price_interval_code + `<tr><td>` + ave_price_interval_a[i] + `</td><td><font style="background: #135753;">` + ave_price_interval_show_a[i] + `</font>` + ave_price_interval_value_a[i].toFixed(0x2) + `</td><td><a style="text-decoration:none;" href="javascript:asin_a=document.getElementsByName('asin_list');a=document.getElementById('display_code').innerHTML.split('name=%22asin_list');spon_count=0;for(i=0;i<asin_a.length;i++){if(a[i+1].indexOf('广告')>-1){spon_count=spon_count+1;}else{if(i+1-spon_count>=` + begin_number + `&&i+1-spon_count<=` + end_number + `){asin_a[i].checked=true;}}}void(0);"><input id="check_all" type="button" value="选择"></a></td></tr>`;
    }
    ave_price_interval_code = ave_price_interval_code + `</tr>`;
    if (document.body.innerHTML.split(`&ts=`)[0x1].split('&')[0x0] >= new Date(`2020-10-01`)) {
        alert(`此功能需联系作者开通使用 作者QQ: 369593212`);
    } else {
        ave_review_interval_code = `<tr><td>自然产品排名划分</td><td>总平均评论数: ` + ave_review + `</td><td align=center>筛选</td>`;
        for (i = 0x0; i < ave_review_interval_a.length; i++) {
            begin_number = i < ave_review_interval_a.length - 0x1 ? ave_review_interval_a[i].split('-')[0x0] : Number(ave_review_interval_a[i].split('名')[0x0]) + 0x1;
            end_number = i < ave_review_interval_a.length - 0x1 ? ave_review_interval_a[i].split('-')[0x1].split('名')[0x0] : 0x2710;
            if (ave_review_interval_sum_a[i] > 0x0) {
                for (j = 0x1; j <= ave_review_interval_value_a[i] / max_review * 0x28; j++) {
                    ave_review_interval_show_a[i] = ave_review_interval_show_a[i] + `&nbsp;`;
                }
            }
            ave_review_interval_code = ave_review_interval_code + `<tr><td>` + ave_review_interval_a[i] + `</td><td><font style="background: #135753;">` + ave_review_interval_show_a[i] + `</font>` + ave_review_interval_value_a[i].toFixed(0x0) + `</td><td><a style="text-decoration:none;" href="javascript:asin_a=document.getElementsByName('asin_list');a=document.getElementById('display_code').innerHTML.split('name=%22asin_list');spon_count=0;for(i=0;i<asin_a.length;i++){if(a[i+1].indexOf('广告')>-1){spon_count=spon_count+1;}else{if(i+1-spon_count>=` + begin_number + `&&i+1-spon_count<=` + end_number + `){asin_a[i].checked=true;}}}void(0);"><input id="check_all" type="button" value="选择"></a></td></tr>`;
        }
        ave_review_interval_code = ave_review_interval_code + `</tr>`;
        bottom_code = `<div align=center style="font-size:14px;"><font color="#bd1a1d"><b><hr noshade="noshade" size=1>自然排名产品数据表</b></font></div><table style="font-size: 12.0px;">` + table_code;
        document.write(`<div style="font-size:12px;">` + _0xa04c48 + product_count + ` 本页Prime产品数: ` + total_prime + ` <a style="text-decoration:none;" href="javascript:comp_asin_code='';a=document.getElementsByTagName('input');for(i=0;i<a.length;i++){if(a[i].checked==true){comp_asin=a[i].outerHTML.split('id=%22')[1].split('%22')[0];comp_price=document.getElementById(comp_asin+'_price').innerHTML;comp_reviews=document.getElementById(comp_asin+'_reviews').innerHTML;comp_rating=document.getElementById(comp_asin+'_rating').innerHTML;comp_asin_code=comp_asin_code+'['+comp_asin+';'+(comp_price.length>10?'':comp_price)+';'+(comp_reviews.length>10?'':comp_reviews)+';'+(comp_rating.length>5?'':comp_rating)+']';}}open('https://'+document.domain+'/favicon.ico?mod=asin_compare&info=sale&asins='+comp_asin_code);void(0);"><input type="button" value="比对竞品"></input></a> <a style="text-decoration:none;" href="javascript:comp_asin_code='';a=document.getElementsByTagName('input');for(i=0;i<a.length;i++){if(a[i].checked==true){comp_asin=a[i].outerHTML.split('id=%22')[1].split('%22')[0];comp_asin_code=comp_asin_code+(comp_asin_code==''?'':',')+comp_asin;}}open('https://'+document.domain+'/favicon.ico?mod=asin_keepa&asins='+comp_asin_code);void(0);"><input type="button" value="比对价格排名走势"></input></a> <a style="text-decoration:none;" href="javascript:comp_asin_code='';a=document.getElementsByTagName('input');for(i=0;i<a.length;i++){if(a[i].checked==true){comp_asin=a[i].outerHTML.split('id=%22')[1].split('%22')[0];comp_asin_code=comp_asin_code+(comp_asin_code==''?'':',')+comp_asin;}}open('https://www.sellersprite.com/favicon.ico?reverse-asin/` + document.domain.slice(-0x2).replace('om', 'US').toUpperCase() + `/'+comp_asin_code);void(0);"><input type="button" value="批量反查词"></input></a> <a style="text-decoration:none;" href="javascript:comp_asin_code='';a=document.getElementsByTagName('input');for(i=0;i<a.length;i++){if(a[i].checked==true){comp_asin=a[i].outerHTML.split('id=%22')[1].split('%22')[0];comp_asin_code=comp_asin_code+(comp_asin_code==''?'':',')+comp_asin;}}a=comp_asin_code.split(',');for(i=0;i<a.length;i++){open('https://'+document.domain+'/dp/'+a[i]);}void(0);"><input type="button" value="批量打开"></input></a> <span><input id="search_keyword" size="100" style="font-size:14px; width:200px; height:25px; border:1px solid #378888;"> <a style="text-decoration:none;" href="javascript:open('https://translate.google.cn/favicon.ico?mod=search&plat=am_us&q='+document.getElementById('search_keyword').value);void(0);"><input type="button" value="翻译搜索"></input></a></span></div><table><tr><td><table style="border:1px solid; font-size:12px;"><tbody>` + price_interval_code + `</tbody></table></td><td><table style="border:1px solid; font-size:12px;"><tbody>` + review_interval_code + `</tbody></table></td><td><table style="border:1px solid; font-size:12px;"><tbody>` + ave_price_interval_code + `</tbody></table></td><td><table style="border:1px solid; font-size:12px;"><tbody>` + ave_review_interval_code + `</tbody></table></td></tr></table><div style="font-size:14px;"><input id="check_all" type="button" value="全选" onclick="asin_a=document.getElementsByName('asin_list');for(i=0;i<asin_a.length;i++){asin_a[i].checked=true;}"> <input id="cancel_all" type="button" value="取消全选" onclick="asin_a=document.getElementsByName('asin_list');for(i=0;i<asin_a.length;i++){asin_a[i].checked=false;}"></div><div id="display_code">` + display_code + `</div></table>` + bottom_code);
    }
}