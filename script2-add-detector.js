
var clickedPolyline = null;
var updatedPolyline = null;


var startMarker = null;
var endMarker = null;

var array_of_lines = [];    // array of lines   
var lineGroup = L.featureGroup().addTo(map);

var edge_detect_lineGroup = L.featureGroup().addTo(map);
var designLineGroup = L.featureGroup().addTo(map);

var drawingEnabled = false;
//  ==============
var selected_latitude = null
var selected_longitude = null;

var temp_latitude = null
var temp_longitude = null;
var customIcon = L.icon({
  iconUrl: './icon25/square.png',
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -16], // point from which the popup should open relative to the iconAnchor
});
var clickEnabled = true; // Flag to control the click behavior



var marker = null;
var polylineMain = null;

var endLatInput = document.getElementById('endLatInput');
var endLngInput = document.getElementById('endLngInput');
var distanceInput = document.getElementById('distanceInput');
var bearingInput = document.getElementById('bearingInput');
var mapContainer = document.getElementById('map');
var displayText = document.getElementById('product-details');
// console.log(displayText)


map.on('click', onMapClick);

function onMapClick(e) {
  if (drawingEnabled) {
    if (!startMarker) {
      // console.log("inside startMarker adding---------------------------------------------------------")
      // startMarker = L.marker(e.latlng).addTo(map);
      startMarker = e.latlng;



      // console.log(e.latlng);

    } else if (!endMarker) {
      // console.log("inside endmarker adding++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

      // endMarker = L.marker(e.latlng).addTo(map);
      endMarker = e.latlng;
      // console.log(e.latlng);

      var line = L.polyline([startMarker, endMarker]).addTo(lineGroup);
      var start = [startMarker.lat, startMarker.lng];
      var end = [endMarker.lat, endMarker.lng];
      drawPolyline(start, end, designLineGroup)
      startMarker = null;
      endMarker = null;
      edge_detect_lineGroup.clearLayers();

      // console.log(line);
      array_of_lines.push(line);

      // line.on('click', function() {
      //     var coordinates = line.getLatLngs();
      //     var distance = startMarker.getLatLng().distanceTo(endMarker.getLatLng()).toFixed(2);
      //     alert("Line Specifications:\n\nStart Point: " + coordinates[0] + "\nEnd Point: " + coordinates[1] + "\nDistance: " + distance + " meters");
      // });

      lineGroup.on('click', function (event) {

        clickEnabled = true;
        // console.log("-------" + displayText.style.display)

        if (displayText) {
          displayText.style.display = "block";
        }
        clickedPolyline = event.layer;
        var foundPolyline = null;

        // Find the clicked polyline from the array_of_lines array
        for (var i = 0; i < array_of_lines.length; i++) {
          if (array_of_lines[i] === clickedPolyline) {
            foundPolyline = array_of_lines[i];
            break;
          }
        }

        // Perform actions with the foundPolyline
        if (foundPolyline) {
          var coordinates = foundPolyline.getLatLngs();
          var distance = coordinates[0].distanceTo(coordinates[1]).toFixed(2); 
          // console.log(distance);
          var bearing = calculateBearing(coordinates[0], coordinates[1]).toFixed(2);

          startLatInput.value = coordinates[0].lat;
          startLngInput.value = coordinates[0].lat;
          endLatInput.value = coordinates[1].lat;
          endLngInput.value = coordinates[1].lat;
          distanceInput.value = distance;
          bearingInput.value = bearing;


          // =================  for edge detection =============================
          foundPolyline.on('mousemove', function (event) {
            if (clickEnabled) {



            // if (clickEnabled) {

            var cursorLatLng = event.latlng;
            var startLatLng = foundPolyline.getLatLngs()[0];
            var endLatLng = foundPolyline.getLatLngs()[foundPolyline.getLatLngs().length - 1];

            // console.log("start " + startLatLng);
            // console.log("end " + endLatLng);


            var distanceToStart = cursorLatLng.distanceTo(startLatLng);
            var distanceToEnd = cursorLatLng.distanceTo(endLatLng);


            var tolerance = 10; // Adjust the tolerance as needed


            // ------------------------------   one    -----------------------------
            if (distanceToStart <= tolerance) {
              console.log('Cursor is near the start point');

              temp_latitude = startLatLng.lat;
              temp_longitude = startLatLng.lng;

              if (marker) {

                if (drawingEnabled == false) {
                  drawingEnabled = true;
                  mapContainer.style.cursor = 'crosshair';
                  // console.log("isDrawing open");
                  toggleButtonColor()
                }

                edge_detect_lineGroup.removeLayer(marker);
                marker = L.marker([temp_latitude, temp_longitude], { icon: customIcon })
                marker.on('click', function (event) {
                  // console.log("inside marker click")

                  selected_latitude = temp_latitude;
                  selected_longitude = temp_longitude;


                  startMarker = L.latLng(selected_latitude, selected_longitude);

                  console.log("setted lat lng")

                  // if (polylineMain) {
                  //   console.log("polylineMain true")
                  //   polylineMain.remove();

                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);



                  // } else {
                  //   console.log("polylineMain false")

                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);

                  // }

                })
                marker.addTo(edge_detect_lineGroup);

              } else {
                selected_latitude = temp_latitude;
                selected_longitude = temp_longitude;

                marker = L.marker([temp_latitude, temp_longitude], { icon: customIcon })
                marker.on('click', function (event) {
                  // console.log("inside marker click")

                  selected_latitude = temp_latitude;
                  selected_longitude = temp_longitude;


                  startMarker = L.latLng(selected_latitude, selected_longitude);

                  // detected_status.innerHTML = selected_latitude+' - '+selected_longitude;

                  // console.log("setted lat lng")
                  // if (polylineMain) {
                  //   polylineMain.remove();

                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);



                  // } else {
                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);

                  // }


                })
                marker.addTo(edge_detect_lineGroup);


              }
              // detected_status.innerHTML = selected_latitude + ' - ' + selected_longitude;

              // console.log(selected_latitude+"startLatLng------------------------+"+selected_longitude)
              // if (selected_latitude) {
              //   if (polylineMain) {
              //     polylineMain.remove();

              //     polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);



              //   } else {
              //     polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);

              //   }
              // }
            }

            //   console.log(polylineMain + "polylineMain*********************");


            // Add your code here
            // }
            // ------------------------------   two    -----------------------------

            if (distanceToEnd <= tolerance) {
              // console.log('Cursor is near the end point');

              temp_latitude = endLatLng.lat;
              temp_longitude = endLatLng.lng;

              if (marker) {

                if (drawingEnabled == false) {
                  drawingEnabled = true;
                  mapContainer.style.cursor = 'crosshair';
                  // console.log("isDrawing open");
                  toggleButtonColor()
                }


                edge_detect_lineGroup.removeLayer(marker);
                marker = L.marker([temp_latitude, temp_longitude], { icon: customIcon })
                marker.on('click', function (event) {
                  console.log("inside marker click")

                  selected_latitude = temp_latitude;
                  selected_longitude = temp_longitude;

                  startMarker = L.latLng(selected_latitude, selected_longitude);

                  // console.log("setted lat lng")

                  // if (polylineMain) {
                  //   console.log("polylineMain true")
                  //   polylineMain.remove();

                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);



                  // } else {
                  //   console.log("polylineMain false")

                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);

                  // }

                })
                marker.addTo(edge_detect_lineGroup);

              } else {
                selected_latitude = temp_latitude;
                selected_longitude = temp_longitude;

                marker = L.marker([temp_latitude, temp_longitude], { icon: customIcon })
                marker.on('click', function (event) {
                  // console.log("inside marker click")

                  selected_latitude = temp_latitude;
                  selected_longitude = temp_longitude;
                  // detected_status.innerHTML = selected_latitude+' - '+selected_longitude;
                  startMarker = L.latLng(selected_latitude, selected_longitude);

                  // console.log("setted lat lng")
                  // if (polylineMain) {
                  //   polylineMain.remove();

                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);



                  // } else {
                  //   polylineMain = L.polyline([[selected_latitude, selected_longitude]], { color: 'blue' }).addTo(map);

                  // }


                })
                marker.addTo(edge_detect_lineGroup);


              }
              // if (polylineMain) {
              //   polylineMain.remove();

              //   polylineMain = L.polyline([[temp_latitude, temp_longitude]], { color: 'blue' }).addTo(map);


              // } else {
              //   polylineMain = L.polyline([[temp_latitude, temp_longitude]], { color: 'blue' }).addTo(map);


              // }

              // Add your code here
            }
          }

          });


          // document.getElementById("")
          // alert("Line Specifications:\n\nDistance: " + distance + " meters\nBearing: " + bearing + " degrees");
        }
      });
      toggleButtonColor()
      disableDrawing();
      clickEnabled = false
    } else {
      // startMarker.remove();
      // endMarker.remove();
      startMarker = e.latlng;
      endMarker = null;
    }
  }
}

