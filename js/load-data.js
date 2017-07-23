// date range function starts here

var start   = moment().subtract(29, 'days');
var end     = moment();

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
    },
    autoclose: false
}, cb);

// this prevents the dropdown to close even before you clicked "Apply" button
var listItem,applyClicked = false;

$('#reportrange').on('apply.daterangepicker', function(ev, picker) {
    console.log(listItem +" : "+ applyClicked);
    if(listItem!="Custom Range" && !applyClicked){
        picker.show();
        applyClicked=false;
    }
});
cb(start, end);

$(".ranges ul li").click(function() {
    listItem = $(this).text();
    applyClicked=false;
});

// Filtering data
$(".range_inputs").click(function() {
    applyClicked=true;
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

    // this loads the data 
    var source  = map.getSource('earthquakes');
    $.ajax({
        url: quakeFeeds,
        complete: function(data) {
            source.setData(data.responseJSON);
            // check if returns data
            console.log(data.responseJSON);
        }
    });
    

});