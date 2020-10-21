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

function get_content(_0x182175, _0x2d705c) {
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(`GET`, _0x182175, ![]);
    xmlHttpRequest.setRequestHeader(`Content-Type`, `application/json; charset=UTF-8`);
    xmlHttpRequest.send(_0x2d705c);
    return xmlHttpRequest.responseText;
}

exd = `2020-10-01`;
update_info = `此功能需联系作者开通使用 作者QQ: 369593212`;
if (new Date().getTime() >= new Date(exd)) {
    alert(update_info);
} else {
    title = document.getElementById(`productTitle`).innerText;
    bullet = document.getElementById(`feature-bullets`).innerText;
    if (document.body.innerHTML.indexOf(`id="aplus"`) > -0x1) {
        aplus = document.getElementById(`aplus`).innerText;
    } else {
        aplus = '';
    }
    if (document.body.innerHTML.indexOf(`id="productDescription"`) > -0x1) {
        productDescription = document.getElementById(`productDescription`).innerText;
    } else {
        productDescription = '';
    }
    open(`https://translate.google.cn/favicon.ico?mod=product_trans&title=` + encodeURIComponent(title) + `&bullet=` + encodeURIComponent(bullet) + `&aplus=` + encodeURIComponent(aplus) + `&productDescription=` + encodeURIComponent(productDescription));
    void 0x0;
}