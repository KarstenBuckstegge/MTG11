// Code based on tutorial by Lasse Marburg / machinaex.de
// https://www.youtube.com/watch?v=KcvgQ9eWKDU

int dialPin = 0; // Analog input used on arduino
int signalStrength = 0; // Is reciever lifted or not
int signalStrengthStat = 0;

int counter = 0;
int dialedNumber = 10;

unsigned long int timeOfSignal = 0;
unsigned long int timeSinceLastChange = 0;

unsigned long int finishedDialingTimeout = 200;
unsigned long int clatterTimeout = 120;

int signalThreshold = 400;

bool dialing = false;
bool hungUp = false;


void setup()
{
  Serial.begin(115200);
  pinMode(dialPin, INPUT);
}


void loop() 
{
  if (analogRead(dialPin) > signalThreshold)
  {
    signalStrength = 1;
  } else {
    signalStrength = 0;
  }

  /*
  *  DIALING
  */
  if ( signalStrength != signalStrengthStat )
  {
    signalStrengthStat = signalStrength;
    // on dial start one signal is send
    if (signalStrength == HIGH)
    {
      dialing = true;
      if (hungUp)
      {
        // RECIEVER LIFTED
        Serial.println("lifted");
        hungUp = false;
        timeOfSignal = millis();
      }
    } 

    else if (signalStrength == LOW)
    {
      // CLATTER
      timeOfSignal = millis();
      counter++;
    }
  }

  timeSinceLastChange = millis() - timeOfSignal;

  if ( dialing == true )
  {
    // finished dialing?
    if ( timeSinceLastChange > clatterTimeout )
    {
      if (counter == 10)
      {
        dialedNumber = 0;
      } 
      else if (counter > 0) {
        dialedNumber = counter;
      }
      if (dialedNumber < 10)
      {
        // DIALED NUMBER
        Serial.print(dialedNumber);
        Serial.println();
      }

      dialing = false;
      counter = 0;
      dialedNumber = 10;
    }
  }

  if ( signalStrength == LOW )
  {
    if ( timeSinceLastChange > finishedDialingTimeout && hungUp == false)
    {
      // HUNG UP
      Serial.println("hungUp");
      hungUp = true;
      dialing = false;
      counter = 0;
      dialedNumber = 10;
    }
  } 
}


