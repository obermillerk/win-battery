# win-battery
Monitor battery status in Windows 10.

## Contents
* [Installation](#installation)
* [Usage](#usage)
    * [Status Object](#status-object)
    * [API](#api)
    * [Events](#events)
* [Issues/Requests](#issuesrequests)

## Installation

This module requires *a piece but not all* of the [Windows 10 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk) module to install properly. You can download the [specific files](https://github.com/obermillerk/win-battery/blob/master/UnionMetadata.zip) and place them yourself (see the contained README.txt), or download the whole [Windows 10 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk).

```
npm install win-battery
```

## Usage

*Note that using this library on a device without a battery will result in an error being thrown from the require statement.*

```javascript
const battery = reqiure('win-battery');
// Throws an error if no battery present!

battery.status();
//  {
//    level: 73
//    charging: true
//    energySaver: 'disabled'
//  }

battery.on('levelchange', (status) => {
    if (status.charging) {
        console.log('Power gained!');
    } else {
        console.log('Power lost...');
    }
});
```

### Status Object
All events and functions in this library, unless otherwise specified, return a status object containing the following properties:

#### `level`
A number from 0 to 100, the percentage of battery remaining.

#### `charging`
A boolean, whether the battery is charging or not.

#### `full`
A boolean, whether the battery is fully charged or not.

#### `energySaver`
A string, `'on'` if energy saver is on, `'off'` if energy saver is off but ready to turn on automatically, or `'disabled'` if energy saver is turned off completely or the device is charging.

#### `dischargeTime`
A number, the estimated milliseconds remaining of battery life.

***This value will be*** `Infinity` ***when charging.*** It is recommended to not use this value when charging, particularly when using this value in calculations.***


### Properties

#### `battery.level`
***read only***  
Same as [`level`](#level) from [`status` object](#status-object).

#### `battery.charging`
***read only***  
Same as [`charging`](#charging) from [`status` object](#status-object).

#### `battery.full`
***read only***  
Same as [`full`](#full) from [`status` object](#status-object).

#### `battery.energySaver`
***read only***  
Same as [`energySaver`](#energysaver) from [`status` object](#status-object).

#### `battery.dischargeTime`
***read only***  
Same as [`dischargeTime`](#dischargetime) from [`status` object](#status-object).

#### `battery.low`
A number from 0 to 100, the threshold for a [`lowcharge`](#lowcharge) event to fire. When setting, will fire a [`lowcharge`](#lowcharge) event even if a [`lowcharge`](#lowcharge) event has already been fired on this charge. See [`lowcharge`](#lowcharge) event for details on this event.

Attempting to set this to anything other than a number between 0 and 100 (inclusive) will result in an error.

#### `battery.critical`
A number from 0 to 100, the threshold for a critical battery event to fire. When setting, will fire a [`criticalcharge`](#criticalcharge) event even if a [`criticalcharge`](#criticalcharge) event has already been fired on this charge. See [`criticalcharge`](#criticalcharge) event for details on this event.

Attempting to set this to anything other than a number between 0 and 100 (inclusive) will result in an error.

### API

#### `battery.status()`
Check the battery status. Allows a battery state to be recorded separately from the battery object itself.
* Returns a [`status` object](#status-object).


### Events
#### `levelchange`
Emitted when the battery level has changed. This event is still emitted when charging.

#### `chargingchange`
Emitted when the battery starts or stops charging.

#### `energysaverchange`
Emitted when the energy saver state has changed.

#### `dischargetimechange`
Emitted when the estimated [dischargeTime](#dischargetime) changes.

#### `fullcharge`
Emitted when the battery is charging and has reached full charge.

#### `lowcharge`
Emitted when the battery reaches the [`low`](#batterylow) charge threshold. Defaults to 20 percent.

This event will fire in a few different specific circumstances:
1. The device is running on battery power and the battery reaches the [`low`](#batterylow) threshold
2. The device is unplugged while the battery is less than or equal to the [`low`](#batterylow) threshold
3. The [`low`](#batterylow) threshold is set to a different value and the battery is less than or equal to the new threshold.

Once the event has fired, it will not fire due to subsequent [`levelchange`](#levelchange) events of lower value until the battery has been plugged in again, resulting in either case 1 or 2, or the  [`low`](#batterylow) threshold has been modified again.


#### `criticalcharge`
Emitted when the battery reaches the [`critical`](#batterycritical) charge threshold. Defaults to 10 percent.

This event will fire in a few different specific circumstances:
1. The device is running on battery power and the battery reaches the [`critical`](#batterycritical) threshold
2. The device is unplugged while the battery is less than or equal to the [`critical`](#batterycritical) threshold
3. The [`critical`](#batterycritical) threshold is set to a different value and the battery is less than or equal to the new threshold.

Once the event has fired, it will not fire due to subsequent [`levelchange`](#levelchange) events of lower value until the battery has been plugged in again, resulting in either case 1 or 2, or the  [`critical`](#batterycritical) threshold has been modified again.

## Issues/Requests
Issues and requests should be directed to the git repository.
http://github.com/obermillerk/win-battery/issues