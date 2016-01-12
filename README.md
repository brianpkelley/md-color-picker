# md-color-picker
Angular-Material based color picker with no jQuery or other DOM/utility library dependencies.

![preview](https://raw.githubusercontent.com/brianpkelley/md-color-picker/master/md-color-picker.png)

## Demo
Try out the demo here: **[Demo Plnkr](http://embed.plnkr.co/MJC42K/preview)**


## Install
#### NPM
1. Download [tinycolor.js](https://github.com/bgrins/TinyColor) 1.2.1 or higher. Other versions may work, though 1.2.1 was used to develop this.
2. Install `md-color-picker`.
```bash
npm install md-color-picker
```

#### Bower (includes tinycolor.js):
```bash
bower install md-color-picker
```

## Usage
- Include the css.
````html
<link href="path/to/md-color-picker/dist/mdColorPicker.min.css" rel="stylesheet" />
````
- Include the javascript.
````html
<script src="path/to/tinycolor/dist/tinycolor-min.js"></script>
<script src="path/to/md-color-picker/dist/mdColorPicker.min.js"></script>
````
- Add dependencies to your application (ngCookies is optional)
````javascript
var app = angular.module('myApp', ['ngMaterial','ngCookies', 'mdColorPicker']);
````

- Place the directive where ever it is needed.
_note:_ this breaks the old version 0.1 as it now uses _ng-model_ instead of _value_

````html
<div md-color-picker ng-model="valueObj"></div>
````

## Angular dependencies
- [Angular Material](https://material.angularjs.org)
- [ngCookies](https://docs.angularjs.org/api/ngCookies) (optional)

## Other dependencies
The only other dependency is [tinycolor.js](https://github.com/bgrins/TinyColor) which is an exceptional color manipulation library.



## Disclaimer
This is still in a very early beta, and is rappidly changing (3 versions before initial commit).  I am open to any and all help anyone is willing to put in.  Will update as we go.


## Known issues / TODO
- [ ] Prevent focus from opening color picker on window/tab activation.
- [ ] Focus on preview input when user starts typing.
- [ ] Clean up code.
  - [ ] Javascript
  - [ ] CSS / LESS
  - [X] Build script cleaned up and static server integrated for development
