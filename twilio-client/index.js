const Twilio = require("twilio");

const CONFIG = require("./../config");

const client = Twilio(CONFIG.TWILIO_SSID, CONFIG.TWILIO_TOKEN);

module.exports = client;
