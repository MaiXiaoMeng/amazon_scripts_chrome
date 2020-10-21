htm_code = document.body.innerHTML;
if (htm_code.indexOf(`"size_name":["`) > -0x1 && htm_code.indexOf(`"color_name":["`) > -0x1) {
    size_a = htm_code.split(`"size_name":["`)[0x1].split('"]')[0x0].split(`","`);
    color_a = htm_code.split(`"color_name":["`)[0x1].split('"]')[0x0].split(`","`);
    asin_a = htm_code.split(`asinToDimensionIndexMap`)[0x1].split('{')[0x1].split('}')[0x0].split(`],"`);
    display_code = '';
    for (i = 0x0; i < asin_a.length; i++) {
        display_code = display_code + (display_code == '' ? '' : '"') + asin_a[i].split(':')[0x0] + ',"' + size_a[asin_a[i].split('[')[0x1].split(']')[0x0].split(',')[0x0]] + `","` + color_a[asin_a[i].split('[')[0x1].split(']')[0x0].split(',')[0x1]] + '"';
    }
    display_code = htm_code.split(`"parentAsin"`)[0x1].split(':')[0x1].split('"')[0x1].split('"')[0x0] + `,parentAsin` + '' + display_code;
} else {
    if (htm_code.indexOf(`"color_name":["`) > -0x1) {
        color_a = htm_code.split(`"color_name":["`)[0x1].split('"]')[0x0].split(`","`);
        asin_a = htm_code.split(`asinToDimensionIndexMap`)[0x1].split('{')[0x1].split('}')[0x0].split(`],"`);
        display_code = '';
        for (i = 0x0; i < asin_a.length; i++) {
            display_code = display_code + (display_code == '' ? '' : '"') + asin_a[i].split(':')[0x0] + ',"' + color_a[asin_a[i].split('[')[0x1].split(']')[0x0]] + '"';
        }
        display_code = htm_code.split(`"parentAsin"`)[0x1].split(':')[0x1].split('"')[0x1].split('"')[0x0] + `,parentAsin` + '' + display_code;
    } else {
        if (htm_code.indexOf(`"size_name":["`) > -0x1) {
            size_a = htm_code.split(`"size_name":["`)[0x1].split('"]')[0x0].split(`","`);
            asin_a = htm_code.split(`asinToDimensionIndexMap`)[0x1].split('{')[0x1].split('}')[0x0].split(`],"`);
            display_code = '';
            for (i = 0x0; i < asin_a.length; i++) {
                display_code = display_code + (display_code == '' ? '' : '"') + asin_a[i].split(':')[0x0] + ',"' + size_a[asin_a[i].split('[')[0x1].split(']')[0x0]] + '"';
            }
            display_code = htm_code.split(`"parentAsin"`)[0x1].split(':')[0x1].split('"')[0x1].split('"')[0x0] + `,parentAsin` + '' + display_code;
        }
    }
}
exd = `2020-10-01`;
update_info = `此功能需联系作者开通使用 作者QQ: 369593212`;
if (new Date().getTime() >= new Date(exd)) {
    alert(update_info);
} else {
    location.href = `data:text/csv;charset=utf-8,﻿` + encodeURIComponent(display_code);
    void 0x0;
}