function enableDrawing() {
  drawingEnabled = true;
  mapContainer.style.cursor = 'crosshair';

}

function disableDrawing() {
  drawingEnabled = false;
  mapContainer.style.cursor = 'default';

}



// ========================   timeline button operatio =======================
var drawLineButton = document.getElementById('drawLineButton');


drawLineButton.addEventListener('click', function () {
  // console.log("drawLineButton");
  if (drawingEnabled == false) {
    drawingEnabled = true;
    mapContainer.style.cursor = 'crosshair';
    // console.log("isDrawing open");
  } else {
    drawingEnabled = false;
    mapContainer.style.cursor = 'default';
    // console.log("isDrawing closed");
  }
});


// =======================   delete line button =======================    
var closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', deleteCurrentLine);

function deleteCurrentLine() {
  if (clickedPolyline) {
    // Remove the clickedPolyline from the map and lineGroup
    lineGroup.removeLayer(clickedPolyline);

    // Remove the clickedPolyline from the array_of_lines
    var index = array_of_lines.indexOf(clickedPolyline);
    if (index !== -1) {
      array_of_lines.splice(index, 1);
    }

    // Reset the input fields
    startLatInput.value = "";
    startLngInput.value = "";
    endLatInput.value = "";
    endLngInput.value = "";
    distanceInput.value = "";
    bearingInput.value = "";

    // Reset the markers
    startMarker = null;
    endMarker = null;

    // Clear the clickedPolyline variable
    clickedPolyline = null;



    //   --
    redrawLines();
  }



}

