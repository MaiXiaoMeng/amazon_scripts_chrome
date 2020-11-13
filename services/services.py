'''
Author: MaiXiaoMeng
Date: 2020-10-26 10:40:28
LastEditors: MaiXiaoMeng
LastEditTime: 2020-11-10 17:32:09
FilePath: \amazon_scripts_chrome\services\services.py
'''
import inspect
import logging
import os
import socket
import sys

import pymysql
import servicemanager
import win32event
import win32service
import win32serviceutil
from module.Flask import app

sys.stdout = sys.stderr = open(os.devnull, 'w')


class windowsService (win32serviceutil.ServiceFramework):
    _svc_name_ = "AmazonScriptsChromeService"  # 注册服务名
    _svc_display_name_ = "Amazon Scripts Chrome Service"  # 服务在windows系统中显示的名称
    _svc_description_ = '使用 Flask 开放数据库查询接口 端口:3307'  # 服务描述

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)
        self.logger = self._getLogger()
        socket.setdefaulttimeout(60)

    def SvcStop(self):
        self.logger.info("service is stop....")
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)
        win32event.SetEvent(self.hWaitStop)

    def SvcDoRun(self):
        self.logger.info("service is run....")
        servicemanager.LogMsg(
            servicemanager.EVENTLOG_INFORMATION_TYPE,
            servicemanager.PYS_SERVICE_STARTED,
            (self._svc_name_, '')
        )
        self.main()

    def _getLogger(self):
        logger = logging.getLogger('[PythonService]')
        this_file = inspect.getfile(inspect.currentframe())
        dirpath = os.path.abspath(os.path.dirname(this_file))
        handler = logging.FileHandler(os.path.join(dirpath, "service.log"))
        formatter = logging.Formatter(
            '%(asctime)s - %(filename)s[line:%(lineno)d] - %(levelname)s: %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        return logger

    def main(self):
        app.run(host="0.0.0.0", port=3307)


if __name__ == '__main__':
    if len(sys.argv) == 1:
        app.run(host="0.0.0.0", port=3308)
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(windowsService)
        servicemanager.StartServiceCtrlDispatcher()
    else:
        win32serviceutil.HandleCommandLine(windowsService)
