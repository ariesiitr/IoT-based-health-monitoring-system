#include<SoftwareSerial.h>
SoftwareSerial mySerial(9,10);      //GSM SIM800 Tx & Rx is connected to Arduino #9 & #10

void setup() {
  // put your setup code here, to run once:
  
  Serial.begin(9600);              //Begin serial communication with Arduino and Arduino IDE with baud rate of 9600 (Serial Monitor)
  
  mySerial.begin(9600);            //Begin serial communication with Arduino and GSM SIM800 with baud rate of 9600
  pinMode(8,INPUT);
  mySerial.println("AT");          //Handshaking with SIM900
 
  mySerial.println("AT+CMGF=1");    // Configuring TEXT mode
  
  mySerial.println("AT+CNMI=2,2,0,0");  // Decides how newly arrived SMS messages should be handled
 
  mySerial.println("AT+CMGD=1,4");      //Delete the messages in sim
}

void loop() {
  // put your main code here, to run repeatedly:
  long measurement=vibration();       
  int s1=map(measurement,0,5000,0,130);    //map function is intended to change one range of values into another range of values
  
  Serial.print(s1);
  
  Serial.print(",");
  
  Serial.println(s1/4);
  
  if(mySerial.available()>0)             
  {
  String input=mySerial.readString();        //mySerial.readString() reads characters from the gsm buffer into a String
  
  String mobileno=input.substring(12,22);   //using substring "mobileno" stores the contact number of sender in form of string 
  //substring function allows you to look for an instance of a particular substring within a given String
  
  String input1=input.substring(56,58);
 
 

    if(mobileno=="9648755222")           //gsm only read the command of user with mobile number="9648755222"
        {
          if(input1=="on")               //user will send "on" to receive the temperature and pulserate through sms
          { 
            
            delay(500);
            mySerial.println("AT+CMGS=\"+919648755222\"");   //gsm send the sms to the user
            
            //The SMS text you want to send
            mySerial.print("temperature:");
            mySerial.println(s1);
            mySerial.print("pulse:");
            mySerial.print(s1/4);
            updateSerial();

            //The text message entered followed by a ‘Ctrl+z’ character is treated as SMS
            mySerial.write(26);                      // ASCII code of CTRL+Z
            updateSerial();
            mySerial.println("AT+CMGD=1,4");        //Delete the messages in sim
            updateSerial();
            delay(1000);
          }

        }
  
  } 
}
void updateSerial()
{
  delay(500);
  while(Serial.available())
    {
      mySerial.write(Serial.read());
    }

}
long vibration(){
  long measurement=pulseIn(8,HIGH);             //Reads a pulse (either HIGH or LOW) on a pin and returns the length of the pulse in microseconds
  return measurement;
}
