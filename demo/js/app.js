var app = angular.module('plunker', ['ngMaterial', 'ngCookies', 'mdColorPicker']);

app.controller('MainCtrl', function($scope) {
    $scope.textConfig = {};
    $scope.textConfig.fonts = [
        'Arial',
        'Arial Black',
        'Comic Sans MS',
        'Courier New',
        'Georgia',
        'Impact',
        'Times New Roman',
        'Trebuchet MS',
        'Verdana'
    ];

    $scope.textConfig.font;
    $scope.textConfig.textColor;
    $scope.textConfig.textBackground;

    $scope.textConfig.backgroundOptions = {
        label: "Text Background",
        icon: "font_download",

        hasBackdrop: true, // Whether there should be an opaque backdrop behind the dialog. Default true.
        clickOutsideToClose: true, // Whether the user can click outside the dialog to close it. Default false.
        random: true,
        openOnInput: true,

        alphaChannel: false,
        history: false,
        defaultTab: 1,

        multiple: true // An option to allow this dialog to display over one that's currently open.
    };
    $scope.textConfig.showPreview = true;

});