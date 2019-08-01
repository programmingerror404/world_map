am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.exclude = ["AQ"];

// Make map load polygon data from GeoJSON

polygonSeries.useGeodata = true;

setTimeout(function () {
    for (let i = 0; i < polygonSeries.data.length; i++) {
        let response =
            fetch('https://restcountries.eu/rest/v2/alpha/' + polygonSeries.data[i].id + '?fields=name;capital;area;population')
                .then((resp) => resp.json())
                .then(function (data) {
                    polygonSeries.data[i]['area'] = data.area;
                    polygonSeries.data[i]['population'] = data.population;
                })
    }
}, 0);


var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipHTML = "<strong>Country - </strong>{name} <br/> <strong>Area - </strong>{area} sq km <br/> <strong>Population - </strong>{population}";
polygonTemplate.fill = am4core.color("#74B266");
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("#367B25");

polygonTemplate.events.on("hit", function (ev) {
    chart.closeAllPopups();
    var popup = chart.openPopup("<strong>Country - </strong>" + ev.target.dataItem.dataContext.name + " <br/> <strong>Area - </strong>" + ev.target.dataItem.dataContext.area + " sq km <br/> <strong>Population - </strong>" + ev.target.dataItem.dataContext.population);
    popup.right = 0;
    popup.top = 0;
});