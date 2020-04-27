# homebridge-mqtt-contactsensor-delay

Get Contact Sensor status via MQTT in Homebridge with delay

Installation
--------------------
    sudo npm install -g homebridge-mqtt-contactsensor-delay


Sample HomeBridge Configuration
--------------------
    {
      "bridge": {
        "name": "HomeBridge",
        "username": "CC:33:3B:D3:CE:32",
        "port": 51826,
        "pin": "321-45-123"
      },

      "description": "",

      "accessories": [
        {
          "accessory": "mqtt-contactsensor-delay",
          "name": "Main Door",
          "url": "mqtt://localhost",
          "topic": "home/livingroom/contactsensor",
          "username": "username",
          "password": "password",
          "delay": "15000",
          "openanddelay": false,
          "debug": false
        }
      ],

      "platforms": []
    }


Plugin Configuration
--------------------

### Required configuration

| Key | Description |
| --- | ------------|
| accessory | The type of accessory - has to be "mqtt-contactsensor-delay" |
| name | The name of the device - used in HomeKit apps as well as Siri |
| url | URL to the mosquitto server, default "mqtt://localhost" |
| topic | mqtt topic of monitoring device |

### Optional configuration

| Key | Description |
| --- | ------------|
| username | mosquitto server user, if required |
| password | mosquitto server password, if required |
| delay | time to delay in milliseconds, default 5000 |
| openanddelay | contact sensor is open, if "true" and then timer delay, if "false" timer delay and then contact sensor is open, default "false" |
| debug | write debugmessages to log, default "false" |

# Info about where the plugin comes from
This plugin is based on:

https://github.com/heisice/homebridge-mqtt-contactsensor

https://github.com/nitaybz/homebridge-delay-switch


