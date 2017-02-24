var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;
var baseUrl, componentUrl;

for (var i = 0; i < scripts.length; i++) {
	var charIndex = scripts[i].src.indexOf('geogap-pdok-geocoder')
	if (charIndex > 0) {
		baseUrl = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);
		componentUrl = currentScriptPath.substring(0, charIndex);
	}
}

angular.module('geogap.pdokgeocoder', [])

.component('searchbar', {
	bindings: {
		resultLimit: '<'
	},
	templateUrl: baseUrl + 'template/searchbar.template.html',
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

		$scope.lookupResult = function(data) {
			$scope.query = data.weergavenaam;
			$scope.selectedLocation = true;
			$scope.results = [];

			GeolocateService.lookup({
				id: data.id
			}).then(function(result) {
				$scope.$emit('newLocation', result, data.type);
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

.factory('GeolocateService', function($http) {
  var suggestUrl = 'http://geodata.nationaalgeoregister.nl/locatieserver/suggest?'
  var lookupUrl  = 'http://geodata.nationaalgeoregister.nl/locatieserver/lookup?'
  var freeUrl  	 = 'http://geodata.nationaalgeoregister.nl/locatieserver/free?'


  this.suggest = function (params) {
     return $http
    .get(suggestUrl, {params:params})
    .then(function(response) {
      return response.data;
    })
  }

  this.lookup = function (params) {
     return $http
    .get(lookupUrl, {params:params})
    .then(function(result) {
    	var result = result.data.response.docs[0];

    	feature = result
    	feature.type = 'Feature'
    	feature.geometry = Terraformer.WKT.parse(result.centroide_ll)
      return feature;
    })
  }

  this.free = function (params) {
	   return $http
    .get(freeUrl, {params:params})
    .then(function(response) {
      return response.data;
    })
  }

  return this

});
