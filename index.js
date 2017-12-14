(function() {

const power = require('windows.system.power');
const manager = power.PowerManager;

if (manager.batteryStatus == power.BatteryStatus.notPresent) {
    throw new Error('No battery present!');
}

const EventEmitter = require('events').EventEmitter;
var battery = new EventEmitter();
var low = 20;
var critical = 10;
var lowEmitted = false;
var criticalEmitted = false;

Object.defineProperties(battery, {
    level: {
        enumerable: true,
        get: () => manager.remainingChargePercent
    },
    charging: {
        enumerable: true,
        get: () => manager.batteryStatus == power.BatteryStatus.charging
                    || manager.batteryStatus == power.BatteryStatus.idle
    },
    full: {
        enumerable: true,
        get: () => manager.batteryStatus == power.BatteryStatus.idle
    },
    energySaver: {
        enumerable: true,
        get: () => _parseEnumValue(manager.energySaverStatus, power.EnergySaverStatus)
    },
    dischargeTime: {
        enumerable: true,
        get: () => battery.charging ? Infinity : manager.remainingDischargeTime
    },
    low: {
        get: () => low,
        set: (val) => {
            if (typeof val !== 'number') {
                throw new Error('low must be a number!');
            }
            if (val < 0 || val > 100) {
                throw new Error('low must be in the range [0-100] (inclusive)!');
            }
            low = val;
            lowEmitted = false;
            if (battery.level <= low) {
                _emitEvent('lowcharge');
                lowEmitted = true;
            }
        }
    },
    critical: {
        get: () => critical,
        set: (val) => {
            if (typeof val !== 'number') {
                throw new Error('critical must be a number!');
            }
            if (val < 0 || val > 100) {
                throw new Error('critical must be in the range [0-100] (inclusive)!');
            }
            critical = val;
            criticalEmitted = false;
            if (battery.level <= critical) {
                _emitEvent('criticalcharge');
                criticalEmitted = true;
            }
        }
    }
})

manager.on('batteryStatusChanged', () => {
    _emitEvent('chargingchange');

    if (!battery.charging) {
        if (battery.level <= low) {
            if (!lowEmitted) {
                _emitEvent('lowcharge');
                lowEmitted = true;
            }
        } else {
            lowEmitted = false;
        }
    
        if (battery.level <= critical) {
            if (!criticalEmitted) {
                _emitEvent('criticalcharge');
                critcalEmitted = true;
            }
        } else {
            criticalEmitted = false;
        }
    }

    if (battery.full) {
        _emitEvent('fullcharge');
    }
});

manager.on('remainingChargePercentChanged', () => {
    _emitEvent('levelchange');

    if (battery.level <= low) {
        if (!lowEmitted) {
            _emitEvent('lowcharge');
            lowEmitted = true;
        }
    } else {
        lowEmitted = false;
    }

    if (battery.level <= critical) {
        if (!criticalEmitted) {
            _emitEvent('criticalcharge');
            critcalEmitted = true;
        }
    } else {
        criticalEmitted = false;
    }
});

manager.on('energySaverStatusChanged', () => {
    _emitEvent('energysaverchange');
});

manager.on('remainingDischargeTimeChanged', () => {
    _emitEvent('dischargetimechange');
});

function _emitEvent(event) {
    battery.emit(event, status());
}

function status() {
    return {
        level: battery.level,
        charging: battery.charging,
        full: battery.full,
        energySaver: battery.energySaver,
        dischargeTime: battery.dischargeTime
    };
};

battery.status = status;

battery.fireEvents = function(force) {
    _emitEvent('levelchange');
    _emitEvent('chargingchange');
    _emitEvent('energysaverchange');
    _emitEvent('dischargetimechange');
    if (battery.full) {
        _emitEvent('fullcharge');
    }
    if ((force || !lowEmitted)
        && !battery.charging && battery.level <= battery.low) {
        _emitEvent('lowcharge');
        lowEmitted = true;
    }
    if ((force || !criticalEmitted)
        && !battery.charging && battery.level <= battery.critical) {
        _emitEvent('criticalcharge');
        criticalEmitted = true;
    }
}

function _parseEnumValue(val, enumeration) {
    let keys = Object.keys(enumeration);

    for (key in keys) {
        key = keys[key];
        if(enumeration[key] === val) {
            return key;
        }
    }
    return null;
}


module.exports = battery;
}())