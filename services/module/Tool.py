'''
Author: MaiXiaoMeng
Date: 2020-11-10 14:34:51
LastEditors: MaiXiaoMeng
LastEditTime: 2020-11-10 17:57:07
FilePath: \amazon_scripts_chrome\services\module\Tool.py
'''
import tempfile
import os
import traceback
from optparse import OptionParser
import sys
import importlib
import win32ui
import win32print
from PIL import Image, ImageWin
from pdf2image import convert_from_path

importlib.reload(sys)

# print(f'默认的打印机名称: {win32print.GetDefaultPrinter()}')

if 'module' in os.getcwd():
    os.environ["PATH"] += f'{os.pathsep + os.getcwd()}/poppler-0.68.0/bin/'
else:
    os.environ["PATH"] += f'{os.pathsep + os.getcwd()}/module/poppler-0.68.0/bin/'


class printer:
    def __init__(self, filenames, printer):
        # self.filenames = filenames
        self.filenames = r"C:\Users\Administrator\Desktop\2012.pdf"
        # self.printer = printer
        self.printer = "\\192.168.101.11\Canon MF3010"

    def print_img(self, doc_name, file_names, printer_name):
        # GetDeviceCaps 的常量
        HORZRES = 8  # HORZRES / VERTRES = 可打印区域
        VERTRES = 10  # HORZRES / VERTRES = 可打印区域
        LOGPIXELSX = 88  # X 轴 每英寸点数
        LOGPIXELSY = 90  # Y 轴 每英寸点数
        PHYSICALWIDTH = 110  # 宽度
        PHYSICALHEIGHT = 111  # 高度
        PHYSICALOFFSETX = 112  # X 轴 左边距
        PHYSICALOFFSETY = 113  # Y 轴 上边距
        try:
            # 初始化打印机参数
            hDC = win32ui.CreateDC()  # 创建图形设备接口
            hDC.CreatePrinterDC(printer_name)  # 连接到指定的打印机
            printable_area = hDC.GetDeviceCaps(
                HORZRES), hDC.GetDeviceCaps(VERTRES)  # 获取可打印区域数值
            printer_size = hDC.GetDeviceCaps(
                PHYSICALWIDTH), hDC.GetDeviceCaps(PHYSICALHEIGHT)  # 获取可打印机尺寸
            printer_margins = hDC.GetDeviceCaps(
                PHYSICALOFFSETX), hDC.GetDeviceCaps(PHYSICALOFFSETY)  # 获取可打印机边距

            # 开始打印作业，并以缩放后的尺寸将位图绘制到打印机设备上
            hDC.StartDoc(doc_name)  # 选择指定文件
            hDC.StartPage()
            for _file_name in file_names:
                bmp = Image.open(_file_name)
                ratios = [1.0 * printable_area[0] / bmp.size[0],
                          1.0 * printable_area[1] / bmp.size[1]]
                scale = min(ratios)
                dib = ImageWin.Dib(bmp)
                scaled_width, scaled_height = [
                    int(scale * i) for i in bmp.size]
                x1 = int((printer_size[0] - scaled_width) / 2)
                y1 = int((printer_size[1] - scaled_height) / 2)
                x2 = x1 + scaled_width
                y2 = y1 + scaled_height
                dib.draw(hDC.GetHandleOutput(), (x1, y1, x2, y2))
                hDC.EndPage()
            hDC.EndDoc()
            hDC.DeleteDC()
        except Exception as error:
            print(f'打印文件失败，错误信息：{error}')

    def print_pdf(self):
        file_name_list = self.filenames.split(',')
        for _file_name in file_name_list:
            images = convert_from_path(_file_name)
            img_paths = []
            tmp_dir = tempfile.mkdtemp()
            for index, img in enumerate(images):
                img_path = f'{tmp_dir}\{index}.png'
                img_paths.append(img_path)
                img.save(img_path)
            self.print_img(
                os.path.basename(_file_name), img_paths, self.printer
            )


if __name__ == '__main__':
    try:
        parser = OptionParser()
        parser.add_option(
            "-f", "--file", action="store",
            dest="file", default=None, help="需要PDF文件的路径"
        )
        parser.add_option(
            "-p", "--printer", action="store",
            dest="printer", default=None, help="打印机的名称"
        )
        (options, args) = parser.parse_args()
        file_name = options.file
        printer_name = options.printer
        # file_name = r"C:\Users\Administrator\Desktop\2012.pdf"
        # printer_name = "\\\\192.168.101.11\Canon MF3010"
        if file_name is None:
            parser.print_help()
            sys.exit(0)
        printer(file_name, printer_name).print_pdf()
    except Exception as error:
        print(traceback.format_exc())
        print(error)
