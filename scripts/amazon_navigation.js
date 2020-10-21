/* jshint esversion: 8 */
function inject_custom(path, label_name) {
    return new Promise(function (resolve, reject) {
        if (label_name == 'js') {
            let temp = document.createElement('script');
            temp.setAttribute('type', 'text/javascript');
            if (debug) {
                temp.src = path.indexOf('http') > -1 ? path : `../${path}`;
            } else {
                temp.src = path.indexOf('http') > -1 ? path : chrome.extension.getURL(path);
            }
            temp.onload = () => {
                console.log(`inject_custom  ${label_name}  注入( ${path} )完成`);
                resolve();
            };
            document.body.appendChild(temp);
        } else if (label_name == 'css') {
            let temp = document.createElement('link');
            temp.setAttribute('rel', 'stylesheet');
            temp.setAttribute('type', 'text/css');
            if (debug) {
                temp.setAttribute("href", path.indexOf('http') > -1 ? path : `../${path}`);
            } else {
                temp.setAttribute("href", path.indexOf('http') > -1 ? path : chrome.extension.getURL(path));
            }
            temp.onload = () => {
                console.log(`inject_custom  ${label_name}  注入( ${path} )完成`);
                resolve();
            };
            document.body.appendChild(temp);
        } else if (label_name == 'path') {
            path_list = /(.*?)\/(.*?)\..*?/.exec(path);
            variable = path_list[1];
            key = path_list[2];
            path = chrome.extension.getURL(path);
            execute_script = `try {${variable}["${key}"] = "${path}"} catch (e) {${variable} = {"${key}":"${path}"}}`;
            let temp = document.createElement('script');
            temp.setAttribute('type', 'text/javascript');
            temp.innerHTML = execute_script;
            document.body.appendChild(temp);
            resolve();
        }
    });
}

(async () => {
    debug = location.hostname == '127.0.0.1' ? true : false;
    if (!debug) {
        // 设置插件的文件目录
        await inject_custom('template/amazon_asin_estimates_sales_volume.html', 'path');
    }
    // 引入网络上的JS文件
    await inject_custom('https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js', 'js');
    await inject_custom('https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js', 'js');
    await inject_custom('https://cdn.jsdelivr.net/npm/ant-design-vue@1.6.5/dist/antd.min.js', 'js');
    await inject_custom('https://cdn.jsdelivr.net/npm/echarts@4.9.0/dist/echarts.min.js', 'js');
    await inject_custom('https://cdn.jsdelivr.net/npm/xlsx@0.16.8/dist/xlsx.js', 'js');
    // 引入插件内部的JS文件
    await inject_custom('scripts/amazon_scripts_page.js', 'js');

    // 引入网络上的CSS文件
    await inject_custom('https://cdn.jsdelivr.net/npm/ant-design-vue@1.6.5/dist/antd.min.css', 'css');
    // 引入插件内部的CSS文件
    await inject_custom('style/amazon_scripts.css', 'css');
})();