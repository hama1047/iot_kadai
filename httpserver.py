 #/usr/bin/env python                                                          \
                                                                                
# coding:utf-8                                                                 \
                                                                                

import sys
import requests
import http.server
import urllib
import csv

# サーバの立ち上げ                                                             \
                                                                                
def run(port, handler):
    address = ("", int(port))
    server = http.server.HTTPServer(address, handler)
    server.serve_forever()

#コールバック関数の指定                                                        \
                                                                                
class CallbackServer(http.server.BaseHTTPRequestHandler):

    #GETに対する応答                                                           \
                                                                                
    def do_GET(self):
        # queryにGETのクエリ内容の文字列が入る（lux=100&temp=10）              \
                                                                                
        parsed_path = urllib.parse.urlparse(self.path)

        # 解析した結果は辞書型({'lux' : [100], 'temp' : [10]})                 \
                                                                                
        query = urllib.parse.parse_qs(parsed_path.query)

        with open ('data.csv','a',newline="")as f:
            for row in query['lux'][0]:
                f.write(str(row))
            f.write("\n")

        #print (query['lux'][0])                                                

        self.send_response(200)
        self.end_headers()
        self.wfile.write(parsed_path.query.encode())
                                                                               
        parsed_path = urllib.parse.urlparse(self.path)
        
        return

if __name__ == '__main__':
    run(sys.argv[1], CallbackServer)

