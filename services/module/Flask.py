'''
Author: MaiXiaoMeng
Date: 2020-10-26 11:32:22
LastEditors: MaiXiaoMeng
LastEditTime: 2020-11-10 17:53:29
FilePath: \amazon_scripts_chrome\services\module\Flask.py
'''
import os
import time
import urllib.request
from flask import Flask, jsonify, request
from .Tool import printer
from .top4cus_new import top4cus_new

app = Flask(__name__)
top4cus_new = top4cus_new()

UPLOAD_FOLDER = 'upload'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
basedir = os.path.abspath(os.path.dirname(__file__))
ALLOWED_EXTENSIONS = set(['pdf'])

# 判断文件是否合法


def allowed_file(filename):
    return '.' in filename and filename.split('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/printer', methods=['GET', 'POST'])
def printer_print():
    try:
        if request.method == 'GET':
            file_name = urllib.request.unquote(request.args.get("file_name"))
            printer_name = urllib.request.unquote(
                request.args.get("printer_name"))
            printer_ip = request.args.get("printer_ip")
            printer_name = f'\\\\{printer_ip}\{printer_name}'
            printer(file_name, printer_name).print_pdf()
            return {'code': 200, 'message': '调用打印机成功', 'file_name': urllib.request.unquote(file_name), 'printer_name': urllib.request.unquote(printer_name)}
        else:
            file_dir = os.path.join(
                basedir, app.config['UPLOAD_FOLDER']
            )
            if not os.path.exists(file_dir):
                os.makedirs(file_dir)
            file_name = request.files['file_name']
            printer_name = request.form.get("printer")
            if file_name and allowed_file(file_name.filename):
                ext = file_name.filename.split('.', 1)[1]
                new_file_name = f'{str(int(time.time()))}.{ext}'
                new_file_path = os.path.join(file_dir, new_file_name)
                file_name.save(new_file_path)
                printer(
                    urllib.request.unquote(new_file_path),
                    urllib.request.unquote(printer_name)
                ).print_pdf()
            else:
                return {'code': 302, 'message': '上传文件失败'}
    except Exception as error:
        return {'code': 404, 'message': str(error)}


@app.route('/test', methods=['GET', 'POST'])
def test():
    print(request.headers)
    return jsonify(request.referrer)
