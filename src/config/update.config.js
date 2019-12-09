// eslint-disable-next-line import/no-extraneous-dependencies
const copydir = require('copy-dir');

// copydir('./node_modules/scandipwa-base/src/app', './vendor/src/app', {
//     utimes: true,
//     mode: true,
//     cover: true
// }, (err) => {
//     if (err) throw err;
//     console.log('Update source app, OK!');
// });
copydir('./node_modules/scandipwa-base/src/sw', './vendor/src/sw', {
    utimes: true,
    mode: true,
    cover: true
}, (err) => {
    if (err) throw err;
    console.log('Update source sw, OK!');
});