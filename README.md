# Popup

## Example usage

```javascript
const win = new Popup('http://webdeveric.com/', { width: 600, height: 400 } ).opened( () => {
  console.log('Popup has been opened');
}).blocked( () => {
  console.log('Popup has been bloced');
}).closed( () => {
  console.log('Popup has been closed');
});

win.open();
```