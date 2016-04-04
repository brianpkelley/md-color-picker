var app = angular.module('plunker', ['ngMaterial','ngCookies', 'mdColorPicker']);

app.controller('MainCtrl', function($scope) {
  $scope.fonts = [
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

	$scope.font;
	$scope.textColor;
	$scope.textBackground;

    $scope.backgroundOptions = {
        label: "Text Background",
        icon: "font_download",

        hasBackdrop: true,
        clickOutsideToClose: true,
        random: true,
        openOnInput: true,

        alphaChannel: false,
        history: false,
        defaultTab: 1
    }

});
