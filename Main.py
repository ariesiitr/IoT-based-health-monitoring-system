import serial
from firebase import firebase
import time
from selenium import webdriver 
from selenium.webdriver.chrome.options import Options 
from selenium.webdriver.support.ui import WebDriverWait
import datetime 
from matplotlib import pyplot as plt
import numpy
from drawnow import *

arduinoData = serial.Serial('COM3', 9600) #Creating our serial object named arduinoData
firebase = firebase.FirebaseApplication("https://sg-project-trial-default-rtdb.firebaseio.com/",None)#Linking to our database
plt.ion() #Tell matplotlib you want interactive mode to plot live data


def getCoord():
    options = Options()
    options.add_argument("--use--fake-ui-for-media-stream")#giving permissions to the bot
    driver = webdriver.Chrome(executable_path = r'C:\Users\Shikhar Gupta\Desktop\aries\chromedriver.exe',options=options) #specifying the path of chromedriver (Should be in the directory of code)
    timeout =20
    driver.get("https://mycurrentlocation.net/") #specifying the website which we want to scrap
    wait = WebDriverWait(driver, timeout)
    time.sleep(3)
    longitude = driver.find_elements_by_xpath('//*[@id="longitude"]') #specifying the Xpath of longitude
    longitude = [x.text for x in longitude]    # converting data from Xpath into a readable format
    longitude = str(longitude[0])    
    latitude = driver.find_elements_by_xpath('//*[@id="latitude"]')  #specifying the Xpath of latitude  
    latitude = [x.text for x in latitude]   # converting data from Xpath into a readable format
    latitude = str(latitude[0])    
    driver.quit()    
    return (latitude,longitude)

lat = getCoord()[0] #getting the latitude
lng = getCoord()[1] #getting the longitude


firebase.put('/object/','latitude',float(lat)) #pushing the latitude values to database
firebase.put('/object/','longitude',float(lng))#pushing the longitude values to database

print("The latitude of the place is ",lat)
print("The longitude of the place is ",lng)

def makeFig(): #Create a function that makes our desired plot 
    plt.ylim(0,200)                             #Set y min and max values
    plt.title('My Live Streaming Sensor Data')      #Plot the title
    plt.grid(True)                                  #Turn the grid on
    plt.ylabel('Temp F')                            #Set ylabels
    plt.plot(tempF, 'ro-', label='Degrees F')       #plot the temperature
    plt.legend(loc='upper left')                    #plot the legend
    plt2=plt.twinx()                                #Create a second y axis
    plt.ylim(0,200)                           #Set limits of second y axis- adjust to readings you are getting
    plt2.plot(pulseF, 'b^-', label='Pulse (BPM)') #plot pressure data
    plt2.set_ylabel('Pulse (BPM)')                    #label second y axis
    plt2.ticklabel_format(useOffset=False)           #Force matplotlib to NOT autoscale y axis
    plt2.legend(loc='upper right')                  #plot the legend
    
while(True):
    firebase.get('/object/','switch')
    tempF= [] #creating empty lists to store plot data
    pulseF=[] #creating empty lists to store plot data
    cnt=0 #variable to keep the count of plot datas

    while(firebase.get('/object/','switch') == "on"): #fetching command from database to start running the code....
        
        data = arduinoData.readline() #reading the data from arduino
        raw = str(data[0:(len(data))].decode("utf-8")) #decoding the data 
        senVal = raw.split(',') #separating the sensor values from the string
        print(senVal)
        if(senVal[0]=='\n'):
            continue
        elif(senVal[0]=='\r\n'): #writing conditionals to avoid reading space and new line commands, and accounting for the inefficiency of serial communication.......
            continue
        else:
            temp=senVal[0]
            pulse=senVal[1][:-2] #slicing the string to avoid characters like \r\n

        #converting the string data into a number
        final_temp=0
        for i in temp:
            x=int(i)
            final_temp=x+final_temp*10
        print(senVal[1])    
        final_pls=0
        for i in pulse:
            x=int(i)
            final_pls=x+final_pls*10

        #making the list to plot the data
        tempF.append(final_temp)
        pulseF.append(final_pls)

        print(final_temp)
        print(final_pls)

        #sending the data to firebase
        firebase.put('/object/','temperature',final_temp)
        firebase.put('/object/','pulserate',final_pls)

        #plotting the data
        drawnow(makeFig)
        plt.pause(.000001) #a small delay to avoid the crashing of the plot function....
        cnt += 1

        #removing the data if the count becomes more than 30, to avoid shrinking of graph
        if(cnt>30):
            tempF.pop(0)
            pulseF.pop(0)
            
        
