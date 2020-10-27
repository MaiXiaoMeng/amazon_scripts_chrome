# Windows Services

## DEBUG

`python services.py stop && python services.py --startup auto install && python services.py start`

## 其他命令

* 注册服务 `python services.py install`
* 开机启动 `python services.py --startup auto install`
* 更新服务 `python services.py update`
* 卸载服务 `python services.py remove`
* 查看服务 `mmc Services.msc`
* 启动服务 `python services.py start` 或者 `net start < service name >`
* 停止服务 `python services.py stop` 或者 `net stop < service name >`
* 重启服务 `python services.py restart` 或者 `net restart < service name >`
