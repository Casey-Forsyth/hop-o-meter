/////////////////
// Server Keys //
/////////////////
String PrivateKey = "y0vKtrQfFyQqzkApQr27U485eiMjkIEPohOTaNFaQidSCVUycmHNtOYMjfiojDTv"; //This is the demo key. Add yours here.
String host = "http://159.203.40.107";



bool sendAllData(float w1,float w2, float temperature){
  sendWeight(0,w1);
  sendWeight(1,w2);
  sendTemperature(temperature);

  return true;
}



void sendWeight(int kegNum,float weight){
  
  Serial.println("Weight Send Keg:");
  Serial.print(kegNum);
  Serial.print(" Weight: ");
  Serial.print(weight);
  Serial.print("\n");
  HTTPClient http;    //Declare object of class HTTPClient
  http.setTimeout(2000);
  http.begin( host + "/sensorPoint/add");      //Specify request destination
  http.addHeader("Content-Type", "application/json");  //Specify content-type header
  
  String sWeight = String(weight);  
  String jsonBody = "{\"kegMeterApiKey\":\"" + PrivateKey + "\",\"val\":" + sWeight + ",\"kegNum\":" + kegNum + "}\n";
  
  int httpCode = http.POST(jsonBody );   //Send the request
  String payload = http.getString();                                        //Get the response payload
  
  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload
  
  http.end();  //Close connection

}


void sendTemperature(float temperature){

  Serial.print("Temperature Send");
  Serial.println(temperature);


  HTTPClient http;    //Declare object of class HTTPClient
  http.setTimeout(2000);
  http.begin(host + "/temperature/add");      //Specify request destination
  http.addHeader("Content-Type", "application/json");  //Specify content-type header
  
  String sTemperature = String(temperature);  
  String jsonBody = "{\"kegMeterApiKey\":\"" + PrivateKey + "\",\"val\":" + sTemperature + "}\n";

  int httpCode = http.POST(jsonBody);   //Send the request
  String payload = http.getString();                                        //Get the response payload
  
  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload
  
  http.end();  //Close connection


}

