/**
 * Created by david.berman on 3/27/14.
 */
'use strict';

mfApp.controller('MFController',
    function MFController($scope, $log, locationData) {
        $scope.addr1 = '';
        $scope.browserLocation = null;
        $scope.manualAddress = '';
        $scope.geocodedZip = '';
        $scope.markers = [];  // Map markers
        $scope.meetingLocations = []; // Meeting locations
        $scope.masterMeetingSchedule = []; // Meeting schedule
        $scope.selectedLocation = null; // Selected meeting ID location
        $scope.selectedLocationMeetingTimes = []; // Times of meetings at the selected location

        // This retreives the master schedule of meetings and caches it
        $scope.getMasterSchedule = function() {
            // If we already have the schedule, don't fetch it
            if($scope.masterMeetingSchedule.length < 1)
            {
                locationData.getMeetingTimesHttp().then(function(data) {
                    $scope.masterMeetingSchedule = data;
                });
            }
        }

        $scope.reload = function() {
            $scope.clearMarkers();
            $scope.initializeMap();
        }

        $scope.initApp = function()
        {
            $scope.detectLocation();
        }

        // Detects the location using the browser and triggers series of events to render map
        $scope.detectLocation = function() {
            // Kick off async fetch of meeting schedule.  That's all meeting times for all locations.
            $scope.getMasterSchedule();

            if (navigator.geolocation) {
                var timeoutVal = 10 * 1000 * 1000;
                navigator.geolocation.getCurrentPosition(
                    $scope.displayPosition,
                    $scope.displayError,
                    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
                );
            }
            else {
                alert("Geolocation is not supported by this browser");
            }
        }

        // Uses the master schedule and selected location to update the displayed meeting times
        $scope.updateSelectedLocationSchedule = function() {
            $log.log("Updating schedule for location ID: " + $scope.selectedLocation.locationId);
            $scope.selectedLocationMeetingTimes = locationData.getScheduleForLocation($scope.selectedLocation.locationId, $scope.masterMeetingSchedule);
        }

        $scope.clearMarkers = function() {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(null);
            }

            $scope.markers = null;
            $scope.markers = [];
        }

        $scope.displayPosition = function (position) {
            // Detect the location of the user and create the map centered on that position
            $scope.detectedPosition = position;
            $scope.centerPos = new google.maps.LatLng($scope.detectedPosition.coords.latitude, $scope.detectedPosition.coords.longitude);
            google.maps.event.addDomListener(window, 'load', $scope.initializeMap());
        }

        $scope.displayError = function (error) {
            var errors = {
                1: 'Permission denied',
                2: 'Position unavailable',
                3: 'Request timeout'
            };
            alert("Error: " + errors[error.code]);
        }

        // Toggles an item's selected state on or off
        $scope.selectMeetingLocation = function (location) {
            // If another location was selected, deselect it
            if ($scope.selectedLocation)
                $scope.selectedLocation.selected = false;

            // Toggle selected state on the item
            location.selected = !location.selected;

            // Track the currently selected item
            $scope.selectedLocation = location;

            $log.log("selected location: " + location.locationId);

            $scope.updateSelectedLocationSchedule();

            return location.selected;
        }

        function getMapOptions() {
            var options = {
                zoom: 12,
                center: $scope.centerPos,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            return options;
        }

        function parseTimestamp(timestamp) {
            var d = new Date(timestamp);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            var hour = d.getHours();
            var mins = d.getMinutes();
            var secs = d.getSeconds();
            var msec = d.getMilliseconds();
            return day + "." + month + "." + year + " " + hour + ":" + mins + ":" + secs + "," + msec;
        }

        $scope.initializeMap = function () {
            // Creates the map
            $scope.map = new google.maps.Map(document.getElementById("map"), getMapOptions());
            $scope.geocoder = new google.maps.Geocoder();

            // Creates the marker using manually input address or guesses using GPS
            if ($scope.manualAddress.length > 0)
            {  // Use manually input location
                $scope.geocoder.geocode( { 'address' : $scope.manualAddress }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        // Capture zipcode
                        $scope.geocodedZip = results[0].address_components[7].short_name;
                        var meetingMarker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.BOUNCE,
                            position: results[0].geometry.location
                        });

                        // Add the marker to our array of markers so we can remove it later
                        $scope.markers.push(meetingMarker);
                    }
                });
            }
            else
            {   // Use GPS
                var marker = new google.maps.Marker({
                    position: $scope.centerPos,
                    map: $scope.map,
                    animation: google.maps.Animation.BOUNCE,
                    title: "YOU ARE HERE"
                });

                // Add the marker to our array of markers so we can remove it later
                $scope.markers.push(marker);

                // Add pop-up info
                var contentString = "<b>Timestamp:</b> " + parseTimestamp($scope.detectedPosition.timestamp) + "<br/><b>User location:</b> lat " + $scope.detectedPosition.coords.latitude + ", long " + $scope.detectedPosition.coords.longitude + ", accuracy " + $scope.detectedPosition.coords.accuracy;
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open($scope.map, marker);
                });
            }

            // Drop meeting markers
            // locationData.getLocations().then(function(loc) {

            locationData.getLocationsHttp($scope.detectedPosition.coords.latitude, $scope.detectedPosition.coords.longitude).then(function(loc) {

                $scope.meetingLocations = loc;
                for (var addrIndex in loc)
                {
                    var addrString = formatAddressAsString(loc[addrIndex]);
                    $scope.geocoder.geocode( { 'address' : addrString }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var meetingMarker = new google.maps.Marker({
                                map: $scope.map,
                                animation: google.maps.Animation.DROP,
                                position: results[0].geometry.location
                            });
                            // Add the marker to our array of markers so we can remove it later
                            $scope.markers.push(meetingMarker);
                        }
                    });
                }
            });
        }

        function formatAddressAsString(addr) {
            return addr.address + "," + addr.city + "," + addr.zip;
        }
    });