// =======================   print line button =======================    

// var printButton = document.getElementById('printButton'); 
// printButton.addEventListener('click', printp);
// function printp() {
//   console.log(array_of_lines)
// }




// =======================   delete all  button =======================    

var deleteButton = document.getElementById('deleteButton');
deleteButton.addEventListener('click', deleteButtonopt);
function deleteButtonopt() {
  array_of_lines = [];
  lineGroup.clearLayers();
  designLineGroup.clearLayers();


}

// =======================   print  button =======================    

// var printControl = L.control.print({
//   position: 'topright',
//   title: 'Print Map',
//   sizeModes: ['Current', 'A4Portrait', 'A4Landscape']
// }).addTo(map);

// var printer = L.easyPrint({
//   tileLayer: tiles,
//   sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
//   filename: 'myMap',
//   exportOnly: true,
//   hideControlContainer: true
// }).addTo(map);

// var printButton = document.getElementById('printButton');


//         printButton.addEventListener('click',manualPrint);




// 		function manualPrint () {
// 			printer.printMap('CurrentSize', 'MyManualPrint')
// 		}


L.control.browserPrint({ position: 'topleft', title: 'Print ...' }).addTo(map);


// ============================= redrawLines =============================
function redrawLines() {


  // var line = L.polyline([startMarker, endMarker]).addTo(lineGroup);
  // var start = [startMarker.lat, startMarker.lng];
  // var end = [endMarker.lat, endMarker.lng];
  // drawPolyline(start, end, lineGroup)
  // console.log("in re  drawlines ---------------------- ")
  // console.log(array_of_lines[i])
  // lineGroup.clearLayers();
  designLineGroup.clearLayers();


  for (var i = 0; i < array_of_lines.length; i++) {
    var polyline = array_of_lines[i];
    // var line = L.polyline(polyline.getLatLngs()).addTo(lineGroup);

    var coordinates = polyline.getLatLngs();

    var start = [coordinates[0].lat, coordinates[0].lng];
    var end = [coordinates[1].lat, coordinates[1].lng];
    drawPolyline(start, end, designLineGroup);
  }


  // lineGroup.on('click', function (event) {
  //   console.log("-------"+ displayText.style.display)

  //   if (displayText) {
  //     displayText.style.display = "block";
  //   }
  //           clickedPolyline = event.layer;

  //           var foundPolyline = null;

  //           // Find the clicked polyline from the array_of_lines array
  //           for (var i = 0; i < array_of_lines.length; i++) {
  //             if (array_of_lines[i] === clickedPolyline) {
  //               foundPolyline = array_of_lines[i];
  //               break;
  //             }
  //           }
  //           console.log("found line in clic"+foundPolyline)

  //           // Perform actions with the foundPolyline
  //           if (foundPolyline) {
  //             var coordinates = foundPolyline.getLatLngs();
  //             var distance = coordinates[0].distanceTo(coordinates[1]).toFixed(2); console.log(distance);
  //             var bearing = calculateBearing(coordinates[0], coordinates[1]).toFixed(2);

  //             startLatInput.value = coordinates[0].lat;
  //             startLngInput.value = coordinates[0].lat;
  //             endLatInput.value = coordinates[1].lat;
  //             endLngInput.value = coordinates[1].lat;
  //             distanceInput.value = distance;
  //             bearingInput.value = bearing;



  //             // document.getElementById("")
  //             // alert("Line Specifications:\n\nDistance: " + distance + " meters\nBearing: " + bearing + " degrees");
  //           }
  //         });

  // console.log("  ------- xxxxxxx--------------- ")

}

