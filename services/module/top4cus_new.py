import pymysql


class top4cus_new:
    def __init__(self, host='192.168.101.14', port=3306, user='myuser', passwd='123456', db='top4cus_new', debug=False):
        self.host = host
        self.port = port
        self.user = user
        self.passwd = passwd
        self.db = db
        self.conn = pymysql.connect(
            host=self.host, port=self.port, user=self.user, passwd=self.passwd, db=self.db
        )
        self.curson = self.conn.cursor()
        self.debug = debug

    def execute_sql_sentence(self, sql_sentence):
        try:
            self.curson.execute(sql_sentence)
            self.conn.commit()
            return True
        except Exception as Error:
            self.print_log(Error)
            return False

    def query_sql_sentence(self, sql_sentence):
        try:
            self.curson.execute(sql_sentence)
            return self.curson.fetchall()
        except Exception as Error:
            self.print_log(Error)
            return []

    def print_log(self, values):
        if self.debug:
            print(values)

    def exit(self):
        self.curson.close()
        self.conn.close()
