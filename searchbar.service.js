//fme.service.js
angular.module('app')

// ============== TRACE SERVICE ====================
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
      	var responseGeomFields = [
      		// 'centroide_ll', //This one is currently 'bugged, is returned in an array'
      		'centroide_rd',
      		'geometrie_ll',
      		'geometrie_rd'
      	]

      	var result = result.data
   		
      	//Replace all WKT geom with geojson geom
      	for (r in result.response.docs) {
      		for (responseGeom in responseGeomFields) {
      			result.response.docs[r][responseGeomFields[responseGeom]] = Terraformer.WKT.parse(result.response.docs[r][responseGeomFields[responseGeom]])
      		}
      	}

      	//Only ever get the first result found, as search is done based on ID
      	feature = result.response.docs[0]
      	feature.type = 'Feature'
      	feature.geometry = feature.geometrie_ll
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
