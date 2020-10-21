// var url = 'http://www.geekpark.net/ajax/load_seeds/?order=undefined&type=img&tag_id=160388&start=36&num=12&tt=1366382330986&t=';

// function test() {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.onreadystatechange = function() {
//       if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//             var seeds = JSON.parse(xhr.responseText).data.seeds;
//             for (var i in seeds) {
//                 console.log(' - ' + seeds[i].title)
//             }
//         }
//       }
//     }
//     xhr.send();
// }

// setInterval(test, 3000);



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.tabs.sendMessage(sender.tab['id'], {
        'ecomtool_response': !![],
        'ust': 2
    });
    // if (request.hasOwnProperty(`ecomtool`)) {
    //     function _0xf82613(_0x5e91f8, _0x19f0b9) {
    //         xmlHttpRequest = new XMLHttpRequest();
    //         xmlHttpRequest.open(`POST`, _0x5e91f8, ![]);
    //         xmlHttpRequest.setRequestHeader(`Content-Type`, `application/json; charset=UTF-8`);
    //         xmlHttpRequest.send(_0x19f0b9);
    //         return xmlHttpRequest.responseText;
    //     }

    //     function _0x29146d(_0x50c666, _0x3fb81f) {
    //         xmlHttpRequest = new XMLHttpRequest();
    //         xmlHttpRequest.open(`GET`, _0x50c666, ![]);
    //         xmlHttpRequest.setRequestHeader(`Content-Type`, `application/json; charset=UTF-8`);
    //         xmlHttpRequest.send(_0x3fb81f);
    //         return xmlHttpRequest.responseText;
    //     }

    //     function _0x4e27e5(_0x5ef8ec, _0x25c297) {
    //         xmlHttpRequest = new XMLHttpRequest();
    //         xmlHttpRequest.open(`GET`, _0x5ef8ec, ![]);
    //         xmlHttpRequest.setRequestHeader(`Content-Type`, `application/x-www-form-urlencoded`);
    //         xmlHttpRequest.send(_0x25c297);
    //         return xmlHttpRequest.responseText;
    //     }

    //     account_a = ['457163482@qq.com982321226@qq.com185451964@qq.com2671988725@qq.com1508225152@qq.com326256941@qq.com841417129@qq.com2260314136@qq.comsakimura@163.com2048768550@qq.comeric@mirthtek.com545749898@qq.com1061235239@qq.com1148391306@qq.com646049848@qq.com1042724835@qq.comwendell@opolar.com2779724346@qq.com310884715@qq.com11909468@qq.com294209441@qq.com378090054@qq.comkdl_service01@outlook.com765367215@qq.comfallli9490@gmail.com1073445669@qq.com454221400@qq.com2551852199@qq.com479834158@qq.comqiankun5253@163.com840755101@qq.comdamai345@163.com1334754390@qq.comstseventeen@gmail.combelboom6@gmail.com1334754390@qq.com84930161helen@gmail.com84930161@qq.com584171768@qq.comcrazycong2016@sina.comkbp302@qq.com904619899@qq.comwanzhouhzb@outlook.com362336421@qq.comzhouyoulong22@gmail.com862823370@qq.comjianshenzhou@126.com627149226@qq.comdick.yu@wehaves.comsamuel@newyes.com11936189@qq.com18605946114@163.com522845932@qq.com2294914473@qq.com18613187@qq.comhuangjf_9@126.com504751701@qq.com553266479@qq.comzygabright@outlook.com13418499152@163.comsankola@163.com38610842@qq.com150701452@qq.com2153377399@qq.com3001027483@qq.com1325406659@qq.com2240923648@qq.com420671260@qq.com369593212@qq.com'];
    //     account_str = account_a.join(',');
    //     power_by = `powered by ecomtool&nbsp;&nbsp;`;
    //     htm_code = _0x4e27e5(`https://accounts.aliexpress.com/user/organization/manage_person_profile.htm`);
    //     if (htm_code.indexOf(`robots`) < 0x0) {
    //         email_before_a = htm_code.split('@')[0x0].split('>');
    //         email_before_code = email_before_a[email_before_a.length - 0x1];
    //         email_after_code = htm_code.split('@')[0x1].split('<')[0x0].replace(`%0A`, '');
    //         user_id = email_before_code + '@' + encodeURI(email_after_code).split(`%0A`)[0x0];
    //         uic = user_id + `&nbsp;<a href="https://login.aliexpress.com/xman/xlogout.htm?return_url=https%3A%2F%2Fwww.aliexpress.com%2F" target="_blank" style="color:red;">退出</a>&nbsp;&nbsp;`;
    //     } else {
    //         user_id = '登录';
    //         uic = `<a href="https://login.aliexpress.com/" target="_blank" style="color:red;">登录</a>&nbsp;&nbsp;`;
    //     }
    //     uic = uic + power_by;
    //     if (user_id != '登录') {
    //         if (account_str.indexOf(user_id) > -0x1) {
    //             ust = 0x2;
    //         } else {
    //             ust = 0x0;
    //         }
    //     } else {
    //         ust = 0x0;
    //     }
    //     chrome.tabs.sendMessage(sender.tab['id'], {
    //         'ecomtool_response': !![],
    //         'ust': ust
    //     });
    // }
});