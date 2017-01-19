<a name="$mdColorPickerConfig"></a>

## $mdColorPickerConfig
$mdColorPickerConfig Provider

**Kind**: global class  

* [$mdColorPickerConfig](#$mdColorPickerConfig)
    * [.Notation](#$mdColorPickerConfig+Notation)
        * [new Notation(notation)](#new_$mdColorPickerConfig+Notation_new)
        * [.name](#$mdColorPickerConfig+Notation+name) : <code>String</code>
        * [.index](#$mdColorPickerConfig+Notation+index) : <code>Integer</code>
        * [.testExp](#$mdColorPickerConfig+Notation+testExp) : <code>RegExp</code>
    * [.Tab](#$mdColorPickerConfig+Tab)
        * [new Tab(name, tab)](#new_$mdColorPickerConfig+Tab_new)
        * [.name](#$mdColorPickerConfig+Tab+name) : <code>String</code>
        * [.icon](#$mdColorPickerConfig+Tab+icon) : <code>String</code>
        * [.template](#$mdColorPickerConfig+Tab+template) : <code>String</code>
        * [.templateUrl](#$mdColorPickerConfig+Tab+templateUrl) : <code>String</code>
        * [.$elemnt](#$mdColorPickerConfig+Tab+$elemnt) : <code>$element</code>
    * [.notations](#$mdColorPickerConfig+notations) : <code>Object</code>
        * [.order](#$mdColorPickerConfig+notations+order)
        * [.get(notation)](#$mdColorPickerConfig+notations+get) ⇒ <code>Object</code>
        * [.select(color)](#$mdColorPickerConfig+notations+select) ⇒ <code>String</code>
        * [.add(name, notation)](#$mdColorPickerConfig+notations+add)
    * [.tabs](#$mdColorPickerConfig+tabs) : <code>Object</code>
        * [.order](#$mdColorPickerConfig+tabs+order)
        * [.add(tab, [addToOrder])](#$mdColorPickerConfig+tabs+add)
        * [.get(tab)](#$mdColorPickerConfig+tabs+get) ⇒ <code>Tab</code>

<a name="$mdColorPickerConfig+Notation"></a>

### $mdColorPickerConfig.Notation
Notation object.

**Kind**: instance class of <code>[$mdColorPickerConfig](#$mdColorPickerConfig)</code>  

* [.Notation](#$mdColorPickerConfig+Notation)
    * [new Notation(notation)](#new_$mdColorPickerConfig+Notation_new)
    * [.name](#$mdColorPickerConfig+Notation+name) : <code>String</code>
    * [.index](#$mdColorPickerConfig+Notation+index) : <code>Integer</code>
    * [.testExp](#$mdColorPickerConfig+Notation+testExp) : <code>RegExp</code>

<a name="new_$mdColorPickerConfig+Notation_new"></a>

#### new Notation(notation)

| Param | Type | Description |
| --- | --- | --- |
| notation | <code>Object</code> |  |
| notation.name | <code>String</code> | Name of the notation used as an identifier. |
| [notation.testExp] | <code>RegExp</code> | Regular Expression used to test a string against the notation format. |

<a name="$mdColorPickerConfig+Notation+name"></a>

#### notation.name : <code>String</code>
The name of the notation.

**Kind**: instance property of <code>[Notation](#$mdColorPickerConfig+Notation)</code>  
<a name="$mdColorPickerConfig+Notation+index"></a>

#### notation.index : <code>Integer</code>
The index of the notation in the [order](#$mdColorPickerConfig+notations+order) array.

**Kind**: instance property of <code>[Notation](#$mdColorPickerConfig+Notation)</code>  
**Default**: <code>-1</code>  
<a name="$mdColorPickerConfig+Notation+testExp"></a>

#### notation.testExp : <code>RegExp</code>
Test RegExp used by [$mdColorPickerConfig#Notation#test]($mdColorPickerConfig#Notation#test)

**Kind**: instance property of <code>[Notation](#$mdColorPickerConfig+Notation)</code>  
<a name="$mdColorPickerConfig+Tab"></a>

### $mdColorPickerConfig.Tab
Base for all mdColorPicker Tabs.

**Kind**: instance class of <code>[$mdColorPickerConfig](#$mdColorPickerConfig)</code>  

* [.Tab](#$mdColorPickerConfig+Tab)
    * [new Tab(name, tab)](#new_$mdColorPickerConfig+Tab_new)
    * [.name](#$mdColorPickerConfig+Tab+name) : <code>String</code>
    * [.icon](#$mdColorPickerConfig+Tab+icon) : <code>String</code>
    * [.template](#$mdColorPickerConfig+Tab+template) : <code>String</code>
    * [.templateUrl](#$mdColorPickerConfig+Tab+templateUrl) : <code>String</code>
    * [.$elemnt](#$mdColorPickerConfig+Tab+$elemnt) : <code>$element</code>

<a name="new_$mdColorPickerConfig+Tab_new"></a>

#### new Tab(name, tab)
**Throws**:

- <code>TabException</code> Tab Exception for template or name errors.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the tab. |
| tab | <code>Object</code> |  |
| options.name | <code>String</code> | The name of the tab. |
| options.icon | <code>String</code> | The svg icon name. |
| [options.template] | <code>String</code> | The template string for the tab. |
| [options.templateUrl] | <code>String</code> | The template URL for the tab. |
| [options.link] | <code>function</code> | [$mdColorPickerConfig#Tab#link]($mdColorPickerConfig#Tab#link) function called after the tab is created and added to the md-tabs element. |

<a name="$mdColorPickerConfig+Tab+name"></a>

#### tab.name : <code>String</code>
The name of the tab.

**Kind**: instance property of <code>[Tab](#$mdColorPickerConfig+Tab)</code>  
<a name="$mdColorPickerConfig+Tab+icon"></a>

#### tab.icon : <code>String</code>
The svg icon name.

**Kind**: instance property of <code>[Tab](#$mdColorPickerConfig+Tab)</code>  
<a name="$mdColorPickerConfig+Tab+template"></a>

#### tab.template : <code>String</code>
The template string for the tab.

**Kind**: instance property of <code>[Tab](#$mdColorPickerConfig+Tab)</code>  
<a name="$mdColorPickerConfig+Tab+templateUrl"></a>

#### tab.templateUrl : <code>String</code>
The template URL for the tab.

**Kind**: instance property of <code>[Tab](#$mdColorPickerConfig+Tab)</code>  
<a name="$mdColorPickerConfig+Tab+$elemnt"></a>

#### tab.$elemnt : <code>$element</code>
The angular.element wrapped element of the tab once rendered.

**Kind**: instance property of <code>[Tab](#$mdColorPickerConfig+Tab)</code>  
<a name="$mdColorPickerConfig+notations"></a>

### $mdColorPickerConfig.notations : <code>Object</code>
Holds the available color notations methods.

**Kind**: instance property of <code>[$mdColorPickerConfig](#$mdColorPickerConfig)</code>  

* [.notations](#$mdColorPickerConfig+notations) : <code>Object</code>
    * [.order](#$mdColorPickerConfig+notations+order)
    * [.get(notation)](#$mdColorPickerConfig+notations+get) ⇒ <code>Object</code>
    * [.select(color)](#$mdColorPickerConfig+notations+select) ⇒ <code>String</code>
    * [.add(name, notation)](#$mdColorPickerConfig+notations+add)

<a name="$mdColorPickerConfig+notations+order"></a>

#### notations.order
Holds the order of the notaions to be displayed under the preview.

**Kind**: instance property of <code>[notations](#$mdColorPickerConfig+notations)</code>  
**Default**: <code>[ &#x27;hex&#x27;, &#x27;rgb&#x27;, &#x27;hsl&#x27; ]</code>  
<a name="$mdColorPickerConfig+notations+get"></a>

#### notations.get(notation) ⇒ <code>Object</code>
Rertieve a notation Object.

**Kind**: instance method of <code>[notations](#$mdColorPickerConfig+notations)</code>  
**Returns**: <code>Object</code> - Corresponding notation Object.  

| Param | Type | Description |
| --- | --- | --- |
| notation | <code>String</code> &#124; <code>Integer</code> | Notation identifier. |

<a name="$mdColorPickerConfig+notations+select"></a>

#### notations.select(color) ⇒ <code>String</code>
Selects the notation based on the color string.

**Kind**: instance method of <code>[notations](#$mdColorPickerConfig+notations)</code>  
**Returns**: <code>String</code> - String indentifier of the current notation.  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>String</code> | description. |

<a name="$mdColorPickerConfig+notations+add"></a>

#### notations.add(name, notation)
Adds a color notation to the available notations.

**Kind**: instance method of <code>[notations](#$mdColorPickerConfig+notations)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Identifier for the notation (hex, rgb, hsl, etc.). |
| notation | <code>function</code> | Function to parse the tinycolor.js color object and return a string. |

<a name="$mdColorPickerConfig+tabs"></a>

### $mdColorPickerConfig.tabs : <code>Object</code>
Holds the available tabs to be used.
Does not hold the order or display properties of the.
tabs in the window.

**Kind**: instance property of <code>[$mdColorPickerConfig](#$mdColorPickerConfig)</code>  

* [.tabs](#$mdColorPickerConfig+tabs) : <code>Object</code>
    * [.order](#$mdColorPickerConfig+tabs+order)
    * [.add(tab, [addToOrder])](#$mdColorPickerConfig+tabs+add)
    * [.get(tab)](#$mdColorPickerConfig+tabs+get) ⇒ <code>Tab</code>

<a name="$mdColorPickerConfig+tabs+order"></a>

#### tabs.order
Holds the order of the tabs, if a tab is not in this list, it will not be shown.

**Kind**: instance property of <code>[tabs](#$mdColorPickerConfig+tabs)</code>  
**Default**: <code>[ &#x27;spectrum&#x27;,]</code>  
<a name="$mdColorPickerConfig+tabs+add"></a>

#### tabs.add(tab, [addToOrder])
Adds a tab object to the avaiable tabs for the window.

**Kind**: instance method of <code>[tabs](#$mdColorPickerConfig+tabs)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tab | <code>Object</code> |  | [Tab](Tab) Options object or an instance of a [Tab](Tab). |
| [addToOrder] | <code>Number</code> &#124; <code>String</code> &#124; <code>Boolean</code> | <code>true</code> | Should the new tab be added to the order.  Can be an index, array function name (`push`,`unshift`, etc), or `true` to push it on the end of the order.  If index is greater than the length of the array, actual starting index will be set to the length of the array, if negative, will begin that many elements from the end. |

**Example** *( Adding the Spectrum Tab.)*  
```js
$mdColorPickerConfigProvider.tabs.add({
	name: 'spectrum',
	icon: 'gradient.svg',
	template: [
				'<div md-color-picker-spectrum></div>',
				'<div md-color-picker-hue ng-class="{\'md-color-picker-wide\': !mdColorAlphaChannel}"></div>',
				'<div md-color-picker-alpha class="md-color-picker-checkered-bg" ng-show="mdColorAlphaChannel"></div>'
			].join( '\n' )
});

// Same as above
var spectrumTab = new $mdColorPickerConfig.Tab({
	name: 'spectrum',
	icon: 'gradient.svg',
	template: [
				'<div md-color-picker-spectrum></div>',
				'<div md-color-picker-hue ng-class="{\'md-color-picker-wide\': !mdColorAlphaChannel}"></div>',
				'<div md-color-picker-alpha class="md-color-picker-checkered-bg" ng-show="mdColorAlphaChannel"></div>'
			].join( '\n' )
});

$mdColorPickerConfig.tabs.add( spectrumTab );
```
<a name="$mdColorPickerConfig+tabs+get"></a>

#### tabs.get(tab) ⇒ <code>Tab</code>
Returns the specified tab.

**Kind**: instance method of <code>[tabs](#$mdColorPickerConfig+tabs)</code>  
**Returns**: <code>Tab</code> - The tab object requested.  

| Param | Type | Description |
| --- | --- | --- |
| tab | <code>String</code> | The identifier of the tab. |

