'use strict';

adminModule.controller('AdminController',  function AdminController($scope,$http,$log,AdminService) {
    $scope.initApp=function() {
        $scope.DISPLAY_DAYS = 1;
        $scope.coaches=[];
        AdminService.getAllCoaches().then(function(data){
            $scope.coaches = data;
            console.log($scope.coaches);
        });

        $scope.users=[];
        AdminService.getAllUsers().then(function(data){
            $scope.users = data;
            //console.log($scope.users);
        });

        //initialize the calendar array
        $scope.calendarArray=[];
        $scope.calendarArray.Times=[];

        //initialize the array to hold data of availability from db
        $scope.coachAvailDates = [];

        $scope.setupSchedule();

    };


    $scope.deleteConf=function(user){
        console.log(user);
        $.confirm({
            title:'Deleting user?',

            text: "Are you sure you want to delete "+ user.FirstName + ' '+user.LastName ,
            confirm: function(button) {
                $scope.deleteUser(user._id);
            },
            cancel: function(button) {
            },
            confirmButton: "Yes I am",
            cancelButton: "No"
        });
    };



    /**********************************************
     **** handle CRUD operations for Coaches ********
     *********************************************/

    $scope.savecoach = function() {
        //console.log($scope.newcoach);
        if($scope.newcoach._id == null) {

            console.log($scope.newcoach) ;


            AdminService.addNewCoach($scope.newcoach).then(function(data){
                console.log('logging return from add coach');
                console.log(data);
                $scope.coaches.push(data);
            });
//          console.log($scope.coaches);
        } else {
            console.log('updating coach');

            //for existing contact, find this user using id
            //and update it.
            for(var i in $scope.coaches) {
                if($scope.coaches[i]._id == $scope.newcoach._id) {
                    $scope.coaches[i] = $scope.newcoach;
                }
            }
            console.log($scope.newcoach);
            AdminService.updateCoach($scope.newcoach).then(function(data){
                console.log('logging return from updating coach');
                console.log(data);
            });
        }
        //  clear the add contact form
        $scope.newcoach = {};

    };

    $scope.deleteCoach = function(id) {
        console.log(id);
        //search coach with given id and delete it
        for(var i in $scope.coaches) {
            if($scope.coaches[i]._id == id) {
                $scope.newcoach._id= id;
                console.log($scope.newcoach);
                AdminService.deleteCoach($scope.newcoach,function(data){
                    console.log(data);

                });
                $scope.coaches.splice(i,1);
            }
            $scope.newcoach = {};
        }

    };
    //clear the add coach form
    $scope.newcoach = {};

    $scope.editCoach = function(id) {
        console.log('coach id = '+id);
        //search coach with given id and update it
        for(var i in $scope.coaches) {
            if($scope.coaches[i]._id == id) {
                //we use angular.copy() method to create
                //copy of original object
                console.log('id = '+ $scope.coaches[i]._id);
                $scope.newcoach = angular.copy($scope.coaches[i]);
            }
        }
    };
    /**********************************************
     **** handle CRUD operations for Users ********
     *********************************************/

    $scope.saveuser = function() {
        console.log($scope.newuser);
        if($scope.newuser._id == null) {

            console.log($scope.newuser) ;


            AdminService.addNewUser($scope.newuser).then(function(data){
                console.log('logging return from add user');
                console.log(data);
                $scope.users.push(data);
            });
            //console.log($scope.users);
        } else {
            console.log('updating user');

            //for existing contact, find this user using id
            //and update it.
            for(var i in $scope.users) {
                if($scope.users[i]._id == $scope.newuser._id) {
                    $scope.users[i] = $scope.newuser;
                }
            }
            console.log($scope.newuser);
            AdminService.updateUser($scope.newuser).then(function(data){
                console.log('logging return from updating user');
                console.log(data);
            });
        }
        //  clear the add contact form
        $scope.newuser = {};

    };

    $scope.deleteUser = function(id) {
        console.log(id);
        //search user with given id and delete it
        for(var i in $scope.users) {
            if($scope.users[i]._id == id) {
                $scope.newuser._id= id;
                console.log($scope.newuser);
                AdminService.deleteUser($scope.newuser,function(data){
                    console.log(data);

                });
                $scope.users.splice(i,1);
            }
            $scope.newuser = {};
        }

    };
    //clear the add user form
    $scope.newuser = {};

    $scope.editUser = function(id) {
        console.log('user id = '+id);
        //search user with given id and update it
        for(var i in $scope.users) {
            if($scope.users[i]._id == id) {
                //we use angular.copy() method to create
                //copy of original object
                console.log('id = '+ $scope.users[i]._id);
                $scope.newuser = angular.copy($scope.users[i]);
            }
        }
    };

    $scope.testEmail = function(coach){
        console.log('calling test email');
        console.log(coach);
        var emailData={};
        emailData.Subj = 'Test email from '+coach.FirstName + ' ' + coach.LastName;
        emailData.msg="This is a test message";
        emailData.senderEmail = coach.Email;
        emailData.recEmail='lalit.bhatia@weightwatchers.com';
        emailData.senderPass=coach.EmailPassword;

        AdminService.testEmail(emailData).then(function(data){
            console.log('success');
            alert(data);
        });
    };

    /****************************************************************
     *  Handle Next/Prev calendar buttons
     /****************************************************************/
    $scope.updateDay= function(action){
        console.log('inside update week');
        if(action=='next'){
            //console.log('select next week');
            $scope.startdate.setDate($scope.startdate.getDate()+$scope.DISPLAY_DAYS);
            console.log($scope.startdate);
        }
        if(action=='prev'){
            console.log('select prev week');
            $scope.startdate.setDate($scope.startdate.getDate()-$scope.DISPLAY_DAYS );
            console.log($scope.startdate);
        }
        $scope.setupSchedule();
    };


    $scope.setupSchedule = function(){
        if(!$scope.startdate){
            $scope.today= new Date();
            $scope.startdate = new Date($scope.today.getFullYear(), $scope.today.getMonth(),$scope.today.getDate(), 8,30);
        }

        AdminService.getAllCoachSchedule($scope.startdate ).then(function (data) {
            $scope.coachAvailDates = data;
            //console.log($scope.coachAvailDates);
            $scope.sortAllAvailability();
        });
    };

    $scope.sortAllAvailability = function(){
        //console.log($scope.coachAvailDates);
        var currTime ='';
        var calCounter=-1;
        //console.log($scope.calendarArray.Times.Coaches);
        for (var j in $scope.coachAvailDates) {
            var userAppt=$scope.coachAvailDates[j].User;
            var coach=$scope.coachAvailDates[j].Coach;
            if(userAppt){
                //console.log('found appt' + calCounter);
                coach.Appt=userAppt;
            }
            var dt = new Date($scope.coachAvailDates[j].DateUTC);
            console.log("Time = " + $scope.coachAvailDates[j].Time + '   ---  Locale time = ' + dt.toLocaleTimeString());
            if (currTime==dt.toLocaleTimeString()){
                $scope.calendarArray.Times[calCounter].Coaches.push(coach);


            }else {
                calCounter++;
                //console.log(calCounter);
                currTime = dt.toLocaleTimeString();
                $scope.calendarArray.Times[calCounter]={};
                $scope.calendarArray.Times[calCounter].Coaches=[];
                $scope.calendarArray.Times[calCounter].time=currTime;

                $scope.calendarArray.Times[calCounter].Coaches.push(coach);
            }



        }

        //console.log($scope.calendarArray.Times);
    }
});