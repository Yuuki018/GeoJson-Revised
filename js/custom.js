var start = moment().subtract(29, 'days');
var end = moment();

function cb(start, end) {
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    startDate = start.format('YYYY-MM-DD');
    endDate = end.format('YYYY-MM-DD');    
}

$('#reportrange').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
       'Today': [moment(), moment()],
       'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
       'Last 7 Days': [moment().subtract(6, 'days'), moment()],
       'Last 30 Days': [moment().subtract(29, 'days'), moment()],
       'This Month': [moment().startOf('month'), moment().endOf('month')],
       'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
}, cb);
cb(start, end);
$('.applyBtn').click(function(e){

    var filter = $('.ranges li.active').data('range-key');

    switch(filter) {
        case 'Today':
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
            break;
        case 'Yesterday':
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
            break;
        case 'Last 7 Days':
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
            break;
        case 'Last 30 Days':
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
            break; 
        case 'This Month':
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
            break; 
        case 'Last Month':
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
            break;   
        case 'Custom Range':
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
            break;                
        default:
            var quakeFeeds = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime="+startDate+"%2000:00:00&endtime="+endDate+"%2023:59:59&maxlatitude=20.138&minlatitude=4.757&maxlongitude=130.781&minlongitude=115.664&minmagnitude=2.5&eventtype=earthquake&orderby=time";
    }
    
    var source = map.getSource('earthquakes');
    $.ajax({
        url: quakeFeeds,
        complete: function(data) {
            source.setData(data.responseJSON);
            console.log(data.responseJSON);
        }
    });
});
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoiY2l1dTUzcmgxMDJ0djJ0b2VhY2sxNXBiMyJ9.25Qs4HNEkHubd4_Awbd8Og';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v8',
    center: [120.984222, 14.599512],
    zoom: 5,
});
var usgsEarthquakes = $.ajax({
    url: "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
}).done(function(data){
    map.on('load', function(){
        // Add a new source from our GeoJSON data and set the
        // 'cluster' option to true.
        map.addSource("earthquakes", {
            type: "geojson",
            data: data,
            cluster: true,
            clusterMaxZoom: 14, // 14 Max zoom to cluster points on
            clusterRadius: 10 // 50 Radius of each cluster when clustering points (defaults to 50)
        });
        // Use the earthquakes source to create five layers:
        // One for non-clustered markers, three for each cluster category,
        // and one for cluster labels.
        map.addLayer({
            "id": "non-cluster-markers",
            "type": "circle",
            "source": "earthquakes",
            "paint": {
                "circle-radius": 17,
                "circle-color": "#000",
                "circle-opacity": 0.7,
                "circle-blur": 0.2
            }
        });
        map.addLayer({
            "id": "non-cluster-label",
            "type": "symbol",
            "source": "earthquakes",
            "layout": {
                "text-field": "{mag}",
                "text-font": [
                        "DIN Offc Pro Medium",
                        "Arial Unicode MS Bold"
                    ],
                "text-size": 12
            },
            "paint": {
                "text-color": "#eee"
            }
        });
        // Display the earthquake data in three layers, each filtered to a range of
        // count values. Each range gets a different fill color.
        var layers = [
            [100, '#f28cb1'],
            [20, '#f1f075'],
            [0, '#51bbd6']
        ];
        layers.forEach(function (layer, i) {
            map.addLayer({
                "id": "cluster-" + i,
                "type": "circle",
                "source": "earthquakes",
                "paint": {
                    "circle-color": layer[1],
                    "circle-radius": 18
                },
                "filter": i == 0 ?
                    [">=", "point_count", layer[0]] :
                    ["all",
                        [">=", "point_count", layer[0]],
                        ["<", "point_count", layers[i - 1][0]]]
            });
        });
        // Add a layer for the clusters' count labels
        map.addLayer({
            "id": "cluster-count",
            "type": "symbol",
            "source": "earthquakes",
            "layout": {
                "text-field": "{point_count}",
                "text-font": [
                        "DIN Offc Pro Medium",
                        "Arial Unicode MS Bold"
                    ],
                "text-size": 12
            }
        });
        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['non-cluster-markers'] });
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });
        map.on('click', function (e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['non-cluster-markers'] });
            if (!features.length) {
                return;
            }
            var feature = features[0];
            // Populate the popup and set its coordinates
            // based on the feature found.
            var popupContent = "<div class='eq_event'><h3>" + feature.properties.title + "</h3>"
                                +"<ul class='eq_details'>"
                                +"<li><span>Code: </span>"+feature.properties.code+"</li>"
                                +"<li><span>Type: </span>"+feature.properties.type+"</li>"
                                +"<li><span>Magnitude: </span>"+feature.properties.mag+"</li>"
                                +"<li><span>Place: </span>"+feature.properties.place+"</li>"
                                +"</ul>"
                                +"<h3>Sources:</h3>"
                                +"<ul class='eq_details'>"
                                +"<li><span>Url: </span><a href="+feature.properties.url+">"+feature.properties.url+"</a></li>"
                                +"<li><span>Details: </span><a href="+feature.properties.detail+">"+feature.properties.detail+"</a></li>"
                                +"</ul></div>";
            var popup = new mapboxgl.Popup()
                .setLngLat(feature.geometry.coordinates)
                .setHTML(popupContent)
                .addTo(map);
        });
    });
});