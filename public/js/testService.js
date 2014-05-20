use strict';

mfApp.factory('locationData', function($q, $timeout, $http, $log) {
    var service = {
        convertDayNumberToString: function(dayNum) {
            switch(dayNum) {
                case "0": return 'Sunday';
                case "1": return 'Monday';
                case "2": return 'Tuesday';
                case "3": return 'Wednesday';
                case "4": return 'Thursday';
                case "5": return 'Friday';
                case "6": return 'Saturday';
                case "7": return 'Sunday';
                case "8": return 'Invalid';
            }
        },
        getLocationsHttp: function(lon, lat) {
            $log.info("lon: " + lon);
            var url = "https://spatial.virtualearth.net/REST/v1/data/e8c7dd36fbae4a21b22843820e21616f/WWUSMFDATAQA/WWMeetingLocations?spatialFilter=nearby(" + lon + "," + lat + ",75)&$select=Location_ID,LocationName,AddressLine,Locality,AdminDistrict,PostalCode,Latitude,Longitude,__Distance&$top=10&key=AucmoT6cAyH9TeXeGGqsB8LIYoJhvs-zciuv2aS1N04nujJw0_hZoP_wgC6l4bRN&$format=json";

            return $http({  method: 'GET',
                url: url,
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
                .success(function(d) { $log.info("Successfully retrieved locations from BING."); })
                .error(function(d) { $log.info("Error retrieving locations from BING"); })
                .then(function(response) {
                    var data = response.data.d.results;
                    var results = [];
                    for (var locIndex in data)
                    {
                        // Skip the first result because its an object
                        $log.info(data[locIndex].AddressLine + ", " + data[locIndex].Locality + ", " + data[locIndex].PostalCode);

                        results.push(
                            {
                                address: data[locIndex].AddressLine,
                                city: data[locIndex].Locality,
                                zip: data[locIndex].PostalCode,
                                locationId : data[locIndex].Location_ID
                            });
                    }

                    return results;
                });
        },
        getMeetingTimesHttp: function() {
            var url = "http://wwmeeting.herokuapp.com/meetings.json";

            return $http({  method: 'GET',
                url: url,
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
                .success(function(response) { $log.info("Successfully retrieved meeting times."); })
                .error(function(response) {
                    //   var status = response.status;
                    $log.info("Error retrieving meeting times");
                })
                .then(function(response) {
                    $log.log("Building meeting schedule...");

                    var data = response.data.meetings;
                    var meetings = [];
                    for (var i in data)
                    {
                        if (data[i].OBSOLETE_FLAG == 'N')
                            meetings.push(
                                {
                                    meeting_id : data[i].MEETING_ID,
                                    location_id : data[i].LOCATION_ID,
                                    meeting_time : data[i].MEETING_TIME,
                                    meeting_day_id : data[i].MEETING_DAY_ID,
                                    meeting_day_str : new String(service.convertDayNumberToString(data[i].MEETING_DAY_ID)),
                                    meeting_announce : data[i].MEETING_ANNOUNCE
                                }
                            );
                    }

                    $log.log("Promise complete for fetching " + meetings.length + " meeting times.");

                    return meetings;
                });
        },
        getScheduleForLocation: function(location_id, meetingSchedule) {
            var schedule = [];
            for (var i in meetingSchedule)
            {
                if (meetingSchedule[i].location_id == location_id)
                {
                    schedule.push(meetingSchedule[i]);
                    $log.log("Added meeting + " + meetingSchedule[i].meeting_id + "to schedule.");
                }
            }

            $log.log("This location has " + schedule.length + " meetings.");
            return schedule;
        }
    };

    return service;
});