// }


// =========================== calculate bearing ===========================
function changeBearing(input) {
  var newBearing = input.value;

  var coordinates = clickedPolyline.getLatLngs();

  var distance = coordinates[0].distanceTo(coordinates[1]).toFixed(2); console.log(distance);
  // var bearing = calculateBearing(coordinates[0], coordinates[1]).toFixed(2);
  var newEndPoint = calculateDestinationPoint(coordinates[0], distance, newBearing);

  for (var i = 0; i < array_of_lines.length; i++) {
    if (array_of_lines[i] === clickedPolyline) {
      // foundPolyline = a
      // array_of_lines[i] = newEndPoint;
      // Get the array of LatLng points from the polyline
      // console.log(array_of_lines[i] + "++++++++++++++++++")

      var latLngs = array_of_lines[i].getLatLngs();

      // Get the last point from the array
      var lastPoint = latLngs[latLngs.length - 1];

      // Set new values to the last point
      lastPoint.lat = newEndPoint.lat;
      lastPoint.lng = newEndPoint.lng;

      // Update the polyline with the modified LatLng array
      array_of_lines[i].setLatLngs(latLngs);
      break;
    }
  }
  // console.log(newEndPoint);
  redrawLines();
  // printp();
  // console.log("**************************")

}


// =========================== change latitude start =========================== 28.703283
function change_latitude_start(change_lat) {
  console.log("in change latitude start")
  var change_lat = change_lat.value;

  for (var i = 0; i < array_of_lines.length; i++) {
    if (array_of_lines[i] === clickedPolyline) {
      // console.log(array_of_lines[i] + "++++++++++change_lat++++++++")
      var latLngs = array_of_lines[i].getLatLngs();
      latLngs[0].lat = change_lat;
      array_of_lines[i].setLatLngs(latLngs);
      // console.log(array_of_lines[i]);

      break;
    }
  }
  // console.log("redrawLines");
  redrawLines();
  // printp();
  // console.log("**************************")

}
// =========================== change longitude start =========================== 28.703389, 77.102025
function change_longitude_start(change_lng) {
  console.log("in change longitude start")
  var change_lng = change_lng.value;


  for (var i = 0; i < array_of_lines.length; i++) {
    if (array_of_lines[i] === clickedPolyline) {
      // console.log(array_of_lines[i] + "++++++++++change_lat++++++++")
      var latLngs = array_of_lines[i].getLatLngs();
      latLngs[0].lng = change_lng;
      array_of_lines[i].setLatLngs(latLngs);
      // console.log(array_of_lines[i]);

      break;
    }
  }
  // console.log("redrawLines");
  redrawLines();
  // printp();
  console.log("**************************")

}



