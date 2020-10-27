# 亚马逊调研用的谷歌浏览器扩展

## 简介

这是一个 Chrome 浏览器扩展程序，用于亚马逊市场调研的

## 运行环境

本程序运行在 PC 端的浏览器上，推荐用户使用 Chrome 浏览器安装本程序。新版 Edge 浏览器也可以良好的运行

不支持 Firefox 浏览器。有些国产套壳浏览器可能会出现问题，如 QQ 浏览器、360 安全浏览器、搜狗浏览器等

手机上的 Yandex 浏览器、Yandex 浏览器可以安装 Chrome 扩展程序，如果你有需要也可以进行尝试

如果你还没有安装`Chromium 内核浏览器` 这里可以下载安装 > [Google](https://www.google.cn/chrome/) | [Edge](https://www.microsoft.com/zh-cn/edge)

## 不要在隐身模式中使用

在隐身模式中使用本程序时，可能会出现无法预知的错误。所以请不要在隐身模式中使用本程序

### 安装说明

#### ~~在线安装~~

1. ~~**Chromium 内核** 的浏览器可以从 **[Chrome Web Store](https://chrome.google.com/webstore)** 安装本扩展~~
2. ~~**Microsoft Edge** 浏览器也可以从 **[Microsoft Edge 外接程序](https://microsoftedge.microsoft.com/addons/)** 安装本扩展~~

#### 离线安装

如果您不能在线安装，您可以从 [Releases](https://github.com/MaiXiaoMeng/amazon_scripts_chrome/releases) 页面进行离线安装

但是离线安装的话，之后的版本更新需要下载新版本来手动更新

##### 下载ZIP包安装（需要打开 Chromium 内核浏览器的开发者模式）

1. 点击本项目中的 [Releases](https://github.com/MaiXiaoMeng/amazon_scripts_chrome) 下载
2. 选择最新的 `Releases` 版本（如：`Releases v0.0.1`），下载本程序的 zip 压缩包
3. 排在第一位的就是最新版本，点击红框处下载最新的版本（如：`amazon_scripts_chrome.zip`）
4. 把下载好的 `amazon_scripts_chrome.zip` 解压缩到电脑的`任意目录`
5. 打开 Chromium 内核浏览器，Chrome 浏览器 或者 Edge 浏览器等等
6. 点击设置 > 更多工具 > 扩展程序 打开 `扩展程序管理页面` 或者 输入网址进入（[chrome://extensions/](chrome://extensions/)）
7. 首先我们需要启用右上角的 `开发者模式`，默认情况下它没有启用，需要点击开关来启用它。
8. 点击“`加载已解压的扩展程序`”找到刚刚解压的目录
9. 安装成功后就看到了插件了。虽然上边有个"错误"的红色标记，但是 `不影响使用` 哦
10. 它的图标旁有一个橘红色的硬盘图标，表示这是本地扩展。它在使用体验上与在线安装版本没有区别，但不能自动更新。

##### 下载CRX包安装（需要配置Chromium 内核浏览器策略管理模板）

1. 点击本项目中的 [Releases](https://github.com/MaiXiaoMeng/amazon_scripts_chrome) 下载
2. 选择最新的`Releases`版本（如：`Releases v0.0.1`）
3. 下载最新的版本（如：`amazon_scripts_chrome.crx`）
4. 下载 Chrome 组策略管理模板 [policy_templates](https://down.cheshirex.com/%E6%9D%82%E9%A1%B9/policy_templates.zip) 保存到任意位置，并解压到任意目录
5. 中文的策略管理模板在刚刚解压的相对路径这里：policy_templates\windows\adm\zh-CN\chrome.adm
6. Win+R 打开运行，输入`gpedit.msc`然后按下回车
7. 依次展开 本地计算机策略 > 计算机配置 > 管理模板，在“`管理模板`”上右击，选择“`添加/删除模板`”
8. 点击添加，找到第 5 步解压的“`chrome.adm`”，打开，关闭“`添加/删除模板`”窗口（如果卡住的话则重复 6、7步即可）
9. 依次展开 本地计算机策略 > 计算机配置 > 管理模板 > 经典管理模板(ADM)
10. 然后展开 Google > Google Chrome > 扩展程序，双击右侧的“配置扩展程序安装白名单”和 “配置强制安装的应用和扩展程序的列表”
11. 点选左边第二项“`已启用`”，点击下面的“`显示`”
12. 复制扩展的 ID: `gfniiocodmhbedokkibndajkonldikph` 粘贴到第10步弹出的窗口中，点确定
13. 打开 Chromium 内核浏览器，Chrome 浏览器 或者 Edge 浏览器等等
14. 点击设置 > 更多工具 > 扩展程序 打开`扩展程序管理页面` 或者 输入网址进入（[chrome://extensions/](chrome://extensions/)）
15. 将下载的`amazon_scripts_chrome.crx` 文件拖放至 Chrome 扩展程序页面安装
16. 它的图标旁有一个橘红色的硬盘图标，表示这是本地扩展。它在使用体验上与在线安装版本没有区别，但不能自动更新
17. 如果安装之后浏览器显示 "`您的浏览器受管理`" 或者 "`由贵单位管理`" 标识属于正常现象

#### ~~在手机上安装~~

~~这需要手机上具有可以安装 Chrome 扩展程序的浏览器。以 **Yandex 浏览器** 为例：~~

1. ~~安装 Yandex 浏览器~~
2. ~~用 Yandex 浏览器打开本扩展的 Chrome Web Store 安装页面，安装本扩展~~
3. ~~当你要进行下载时，先打开 Yandex 浏览器的菜单，选择“桌面版本”。否则，下载可能会遇到问题~~
4. ~~如果 Yandex 浏览器在下载时请求存储权限，允许它~~

### 更新说明

#### ~~在线更新~~

~~当本程序检查到新版本时，设置面板的右上角会出现更新按钮：~~

~~注意：~~

~~由于 Chrome Webstore 需要审核，所以当提示有新版本时，打开 Chrome Webstore 可能看到的还是当前版本，这是因为 Google 在对新版本进行审核。需要等待审核通过才能更新到新版本~~

~~当新版本发布时，我会首先在 Github 上发布，而 Chrome Webstore 则需要几天时间来过审，甚至可能审核失败。所以追求最新版本的话，请使用离线安装~~

#### 离线更新

更新离线安装的本扩展，需要重新下载安装包，手动更新

简单来说就是删除旧版本的文件，然后重复离线安装的步骤即可

##### 下载ZIP包更新（需要打开 Chromium 内核浏览器的开发者模式）

1. 进入旧版本的 `amazon_scripts_chrome` 文件夹的位置，删除 `amazon_scripts_chrome` 文件夹
2. 打开本项目的 [Releases](https://github.com/MaiXiaoMeng/amazon_scripts_chrome/releases/latest) 页面查看新的版本并且下载最新的版本
3. 下载最新的 amazon_scripts_chrome.zip 文件，解压得到 amazon_scripts_chrome 文件夹
4. 把 amazon_scripts_chrome 文件夹放到和旧版本相同的位置
5. 重启浏览器

##### 下载CRX包更新（需要配置 Chromium 内核浏览器策略管理模板）

1. 打开 Chromium 内核浏览器，Chrome 浏览器 或者 Edge 浏览器等等
2. 点击设置 > 更多工具 > 扩展程序 打开`扩展程序管理页面` 或者 输入网址进入（[chrome://extensions/](chrome://extensions/)）
3. 找到 名字为: `Amazon Scripts` ID: `gfniiocodmhbedokkibndajkonldikph` 的旧版扩展程序，点击删除
4. 打开本项目的 [Releases](https://github.com/MaiXiaoMeng/amazon_scripts_chrome/releases/latest) 页面查看新的版本并且下载最新的版本
5. 将下载的最新版本的 `amazon_scripts_chrome.crx` 文件，拖放至 Chrome 扩展程序页面安装
6. 重启浏览器

当你重新打开浏览器时，就可以使用新版本了。
