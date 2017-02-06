var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;
var baseUrl = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);

angular.module('searchbar', [])

.component('searchbar', {
	bindings: {
		resultLimit: '<'
	},
	templateUrl: baseUrl + 'searchbar.view.html',
	controller: function ($state, $scope, $element, $sce, GeolocateService) {
		$scope.query = '';

		// ===================== SEARCH FUNCTIONALITY =====================

		this.$onInit = function () {
			if (!this.resultLimit) {
				$scope.resultLimit = 10;
			} else {
				$scope.resultLimit = this.resultLimit;
			}
		};

		$scope.incrementLimit = function() {
			$scope.resultLimit += 5;
		}

		//Autocomplete watch functions
		$scope.$watch('query', function (query){
			if (query.length > 3 && !$scope.selectedLocation) {
				$scope.getResults(query);
			} else {
				$scope.results = [];
				$scope.showSuggestions = false;
				$scope.selectedLocation = false;
			}
		})

		$scope.getResults = function (query) {
			GeolocateService.suggest({
				q: query
			}).then(function(response){
				if (response.response.docs.length > 0) {
					$scope.results = response.response.docs;
					$scope.highlights = response.highlighting;
				} else {
					$scope.showSuggestions = true;
					$scope.suggestions = response.spellcheck.suggestions;
		    }
			});
		};

		$scope.getSuggestion = function(suggestion) {
			$scope.query = suggestion
		};

		$scope.lookupResult = function(id) {
			GeolocateService.lookup({
				id: id
			}).then(function(result){
				$scope.query = result.weergavenaam;
				$scope.selectedLocation = true;
				$scope.results = [];
				$scope.$emit('newLocation', result);
			});
		};

		$scope.clearResults = function() {
			$scope.query = '';
			$scope.results = [];
		};

		$scope.getHTML = function(id) {
			return $sce.trustAsHtml($scope.highlights[id].suggest[0]);
		};

		// ========================= TEMPLATE SPECIFIC CSS ==========================

		var searchElement = angular.element(document.getElementById('search-button'));
		searchElement.css('background', 'url(' + baseUrl + 'img/search.png) 0 4px no-repeat #fff');
		searchElement.on('mouseenter',function() {
        searchElement.css('background', 'url(' + baseUrl + 'img/search.png) -24px 4px no-repeat');
    })
    .on('mouseleave',function() {
        searchElement.css('background', 'url(' + baseUrl + 'img/search.png) 0 4px no-repeat #fff');
    });

		var clearElement = angular.element(document.getElementById('clear-button'));
		clearElement.css('background', 'url(' + baseUrl + 'img/clear.png) 0 4px no-repeat #fff');
		clearElement.on('mouseenter',function() {
				clearElement.css('background', 'url(' + baseUrl + 'img/clear.png) -24px 4px no-repeat');
		})
		.on('mouseleave',function() {
				clearElement.css('background', 'url(' + baseUrl + 'img/clear.png) 0 4px no-repeat #fff');
		});


	}
})
