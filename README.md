# Geogap PDOK Geocoder

De Geogap PDOK Geocoder is een AngularJS component die bruikbaar is in elk Angular 1.5+ project. Het component werkt op basis van de nieuwe [PDOK Locatieserver API](https://www.google.com). 

## In Developement
De Geogap PDOK Geocoder is een work in progress en bevind zich nog in het ontwikkelingsstadium. 

## Installatie
Installatie kan via de [Bower Package Manager](https://bower.io/): bower install geogap-pdok-geocoder.
Voeg daarna het bijbehorende script en css toe aan de index.html.

```html
<script src="bower_components/geogap-pdok-geocoder/dist/geogap-pdok-geocoder.js></script>
```

De Geogap PDOK Geocoder maakt gebruik van [Terraformer](http://terraformer.io/) om de resultaten van de Locatieserver om te zetten van WKT naar GeoJSON. Indien deze niet al in het project aanwezig zijn moeten deze tevens aan de index.html toegevoegd worden.

```html
<script src="bower_components/terraformer/terraformer.js"></script>
<script src="bower_components/terraformer-wkt-parser/terraformer-wkt-parser.js"></script>
```

## Gebruik
Voeg de Geogap PDOK Geocoder toe als dependcy aan de app: 

```javascript
var app = angular.module('demoapp', ['geogap.pdokgeocoder']);
```

De geocoder kan nu als component teogevoegd worden aan de Angular HTML door deze als element aan te maken:

```html
<searchbar></searchbar>
```

## Attributes
De geocoder kent een aantal attributen die het mogelijk maken om een instellingen mee te geven.

### Coordinate Reference System (default WGS)
De PDOK Locatieserver ondersteund zowel rijksdriehoeksstelsel (rd) als wgs84 (ll) als coordinaat systemen. Door het attribuut `crs` mee te geven aan het element kan gespecificeerd worden welk coordinaat systeem gebruikt moet worden. De mogelijke parameters zijn 

* ll (voor wgs84)
* rd (voor rijksdriehoeksstelsel)

#### Voorbeeld
```html
<searchbar crs="ll"></searchbar>
```

Standaard wordt gebruik gemaakt van wgs84. 

### Result Limit (default 10)
Het is mogelijk om aan te geven hoeveel resultaten er maximaal weergegeven worden bij de aanvankelijk zoekopdracht. Door het attribuut `result-limit` meet te geven aan het element kan worden gespecificeerd wat de limiet is. Op kleinere schermen kan dit echter een te grote lijst op leveren. Wanneer de limiet op de resultaten lager is dan het aantal resultaten verschijnt er een *Show More* optie in de vorm van drie punten (**...**).

#### Voorbeeld
```html
<searchbar result-limit="5"></searchbar>
```

 Standaard staat de limiet op 10 resultaten.
