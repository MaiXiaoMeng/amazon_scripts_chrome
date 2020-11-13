<!--
 * @Author: MaiXiaoMeng
 * @Date: 2020-10-21 10:58:40
 * @LastEditors: MaiXiaoMeng
 * @LastEditTime: 2020-11-13 16:27:31
 * @FilePath: \amazon_scripts_chrome\README.MD
-->

# 亚马逊调研用的谷歌浏览器扩展

## 简介

这是一个 Chrome 浏览器扩展程序，用于亚马逊市场调研的

## 运行环境

本程序运行在 PC 端的浏览器上，支持 Chrome、Firefox、Edge 浏览器推荐用户使用 Chrome 浏览器安装本程序

有些国产套壳浏览器可能会出现问题，如 QQ 浏览器、360 安全浏览器、搜狗浏览器等

手机上的 Yandex 浏览器、Yandex 浏览器可以安装 Chrome 扩展程序，如果你有需要也可以进行尝试

如果你还没有安装相对应的浏览器的话，这里可以下载安装

- `Chromium 内核浏览器` > [Google](https://www.google.cn/chrome/) | [Edge](https://www.microsoft.com/zh-cn/edge)
- ~~`Mozilla Firefox` > [Mozilla Firefox](http://firefox.com/)~~
- `Firefox Browser Developer Edition` > [Firefox Browser Developer Edition](https://www.mozilla.org/zh-CN/firefox/developer/)

## 安装|更新

在隐身模式中使用本程序时，可能会出现无法预知的错误。所以请不要在隐身模式中使用本程序

安装请点这里 > [安装说明](https://github.com/MaiXiaoMeng/amazon_scripts_chrome/blob/dev/tutorials/安装说明.MD) | 更新请点这里 > [更新说明](https://github.com/MaiXiaoMeng/amazon_scripts_chrome/blob/dev/tutorials/更新说明.MD)

## 常见问题解答

### 无法打开正常预估销量页面

1. 检查是否已经登录了 [Helium10](www.helium10.com) 网站，需要自己注册账号和登录

2. 检查是否使用 火狐浏览器 由于火狐浏览器跨域访问的时候不会带 Referer 信息导致的，暂时没有很好的解决方案

3. 检查是否使用了谷歌浏览器的版本在 83 以上，由于谷歌浏览器在 2020-09-17 发布了新的政策 [Changes to Cross-Origin Requests in Chrome Extension Content Scripts](https://www.chromium.org/Home/chromium-security/extension-content-script-fetches) 取消从插件内容脚本绕过 CORB 的功能。

   解决方法一 : 下载安装 83 版本以前的谷歌浏览器，当然这样谷歌浏览器是不能更新的。

   解决方法二 : 关闭谷歌浏览器的 CORB 的功能

   - 在地址栏输入 [chrome://flags/#cors-for-content-scripts](chrome://flags/#cors-for-content-scripts) 打开谷歌浏览器的配置页面，找到 "cors for content scripts" 选项并且把右边的 Enabled 设置为 Disable。

   - 在地址栏输入 [chrome://flags/#force-empty-CORB-and-CORS-allowlist](chrome://flags/#force-empty-CORB-and-CORS-allowlist) 打开谷歌浏览器的配置页面，找到 "force empty CORB and CORS allowlist" 选项并且把右边的 Enabled 设置为 Disable。

   - 关闭页面并且重启谷歌浏览器即可
