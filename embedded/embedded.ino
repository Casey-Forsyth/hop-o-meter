
// Include the ESP8266 WiFi library. (Works a lot like the
// Arduino WiFi library.)
#include <ESP8266WiFi.h>
#include <SparkFunMAX31855k.h> // Using the max31855k driver
#include <SPI.h>  // Included here too due Arduino IDE; Used in above header

// Wifi Manager for webserver to configure wifi http://tzapu.com/esp8266-wifi-connection-manager-library-arduino-ide/
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h> //https://github.com/tzapu/WiFiManager

#include "HX711.h"
#include <MovingAverage.h> 
#include <ESP8266HTTPClient.h>


/////////////////////
// Pin Definitions //
/////////////////////
const int CHIP_SELECT_PIN = 4; // Using standard CS line (SS)
const int LED_PIN = 5; // Thing's onboard, blue LED
const int ANALOG_PIN = A0; // The only analog pin on the Thing
const int GND = 1; // Needed for SparkFunMAX31855k probe() function?
const int VCC = 3; // Needed for SparkFunMAX31855k probe() function?
const int DIGITAL_PIN = 13; // Digital input. Ground pin 13 to reset wifi manager



#define DOUT_1  0
#define CLK_1  16
#define DOUT_2  2
#define CLK_2  16

HX711 scale1(DOUT_1, CLK_1);
HX711 scale2(DOUT_2, CLK_2);

//Moving Averages
MovingAverage temperatureAverage;
MovingAverage weight1Average;
MovingAverage weight2Average;




// SCK & MISO are defined by Arduino/Thing. Clock is 14, SPI MISO is 12

/////////////////
// Post Timing //
/////////////////
boolean postSparkFun = 1;
const unsigned long postRate = 30*1000; //milliseconds
unsigned long lastPost = -1;


//Read Rates
const unsigned long readRate = postRate/100; //milliseconds
unsigned long lastRead = 0;

// Instantiate an instance of the SparkFunMAX31855k class
SparkFunMAX31855k probe(CHIP_SELECT_PIN, VCC, GND);


void initHardware()
{
  Serial.begin(9600);
  Serial.println("\nBeginning...");
  delay(50);  // Let IC stabilize or first readings will be garbage
  pinMode(LED_PIN, OUTPUT);
  pinMode(DIGITAL_PIN, INPUT_PULLUP);
  digitalWrite(LED_PIN, LOW);
  // Don't need to set ANALOG_PIN as input, 
  // that's all it can be.
}

int postToServer()
{
  // LED turns on when we enter, it'll go off when we 
  // successfully post.
  digitalWrite(LED_PIN, HIGH);


  // Read the temperature in Fahrenheit
  float temperature = temperatureAverage.get();
  float w1 = weight1Average.get();
  float w2 = weight2Average.get();



  Serial.print("Reading: ");
  Serial.print(w1, 1); //scale.get_units() returns a float
  Serial.print(" lbs"); //You can change this to kg but you'll need to refactor the calibration_factor
  Serial.print("\n");

  
  Serial.print("Reading: ");
  Serial.print(w2, 1); //scale.get_units() returns a float
  Serial.print(" lbs"); //You can change this to kg but you'll need to refactor the calibration_factor
  Serial.print("\n");

  sendAllData(w1,w2,temperature);


  

  // Before we exit, turn the LED off.
  digitalWrite(LED_PIN, LOW);

  return 1; // Return success
}

void configModeCallback () {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
}

int resetWifiSettings() {
  WiFiManager wifiManager; 
  wifiManager.resetSettings();
   //set custom ip for portal
  wifiManager.setAPStaticIPConfig(IPAddress(1,1,1,1), IPAddress(1,1,1,1), IPAddress(255,255,255,0));
  //first parameter is name of access point, second is the password
  wifiManager.autoConnect("KilnTempSetup", "password");
  Serial.println("connected...yeey :)");
}

void setup() 
{
  Serial.begin(9600);
  Serial.println("\nBeginning...");
  delay(50);  // Let IC stabilize or first readings will be garbage
  initHardware();
  digitalWrite(LED_PIN, HIGH);

  //Wifi Manager
  WiFiManager wifiManager; 
  //reset settings - for testing
  //wifiManager.resetSettings();

  //set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  //wifiManager.setAPCallback(configModeCallback);
  //set custom ip for portal
  wifiManager.setAPStaticIPConfig(IPAddress(1,1,1,1), IPAddress(1,1,1,1), IPAddress(255,255,255,0));
  //first parameter is name of access point, second is the password
  wifiManager.autoConnect("KilnTempSetup", "password");
  Serial.println("connected...yeey :)");

  setFirstsValues();
}


void setFirstsValues()
{

    temperatureAverage.reset( getTemperature() );
    weight1Average.reset( getWeight(1) );
    weight2Average.reset( getWeight(2) );
  
}


float getTemperature(){
  
  float temperature = probe.readTempC();
  if (!isnan(temperature)) {
        if (temperature > 10000)
        {
        temperature = -99;
        }
  }
  
  return temperature;
}

float getWeight(int id){

  float out = -99;
  if(id==1){
      out = scale1.get_units();
  }
  else if(id==2){
      out = scale2.get_units();
  }

  return out;
}


float calibration_factor = -7050; //-7050 worked for my 440lb max scale setup
float off_set = 0; //-7050 worked for my 440lb max scale setup

void setupSacle(){

  Serial.println("<Scale Setyup>");
  scale1.set_scale();
  scale1.tare(); //Reset the scale to 0
  scale1.set_scale(calibration_factor);


  scale2.set_scale();
  scale2.tare(); //Reset the scale to 0
  scale2.set_scale(calibration_factor);
  Serial.println("</Scale Setyup>");


}



void loop() 
{ 
  if (postSparkFun)
  {
    if (lastPost + postRate <= millis() || lastPost == -1)
    {
      if (postToServer())
        lastPost = millis();
      else
        delay(100);    
    }

    if(lastRead + readRate <= millis()){
      
      temperatureAverage.update( getTemperature() );
      weight1Average.update( getWeight(1) );
      weight2Average.update( getWeight(2) );
      lastRead = millis();
      
    }
    
  }
  if (digitalRead(DIGITAL_PIN)==LOW)
  {
    resetWifiSettings();
  }    
}


