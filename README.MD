<!--
 * @Author: MaiXiaoMeng
 * @Date: 2020-10-21 10:58:40
 * @LastEditors: MaiXiaoMeng
 * @LastEditTime: 2020-11-20 14:32:46
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

### 访问亚马逊显示 “您的连接不是私密连接”

1. 这个的原因是因为没有加载到证书的原因，当然也可以跳过，点击页面的高级，可以跳过验证直接进入

### 访问亚马逊的时候地址栏显示 “您与此网站之间建立的连接不安全”

1. 因为谷歌在 2020-07-02 发布了新的政策 [Deprecating Powerful Features on Insecure Origins](https://www.chromium.org/Home/chromium-security/deprecating-powerful-features-on-insecure-origins) 不允许 [HTTPS 协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8%E5%8D%8F%E8%AE%AE) 访问 [HTTP 协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE) 的资源，并且会强制对访问的资源启用 [HTTPS 协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8%E5%8D%8F%E8%AE%AE)

2. 我们 Windows Service API 是使用 [HTTP 协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE) 而并非使用 [HTTPS 协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8%E5%8D%8F%E8%AE%AE) ，需要安装自己签名的 CA 证书

   解决方法一 : 下载安装 80 版本以前的谷歌浏览器，当然这样谷歌浏览器是不能更新的。

   解决方法二 : 下载使用公司信息签名的 [ca.p12](https://github.com/MaiXiaoMeng/amazon_scripts_chrome/raw/dev/services/keys/ca.p12) 证书，导入到自己电脑上的电脑上

   1. 双击下载好的 [ca.p12](https://github.com/MaiXiaoMeng/amazon_scripts_chrome/raw/dev/services/keys/ca.p12) 证书打开证书导入窗口，一直点下一步到达 `为私钥键入密码` 窗口
   2. 输入密码 `top4cus` 点下一步到达 `证书存储是保存证书的系统区域` 窗口
   3. 选择 `将所有的证书放入下列存储` 点击右边的 `浏览` 按钮
   4. 然后选择 `受信任的根证书颁发机构` 然后一直点下一步到完成

   - 如果显示报错 [`由于存储区是只读的，存储区已满，或者存储区没有正确打开，所以导致失败`](https://blog.csdn.net/lovedingd/article/details/97615215) 这参考此导入教程
