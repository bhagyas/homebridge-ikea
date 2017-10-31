module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(8);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(9);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const os = __webpack_require__(3);
const utils = __webpack_require__(4);
const util = __webpack_require__(15);
let Kelvin, Accessory, Service, Characteristic, UUIDGen;
const UUID_KELVIN = 'C4E24248-04AC-44AF-ACFF-40164E829DBA';
function IkeaPlatform(log, config) {
    this.log = log;
    this.config = config;
    this.config.log = this.log;
    this.devices = [];
    if (!this.config.coapClient && (os.platform() !== "darwin" && os.platform() !== "linux")) {
        throw Error("No coap-client found, please specify the path to it using coapClient");
    }
    this.config.coapClient = this.config.coapClient || `${__dirname}/bin/coap-client-${os.platform()}`;
}
IkeaPlatform.prototype = {
    accessories: function (callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const foundAccessories = [];
            console.info("Setting up identity...");
            this.config.presharedKey = yield utils.getPresharedKey(self.config);
            const devices = yield utils.getDevices(self.config);
            yield Promise.all(devices.map((deviceId) => __awaiter(this, void 0, void 0, function* () {
                const device = yield utils.getDevice(self.config, deviceId);
                if (device.type === 2) {
                    foundAccessories.push(new IkeaAccessory(self.log, self.config, device));
                }
            })));
            callback(foundAccessories);
        });
    }
};
function IkeaAccessory(log, config, device) {
    this.name = device.name;
    this.config = config;
    this.config.log = string => log("[" + this.name + "] " + string);
    this.device = device;
    this.currentBrightness = this.device.light[0]["5851"];
    this.currentState = this.device.light[0]["5850"];
    this.previousBrightness = this.currentBrightness;
    this.color = {};
}
IkeaAccessory.prototype = {
    // Respond to identify request
    identify: function (callback) {
        this.config.log("Hi!");
        callback();
    },
    getServices: function () {
        const accessoryInformation = new Service.AccessoryInformation();
        accessoryInformation
            .setCharacteristic(Characteristic.Name, this.device.name)
            .setCharacteristic(Characteristic.Manufacturer, this.device.details["0"])
            .setCharacteristic(Characteristic.Model, this.device.details["1"])
            .setCharacteristic(Characteristic.FirmwareRevision, this.device.details["3"]);
        const self = this;
        const lightbulbService = new Service.Lightbulb(self.name);
        lightbulbService
            .addCharacteristic(Characteristic.StatusActive);
        lightbulbService
            .setCharacteristic(Characteristic.StatusActive, this.device.reachabilityState)
            .setCharacteristic(Characteristic.On, this.device.light[0]["5850"])
            .setCharacteristic(Characteristic.Brightness, parseInt(String(Math.round(this.device.light[0]["5851"] * 100 / 255))));
        lightbulbService
            .getCharacteristic(Characteristic.StatusActive)
            .on('get', callback => {
            utils.getDevice(self.config, self.device.instanceId).then(device => {
                callback(null, device.reachabilityState);
            });
        });
        lightbulbService
            .getCharacteristic(Characteristic.On)
            .on('get', callback => {
            utils.getDevice(self.config, self.device.instanceId).then(device => {
                self.currentBrightness = device.light[0]["5851"];
                self.currentState = device.light[0]["5850"];
                callback(null, self.currentState);
            });
        })
            .on('set', (state, callback) => {
            if (typeof state !== 'number') {
                state = state ? 1 : 0;
            }
            if (self.currentState == 1 && state == 0) {
                self.currentState = 0;
                utils.setBrightness(self.config, self.device.instanceId, 0, result => callback());
            }
            else if (self.currentState == 0 && state == 1) {
                self.currentState = 1;
                utils.setBrightness(self.config, self.device.instanceId, (self.currentBrightness > 1 ? self.currentBrightness : 255), result => callback());
            }
            else {
                callback();
            }
        });
        lightbulbService
            .getCharacteristic(Characteristic.Brightness)
            .on('get', callback => {
            utils.getDevice(self.config, self.device.instanceId).then(device => {
                self.currentBrightness = device.light[0]["5851"];
                self.currentState = device.light[0]["5850"];
                callback(null, parseInt(String(Math.round(self.currentBrightness * 100 / 255))));
            });
        })
            .on('set', (powerOn, callback) => {
            self.currentBrightness = Math.floor(255 * (powerOn / 100));
            utils.setBrightness(self.config, self.device.instanceId, Math.round(255 * (powerOn / 100)), result => callback());
        });
        if (typeof this.device.light[0]["5706"] !== 'undefined') {
            if (this.device.light[0]["5706"].length < 6) {
                this.device.light[0]["5706"] = "ffcea6"; //Default value when it was offline
            }
            var hsl = utils.convertRGBToHSL(this.device.light[0]["5706"]);
            lightbulbService
                .addCharacteristic(Characteristic.Kelvin);
            lightbulbService
                .setCharacteristic(Characteristic.Kelvin, utils.getKelvin(this.device.light[0]["5709"]))
                .setCharacteristic(Characteristic.Hue, hsl[0] * 360)
                .setCharacteristic(Characteristic.Saturation, hsl[1] * 100);
            lightbulbService
                .getCharacteristic(Characteristic.Kelvin)
                .on('get', callback => {
                utils.getDevice(self.config, self.device.instanceId).then(device => {
                    self.currentKelvin = utils.getKelvin(device.light[0]["5709"]);
                    callback(null, self.currentKelvin);
                });
            })
                .on('set', (kelvin, callback) => {
                utils.setKelvin(self.config, self.device.instanceId, kelvin, result => callback());
            });
            lightbulbService
                .getCharacteristic(Characteristic.Hue)
                .on('get', callback => {
                utils.getDevice(self.config, self.device.instanceId).then(device => {
                    if (typeof device.light[0]["5706"] !== 'undefined' || device.light[0]["5706"].length < 6) {
                        device.light[0]["5706"] = "ffcea6"; //Default value when it fails polling
                    }
                    let hsl = utils.convertRGBToHSL(device.light[0]["5706"]);
                    callback(null, hsl[0] * 360);
                });
            })
                .on('set', (hue, callback) => {
                self.color.hue = hue / 360;
                if (typeof self.color.saturation !== 'undefined') {
                    utils.setColor(self.config, self.device.instanceId, self.color, result => callback());
                    self.color = {};
                }
                else {
                    callback();
                }
            });
            lightbulbService
                .getCharacteristic(Characteristic.Saturation)
                .on('get', callback => {
                utils.getDevice(self.config, self.device.instanceId).then(device => {
                    if (typeof device.light[0]["5706"] !== 'undefined' || device.light[0]["5706"].length < 6) {
                        device.light[0]["5706"] = "ffcea6"; //Default value when it fails polling
                    }
                    let hsl = utils.convertRGBToHSL(device.light[0]["5706"]);
                    callback(null, hsl[1] * 100);
                });
            })
                .on('set', (saturation, callback) => {
                self.color.saturation = saturation / 100;
                if (typeof self.color.hue !== 'undefined') {
                    utils.setColor(self.config, self.device.instanceId, self.color, result => callback());
                    self.color = {};
                }
                else {
                    callback();
                }
            });
        }
        return [accessoryInformation, lightbulbService];
    }
};
module.exports = function (homebridge) {
    Accessory = homebridge.platformAccessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid; // @TODO: Should be using this
    Characteristic.Kelvin = function () {
        Characteristic.call(this, 'Kelvin', UUID_KELVIN);
        this.setProps({
            format: Characteristic.Formats.INT,
            unit: 'Kelvin',
            maxValue: 4000,
            minValue: 2200,
            minStep: 1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE]
        });
        this.value = this.getDefaultValue();
    };
    util.inherits(Characteristic.Kelvin, Characteristic);
    Characteristic.Kelvin.UUID = UUID_KELVIN;
    homebridge.registerPlatform("homebridge-ikea", "Ikea", IkeaPlatform);
};

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execSync = __webpack_require__(5).execSync;
var shortid = __webpack_require__(6);
const coap = (method, config, payload = "{}", preAuth = false) => {
    return `${config.coapClient} -u "${preAuth ? "Client_identity" : config.clientIdentity}" -k "${(preAuth ? config.psk : config['presharedKey'])}" -e '${payload}' -m ${method} coaps://${config.ip}/${(preAuth ? 15011 : 15001)}/`;
};
const put = (config, id, payload) => coap("put", config, payload) + id;
const get = (config, id = "") => coap("get", config) + id;
const post = (config, id = "") => {
    let clientIdentity = "hb-" + shortid.generate();
    config.clientIdentity = clientIdentity;
    let payload = { "9090": clientIdentity };
    return coap("post", config, JSON.stringify(payload), true) + id + "9063";
};
const kelvinToPercent = (kelvin) => (kelvin - 2200) / 18; // 4000
const percentToKelvin = (percent) => 2200 + (18 * percent); // 4000
const colorX = percent => Math.round(33135 - (82.05 * percent)); // 24930
const colorY = percent => Math.round(27211 - (25.17 * (100 - percent))); // 24694
exports.getKelvin = colorX => percentToKelvin(Math.round((33135 - colorX) / 82.05));
exports.setBrightness = (config, id, brightness, callback) => {
    const values = `{ "3311" : [{ "5851" : ${brightness}} ] }`;
    const cmd = put(config, id, values);
    if (config.debug) {
        config.log(`Setting brightness of ${brightness} for ${id}`);
        config.log(cmd);
    }
    callback(execSync(cmd, { encoding: "utf8" }));
};
exports.setKelvin = (config, id, kelvin, callback) => {
    const values = `{ "3311" : [{ "5709" : ${colorX(kelvinToPercent(kelvin))}, "5710": ${colorY(kelvinToPercent(kelvin))} }] }`;
    var cmd = put(config, id, values);
    if (config.debug) {
        config.log(cmd);
    }
    callback(execSync(cmd, { encoding: "utf8" }));
};
// Source: http://stackoverflow.com/a/9493060
const hslToRgb = (h, s, l) => {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
const rgbToHsl = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
};
// Source http://stackoverflow.com/a/36061908
const rgbToXy = (red, green, blue) => {
    red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
    green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
    blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);
    var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;
    var fx = X / (X + Y + Z);
    var fy = Y / (X + Y + Z);
    return [fx.toPrecision(4), fy.toPrecision(4)];
};
exports.convertRGBToHSL = (hex) => {
    var c = hexToRgb(hex);
    return rgbToHsl(c.r, c.g, c.b);
};
exports.setColor = (config, id, color, callback) => {
    // First we convert hue and saturation
    // to RGB, with 75% lighntess
    const rgb = hslToRgb(color.hue, color.saturation, 0.75);
    // Then we convert the rgb values to
    // CIE L*a*b XY values
    const cie = rgbToXy(...rgb).map(item => {
        // we need to scale the values
        return Math.floor(100000 * parseFloat(item));
    });
    const values = `{ "3311" : [{ "5709" : ${cie[0]}, "5710": ${cie[1]} }] }`;
    const cmd = put(config, id, values);
    if (config.debug) {
        config.log(cmd);
    }
    callback(execSync(cmd, { encoding: "utf8" }));
};
// @TODO: Figure out if the gateway actually don't support this
exports.setOnOff = (config, id, state, callback) => {
    const values = `{ "3311" : [{ "5580" : ${state}} ] }`;
    var cmd = put(config, id, values);
    if (config.debug) {
        config.log(cmd);
    }
    callback(execSync(cmd, { encoding: "utf8" }));
};
const parseDeviceList = str => {
    const split = str.trim().split("\n");
    return split.pop().slice(1, -1).split(",");
};
exports.getDevices = config => new Promise((resolve, reject) => {
    let cmd = get(config);
    if (config.debug) {
        config.log(cmd);
    }
    resolve(parseDeviceList(execSync(cmd, { encoding: "utf8" })));
});
exports.getPresharedKey = config => new Promise((resolve) => {
    let cmd = post(config);
    resolve(parsePresharedKey(execSync(cmd, { encoding: 'utf8' })));
});
const parsePresharedKey = str => {
    const split = str.trim().split("\n");
    try {
        const json = JSON.parse(split.pop());
        let presharedKey = json['9091'];
        return presharedKey;
    }
    catch (e) {
        throw new Error("Error obtaining preshared key.");
    }
};
const parseDevice = str => {
    const split = str.trim().split("\n");
    const json = JSON.parse(split.pop());
    return {
        name: json["9001"],
        type: json["5750"],
        createdAt: json["9002"],
        instanceId: json["9003"],
        details: json["3"],
        reachabilityState: json["9019"],
        lastSeen: json["9020"],
        otaUpdateState: json["9054"],
        switch: json["15009"],
        light: json["3311"]
    };
    /*
      light: {
      {
         onoff: json["3311"]["5580"],
         dimmer: json["3311"]["5851"],
         color_x: json["3311"]["5709"],
         color_y: json["3311"]["5710"],
         color: json["3311"]["5706"],
         instance_id: json["3311"]["9003"],
         "5707":0,
         "5708":0,
         "5711":0,
        }
      }
    */
};
exports.getDevice = (config, id) => new Promise((resolve, reject) => {
    var cmd = get(config, id);
    if (config.debug) {
        config.log(`Get device information for: ${id}`);
        config.log(cmd);
    }
    resolve(parseDevice(execSync(cmd, { encoding: "utf8" })));
});


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(7);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);
var encode = __webpack_require__(1);
var decode = __webpack_require__(11);
var build = __webpack_require__(12);
var isValid = __webpack_require__(13);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(14) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = __webpack_require__(10);
var randomBytes = crypto.randomBytes;

function randomByte() {
    return randomBytes(1)[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(1);
var alphabet = __webpack_require__(0);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = parseInt(process.env.NODE_UNIQUE_ID || 0, 10);


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map