// =========================== change latitude end =========================== 28.703283
function change_latitude_end(change_lat) {
  console.log("in change latitude end")
  var change_lat = change_lat.value;

  for (var i = 0; i < array_of_lines.length; i++) {
    if (array_of_lines[i] === clickedPolyline) {
      console.log(array_of_lines[i] + "++++++++++change_lat++++++++")
      var latLngs = array_of_lines[i].getLatLngs();
      latLngs[latLngs.length - 1].lat = change_lat;
      array_of_lines[i].setLatLngs(latLngs);
      console.log(array_of_lines[i]);

      break;
    }
  }
  console.log("redrawLines");
  redrawLines();
  // printp();
  console.log("**************************")

}
// =========================== change longitude end =========================== 28.703389, 77.102025
function change_longitude_end(change_lng) {
  console.log("in change longitude end")
  var change_lng = change_lng.value;
  for (var i = 0; i < array_of_lines.length; i++) {
    if (array_of_lines[i] === clickedPolyline) {
      console.log(array_of_lines[i] + "++++++++++change_lat++++++++")
      var latLngs = array_of_lines[i].getLatLngs();

      latLngs[latLngs.length - 1].lng = change_lng;
      array_of_lines[i].setLatLngs(latLngs);
      console.log(array_of_lines[i]);

      break;
    }
  }
  console.log("redrawLines");
  redrawLines();
  console.log("**************************")

}

function drawPolyline(start, end, layer) {
  // start : start point [lat, lng]
  // end : end point [lat, lng]
  var marker_lines = [
    { distance: 3, height: 150, color: "red", start_after: 0.003 },
    { distance: 6, height: 300, color: "green", start_after: 0.006 },
    { distance: 9, height: 450, color: "blue", start_after: 0.009 }
  ];

  for (var j = 0; j < marker_lines.length; j++) {
    drawLine(start, end, marker_lines[j], layer, Myicons[j]);
  }
}

function drawLine(start, end, marker_lines, layer, customIcon) {
  // marker_lines : line properties
  // layer : layer to draw on map 
  // pointsInMeters : array of points in meters

  var pointsInMeters = [];
  var currentDistance = 0;
  var options = { units: 'kilometers' };

  var turfpoint1 = turf.point(start.slice().reverse());
  var turfpoint2 = turf.point(end.slice().reverse());
  var polyline1 = L.polyline([start, end], { color: 'black' }) // .addTo(layer);
  // layer.fitBounds(polyline1.getBounds());

  var bearing = turf.bearing(turfpoint1, turfpoint2);

  var turfnewpoint1 = turf.destination(turfpoint1, marker_lines.start_after, bearing, options);
  var newpoint1Marker = turfnewpoint1.geometry.coordinates.slice().reverse();

  var turfnewpoint2 = turf.destination(turfpoint2, -marker_lines.start_after, bearing, options);
  var newpoint2Marker = turfnewpoint2.geometry.coordinates.slice().reverse();

  var polyline2 = L.polyline([newpoint1Marker, newpoint2Marker], { color: marker_lines.color }) // .addTo(layer);

  var totalLineDistanceInMetre = kmToMeters(turf.distance(turfnewpoint1, turfnewpoint2, options));

  // there are two tyoe of the 



  console.log(totalLineDistanceInMetre);

  while (currentDistance <= totalLineDistanceInMetre) {
    calcutedPoint = turf.destination(turfnewpoint1, metersToKilometers(currentDistance), bearing, options).geometry.coordinates.slice().reverse();
    pointsInMeters.push(calcutedPoint);
    currentDistance += marker_lines.distance;
  }

  for (var i = 0; i < pointsInMeters.length; i++) {
    if (i % 2 === 0) {
      const leftpt = turf.rhumbDestination(pointsToTurf(pointsInMeters[i]), cmToKm(marker_lines.height), bearing - 90);
      L.polyline([pointsInMeters[i], getLeafletCoords(leftpt)]).setStyle({ color: marker_lines.color, weight: 5 }).addTo(layer);
      var marker = L.marker(getLeafletCoords(leftpt), { icon: customIcon }).addTo(layer);

    } else {
      const rightpt = turf.rhumbDestination(pointsToTurf(pointsInMeters[i]), cmToKm(marker_lines.height), bearing + 90);
      L.polyline([pointsInMeters[i], getLeafletCoords(rightpt)]).setStyle({ color: marker_lines.color, weight: 5 }).addTo(layer);
      var marker = L.marker(getLeafletCoords(rightpt), { icon: customIcon }).addTo(layer);

    }
  }
}
















