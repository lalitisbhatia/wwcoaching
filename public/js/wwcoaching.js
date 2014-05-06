// Userlist data array for filling in info box
var coaches = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    
    //getWineList();
    $("#coaches").click(function(){
        console.log('calling get all coaches');
        getAllCoaches();    
    })
    
    $('#aMyUsers').click(function(){
       console.log('My users link clicked') ;
       getCoachUsers();
    });
    
    
});


// Functions =============================================================

// Fill table with data
function getAllCoaches() {
    console.log('inside getAllCoaches');
    jQuery.get('/coaches',function(data,status,xhr){
      console.log(data) ;
      $('#divcoaches').html(data[0]);
    
    
    });
  
};

function getCoachInfo() {
    console.log('inside getCoachInfo');
    jQuery.get('/coach/',function(data,status,xhr){
      console.log(data) ;
      console.dir(data); 
    console.log(status); 
    console.dir(xhr); 
    });
  
};

function getCoachUsers(){
    jQuery.get('/cusers',function(data,status,xhr){
      console.log(data) ;
      
    });
}
// $("#loginForm").submit(function () {

//             var username = $("#username").val();
//             var password = $("#password").val();
//             console.log(username+password);
//             $.ajax({
//                 type: "POST",
//                 url: "/",
//                 data: "username=" + username + "&username=" + password,
//                 success: function (data) {
//                     console.log('login successful');
//                 },
//                 beforeSend: function () {
//                     $("#add_err").html("<span style='font-size:15px'>Loading...</span>")
//                 }
//             });
//             $("#add_err").html("<span style='color:red;font-size:15px'>Wrong username or password</span>");
//             return false;
//         });