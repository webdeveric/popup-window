# Popup

[![devDependencies Status](https://david-dm.org/webdeveric/popup-window/dev-status.svg)](https://david-dm.org/webdeveric/popup-window?type=dev)

[![NPM](https://nodei.co/npm/popup-window.png)](https://nodei.co/npm/popup-window/)

## Install

```shell
npm install popup-window --save
```

## Example usage (es2015)

```javascript
import Popup from 'popup-window';

let win = new Popup(
  'http://webdeveric.com/',
  {
    name: 'window name goes here', // Optional
    width: 600,
    height: 400
  }
);

win.opened( win => {
  console.log('Popup has been opened');
}).blocked( win => {
  console.log('Popup has been blocked');
}).closed( win => {
  console.log('Popup has been closed');
});

win.open();
```

## Window features

The window will have these features by default.
You can pass in an object with some or all of these settings to the constructor, as shown above.
If the `width` or `height` is null, it will be calculated to be half the screen width/height.
If the `left` or `top` is null, it will be calculated so that the window is in the center of the screen.

```javascript
{
  width: null,
  height: null,
  left: null,
  top: null,
  menubar: 0,
  toolbar: 0,
  location: 1,
  status: 1,
  resizable: 1,
  scrollbars: 1
}
```

## Methods

- **open** - open the window.
- **close** - close the window.
- **opened** - accepts a callback - the callback is called when the window is opened. 
- **closed** - accepts a callback - the callback is called when the window is closed. 
- **blocked** - accepts a callback - the callback is called when the window is blocked from opening. 

The `opened`, `closed`, and `blocked` callbacks receive the `Popup` instance as the only argument.
