import serial
import requests

ser = serial.Serial('/dev/ttyUSB0',9600,timeout=None)
url = "http://160.16.210.86:15071/putdata"

while True:
    line = ser.readline()
    data = line.strip().decode('utf-8')
    data = data.strip().split(',');
    requests.get(url + "?lux=" + data[0] +  "&tmp=" + data[1] +  "&hum=" +data[2] )
    print(data[0])

ser.close()
