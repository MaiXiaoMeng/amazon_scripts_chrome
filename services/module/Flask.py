from flask import Flask, jsonify, request
from .top4cus_new import top4cus_new
app = Flask(__name__)
top4cus_new = top4cus_new()


@app.route('/query_sql_sentence', methods=['GET', 'POST'])
def query_sql_sentence():
    try:
        print(F'------->query_sql_sentence({request.method})')
        if request.method == 'GET':
            SQL = request.args.get("SQL")
        else:
            SQL = request.form.get('SQL')
        return jsonify(top4cus_new.query_sql_sentence(SQL))
    except Exception as error:
        return error
