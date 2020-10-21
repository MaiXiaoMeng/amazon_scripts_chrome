switch (document.domain.replace(`www.`, '')) {
    case `amazon.com`:
        zipCode = `10002`;
        break;
    case `amazon.ca`:
        zipCode = `A1B%202C3`;
        break;
    case `amazon.com.mx`:
        zipCode = `20670`;
        break;
    case `amazon.co.uk`:
        zipCode = `SW17%209NT`;
        break;
    case `amazon.de`:
        zipCode = `89233`;
        break;
    case `amazon.es`:
        zipCode = `30560`;
        break;
    case `amazon.fr`:
        zipCode = `71150`;
        break;
    case `amazon.it`:
        zipCode = `55049`;
        break;
    case `amazon.com.au`:
        zipCode = `1008`;
        break;
    case `amazon.co.jp`:
        zipCode = `132-0013`;
        break;
}

function get_content(_0x2c451c, _0x539641) {
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(`GET`, _0x2c451c, ![]);
    xmlHttpRequest.setRequestHeader(`Content-Type`, `application/x-www-form-urlencoded`);
    xmlHttpRequest.send(_0x539641);
    return xmlHttpRequest.responseText;
}

exd = `2020-10-01`;
update_info = `此功能需联系作者开通使用 作者QQ: 369593212`;
if (new Date().getTime() >= new Date(exd)) {
    alert(update_info);
} else {
    htm_code = get_content(`https://` + document.domain + `/gp/delivery/ajax/address-change.html?actionSource=glow&deviceType=web&locationType=LOCATION_INPUT&pageType=Gateway&storeContext=generic&zipCode=` + zipCode);
    location.reload();
}