// ================================  cursor  operation ================================
var latitudeElement = document.getElementById('latitude');
var longitudeElement = document.getElementById('longitude');

map.on('mousemove', function (e) {
  var lat = e.latlng.lat.toFixed(6);
  var lng = e.latlng.lng.toFixed(6);

  latitudeElement.textContent = lat;
  longitudeElement.textContent = lng;
});



// ================================ toggle color button operation ================================

function toggleButtonColor() {
  var button = document.getElementById("drawLineButton");
  button.classList.toggle("clicked");
}

// ================================ form operation ================================

function showProductDetails() {
  var detailsElement = document.getElementById("product-details");
  detailsElement.style.display = "none"; // Show the product details
}




// function onMapClick(e) {

//   if (displayText.style.display === 'none') {
//     displayText.style.display = 'block';
//   } else {
//     displayText.style.display = 'none';
//   }
//   // var coordinates = [];

//   // // Add the clicked point coordinates to the polyline
//   // coordinates.push(e.latlng);

//   // // Store the polyline coordinates in the polylines array
//   // polylines.push(coordinates);

//   // // Redraw all the polylines
//   // redrawPolylines();
// }

// map.on('click', onMapClick);


// ============================   search button   =============================
document.getElementById('search-button').addEventListener('click', function () {
  event.preventDefault();
  var searchInput = document.getElementById('search-input').value;
  searchPlace(searchInput);
  console.log("searchInput");
});

