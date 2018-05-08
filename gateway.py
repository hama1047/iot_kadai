import serial
import requests

ser = serial.Serial('/dev/ttyUSB0',9600,timeout=None)
url = "http://localhost:3000"

while True:
    line = ser.readline()
    lux = line.strip().decode('utf-8')
    requests.get(url + "?lux=" + lux)
    print(lux)

ser.close()
