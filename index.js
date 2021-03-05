var Service, Characteristic;
var mqtt    = require('mqtt');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-mqtt-contactsensor-delay", "mqtt-contactsensor-delay", ContactSensorDelayAccessory);
}

function ContactSensorDelayAccessory(log, config) {

	this.log = log;

	this.name = config["name"];
	this.url = config['url'];
	this.topic = config['topic'];
	this.sn = config['sn'] || 'Unknown';
	this.delay = config['delay'] || 5000;
	this.openanddelay = config['openanddelay'] || false;
	this.reversedetect = config['reversedetect'] || false;
	this.debug = config['debug'] || false;
	this.timer;
	this.timer2;

	this.client_Id = 'mqttjs_' + Math.random().toString(16).substr(2, 8);

	this.options = {
		keepalive: 10,
		clientId: this.client_Id,
		protocolId: 'MQTT',
		protocolVersion: 4,
		clean: true,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
		username: config["username"],
		password: config["password"],
		rejectUnauthorized: false
	};

	this.service = new Service.ContactSensor();
	this.client  = mqtt.connect(this.url, this.options);

	var self = this;

	this.client.subscribe(this.topic);
 
	this.client.on('message', function (topic, message) {
                try {
		data = JSON.parse(message);
                } catch (e) {
                if (message.toString() === "ON") {
                   data = self.reversedetect ? "1" : "0";
                } else {
                   data = self.reversedetect ? "0" : "1";
                }
                }
		if (data === null) return null;
		if (self.debug) self.log(self.name, "- MQTT Data :", data, "/", message.toString());
		statevalue1 = Characteristic.ContactSensorState.CONTACT_DETECTED;
		statevalue2 = Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
		if (self.openanddelay) {
		   statevalue1 = Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
		   statevalue2 = Characteristic.ContactSensorState.CONTACT_DETECTED;
		}
		if (self.debug) self.log(self.name, "- StateValue :", self.openanddelay, "/", statevalue1, "/", statevalue2);
		if (data === "0") {
		    clearTimeout(self.timer);
		    if (self.debug) self.log(self.name, "- Starting the Timer for", self.delay, "Milliseconds");
		    self.service.getCharacteristic(Characteristic.ContactSensorState).setValue(statevalue1);
		    self.timer = setTimeout(function() {
		        if (self.debug) self.log(self.name, "- Triggering Contact Sensor ", statevalue2 ? "CONTACT_NOT_DETECTED" : "CONTACT_DETECTED");
		        self.service.getCharacteristic(Characteristic.ContactSensorState).setValue(statevalue2);
			self.timer2 = setTimeout(function() {
			    if (self.debug) self.log(self.name, "- Triggering Contact Sensor ", statevalue1 ? "CONTACT_DETECTED" : "CONTACT_NOT_DETECTED");
			    self.service.getCharacteristic(Characteristic.ContactSensorState).setValue(statevalue1);
			}.bind(self), 3000);
			clearTimeout(self.timer2);
		    }.bind(self), self.delay);
		}
		else {
		    if (self.debug) self.log(self.name, "- Clear the Timer");
		    clearTimeout(self.timer);
		    self.service.getCharacteristic(Characteristic.ContactSensorState).setValue(Characteristic.ContactSensorState.CONTACT_DETECTED);
		}

		//self.log(self.name, " - MQTT Data : ", data, " / ", message.toString());
		//self.value = parseInt(data, 10);
		//self.service.getCharacteristic(Characteristic.ContactSensorState).setValue(self.value ?
		//		Characteristic.ContactSensorState.CONTACT_DETECTED : Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
	});

}

ContactSensorDelayAccessory.prototype.getState = function(callback) {
		this.log(this.name, " - MQTT : ", this.value);
		callback(null, this.value);
}

ContactSensorDelayAccessory.prototype.getServices = function() {

	var informationService = new Service.AccessoryInformation();

	informationService
		.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, "wnovak")
		.setCharacteristic(Characteristic.Model, "MQTT Delay Sensor")
		.setCharacteristic(Characteristic.SerialNumber, this.sn);

	return [informationService, this.service];
}