// Geocode and search place function
function searchPlace(query) {
  var isCoordinates = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.test(query);

  if (isCoordinates) {
    // Search by coordinates
    var coordinates = query.split(',');
    var lat = parseFloat(coordinates[0]);
    var lon = parseFloat(coordinates[1]);

    // Center the map on the searched coordinates
    map.setView([lat, lon], 13);

    // Add a marker at the searched coordinates
    var marker = L.marker([lat, lon]).addTo(map);
    marker.on('click', function () {
      map.removeLayer(marker);
    });

    // Bind a popup to the marker with coordinates
    marker.bindPopup('<b>Coordinates:</b><br>' + lat + ', ' + lon).openPopup();
  } else {
    // Search by place name
    // Send GET request to Nominatim API
    fetch('https://nominatim.openstreetmap.org/search?q=' + query + '&format=json')
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (data) {
        if (data.length > 0) {
          var place = data[0];
          var lat = parseFloat(place.lat);
          var lon = parseFloat(place.lon);

          // Center the map on the searched place
          map.setView([lat, lon], 13);

          // Add a marker at the searched place
          var marker = L.marker([lat, lon]).addTo(map);
          marker.on('click', function () {
            map.removeLayer(marker);
          });

          // Bind a popup to the marker with place details
          marker.bindPopup('<b>' + place.display_name + '</b>').openPopup();
        } else {
          // Handle no results found
          alert('No results found for the search query.');
        }
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  }
}


//========================  Utilities ========================

function metersToKilometers(meters) {
  var kilometers = meters / 1000;
  return kilometers;
}

function kmToMeters(kilometers) {
  return kilometers * 1000;
}

function cmToKm(cm) {
  var km = cm / 100000; // Divide centimeters by 100,000 to get kilometers
  return km;
}

function pointsToTurf(point) {
  return point.slice().reverse();
}

function getLeafletCoords(point) {
  return turf.getCoords(point).slice().reverse();
}

function calculateBearing(start, end) {
  var startLat = start.lat * Math.PI / 180;
  var startLng = start.lng * Math.PI / 180;
  var endLat = end.lat * Math.PI / 180;
  var endLng = end.lng * Math.PI / 180;

  var y = Math.sin(endLng - startLng) * Math.cos(endLat);
  var x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  var bearing = Math.atan2(y, x) * 180 / Math.PI;

  return (bearing + 360) % 360;
}


function calculateDestinationPoint(start, distance, bearing) {
  var radius = 6371000; // Earth's radius in meters
  var startLat = start.lat * Math.PI / 180;
  var startLng = start.lng * Math.PI / 180;
  var angularDistance = distance / radius;
  var endLat = Math.asin(Math.sin(startLat) * Math.cos(angularDistance) +
    Math.cos(startLat) * Math.sin(angularDistance) * Math.cos(bearing * Math.PI / 180));
  var endLng = startLng + Math.atan2(Math.sin(bearing * Math.PI / 180) * Math.sin(angularDistance) * Math.cos(startLat),
    Math.cos(angularDistance) - Math.sin(startLat) * Math.sin(endLat));
  endLat = endLat * 180 / Math.PI;
  endLng = endLng * 180 / Math.PI;

  return L.latLng(endLat, endLng);


}

function drawLine(start, end, marker_lines, layer, customIcon) {
  // marker_lines : line properties
  // layer : layer to draw on map 
  // pointsInMeters : array of points in meters

  var pointsInMeters = [];
  var currentDistance = 0;
  var options = { units: 'kilometers' };

  var turfpoint1 = turf.point(start.slice().reverse());
  var turfpoint2 = turf.point(end.slice().reverse());
  var polyline1 = L.polyline([start, end], { color: 'black' }) // .addTo(layer);
  // layer.fitBounds(polyline1.getBounds());

  var bearing = turf.bearing(turfpoint1, turfpoint2);

  var turfnewpoint1 = turf.destination(turfpoint1, marker_lines.start_after, bearing, options);
  var newpoint1Marker = turfnewpoint1.geometry.coordinates.slice().reverse();

  var turfnewpoint2 = turf.destination(turfpoint2, -marker_lines.start_after, bearing, options);
  var newpoint2Marker = turfnewpoint2.geometry.coordinates.slice().reverse();

  var polyline2 = L.polyline([newpoint1Marker, newpoint2Marker], { color: marker_lines.color }) // .addTo(layer);

  var totalLineDistanceInMetre = kmToMeters(turf.distance(turfnewpoint1, turfnewpoint2, options));

  // there are two tyoe of the 



  console.log(totalLineDistanceInMetre);

  while (currentDistance <= totalLineDistanceInMetre) {
    calcutedPoint = turf.destination(turfnewpoint1, metersToKilometers(currentDistance), bearing, options).geometry.coordinates.slice().reverse();
    pointsInMeters.push(calcutedPoint);
    currentDistance += marker_lines.distance;
  }

  for (var i = 0; i < pointsInMeters.length; i++) {
    if (i % 2 === 0) {
      const leftpt = turf.rhumbDestination(pointsToTurf(pointsInMeters[i]), cmToKm(marker_lines.height), bearing - 90);
      L.polyline([pointsInMeters[i], getLeafletCoords(leftpt)]).setStyle({ color: marker_lines.color, weight: 5 }).addTo(layer);
      var marker = L.marker(getLeafletCoords(leftpt), { icon: customIcon }).addTo(layer);

    } else {
      const rightpt = turf.rhumbDestination(pointsToTurf(pointsInMeters[i]), cmToKm(marker_lines.height), bearing + 90);
      L.polyline([pointsInMeters[i], getLeafletCoords(rightpt)]).setStyle({ color: marker_lines.color, weight: 5 }).addTo(layer);
      var marker = L.marker(getLeafletCoords(rightpt), { icon: customIcon }).addTo(layer);

    }
  }
}

// we are hear help  


var Myicons = [
  L.icon({
    iconUrl: './icon25/iconred1.png',
    iconSize: [15, 15],
    // iconAnchor: [10, 32],
  }),
  L.icon({
    iconUrl: './icon25/icongreen2.png',
    iconSize: [15, 15],
    // iconAnchor: [10, 32],
  }),
  L.icon({
    iconUrl: './icon25/iconblue3.png',
    iconSize: [15, 15],
    // iconAnchor: [16, 32],
  })



]
