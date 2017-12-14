const battery = require('./index.js');

battery.on('levelchange', (status) => {
    console.log('level change:', status);
});

battery.on('chargingchange', (status) => {
    console.log('charging change:', status);
});

battery.on('energysaverchange', (status) => {
    console.log('energy saver change:', status);
});

battery.on('dischargetimechange', (status) => {
    console.log('discharge time change:', status);
});

battery.on('lowcharge', (status) => {
    console.log('low charge!');
});

battery.on('criticalcharge', (status) => {
    console.log('critical charge!');
});

setTimeout(() => {}, 600000)