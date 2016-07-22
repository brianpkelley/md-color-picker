

<!-- Start src/js/mdColorPickerConfig.js -->

Tab options object.

### Properties:

* **String** *name* The name of the tab.
* **String** *icon* The svg icon name.
* **String** *(template)* The template string for the tab.
* **String** *(templateUrl)* The template URL for the tab.
* **Function** *(link)* Link function called after the tab is created and added to the md-tabs element.

## Tab

Tab - Base for all mdColorPicker Tabs.

### Params:

* **String** *name* Name of the tab.
* **TabObject** *options* {@link TabObject}

## link($scope, $element)

Tab.prototype.link - Link function called after the tab is created and added to the md-tabs element.

### Params:

* **type** *$scope* Current $scope of the mdColorPicker
* **type** *$element* The content element of the `<md-tab>`

## setPaletteColor(event, $scope)

Tab.prototype.setPaletteColor - Upadates $scope.data.color and calls $scope.$apply to refresh everything.

### Params:

* **Event** *event* Mouse event to find the target element.
* **Scope** *$scope* Current mdColorPicker scope to update the color value.

## getTemplate()

Tab.prototype.getTemplate - Returns the associated template for the tab.

### Return:

* **String** The template string.

## $mdColorPickerConfig

## $mdColorPickerConfig.notations

Holds the available color notations methods.
Does not hold the order or display properties of the.
color notation tabs in the window.

## get(notation)

get - Rertieve a notation Object.

### Params:

* **String|Integer** *notation* Notation identifier.

### Return:

* **Object** Corresponding notation Object.

## select(color)

select - Selects the notation based on the color string.

### Params:

* **String** *color* description.

### Return:

* **String** String indentifier of the current notation.

## add(name, notation)

add - Adds a color notation to the available notations.

### Params:

* **string** *name* Identifier for the notation (hex, rgb, hsl, etc.).
* **Function** *notation* Function to parse the tinycolor.js color object and return a string.

## order

Holds the order of the notaions to be displayed under the preview.

## $mdColorPickerConfig.notation

## toString(color)

toString - Converts tinycolor.js Object to the notations string equivalent.

### Params:

* **tinycolor** *color* Tinycolor.js color Object.

### Return:

* **String** String notation of the color.

## test(color)

test - Check if a color string is in the notations format.

### Params:

* **String** *color* Color String.

### Return:

* **Boolean** True if string in in the notations format, False if it is not.

## disabled(color)

disabled - Check if the notation should be disabled.

### Params:

* **tinycolor** *color* description

### Return:

* **Boolean** True if disabled, False if enabled.

## mdColorPickerConfig.tabs.

Holds the available tabs to be used.
Does not hold the order or display properties of the.
tabs in the window.

## add(name, tab)

add - Adds a tab object to the avaiable tabs for the window.

### Params:

* **String** *name* Adds the new tab with the identifier specified.
* **Object** *tab* Tab object.

### Return:

* No Return value.

## get(tab)

get - Returns the specified tab.

### Params:

* **String** *tab* The identifier of the tab.

### Return:

* **Object** The tab object requested.

## order

Holds the order of the tabs, if a tab is not in this list, it will not be shown.

## useCookies

Selects the

## $get

return the config Object.

<!-- End src/js/mdColorPickerConfig.js -->

