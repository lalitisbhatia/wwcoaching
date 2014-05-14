 $(document).ready(function () {
     var selectedTimes = [];
//    $('#datetimepicker').datetimepicker({
//        format:'d-m-Y H:i',
//        inline:true,
//        lang:'en',
//        //minTime:'10:00',
//        //maxTime:'20:00',
//        allowTimes:[
//                    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '15:00', '17:00', '17:05', '17:20', '19:00', '20:00'
//            ],
//        step:30
//        ,
//        onSelectTime:function(dp,$input){
//
//            //AddSelection($input.val());
//
//        }
//    });



    $('#pickdatetime').datetimepicker({
        format:'d-m-Y H:i',
//        inline:true,
        lang:'en',
        //minTime:'10:00',
        //maxTime:'20:00',
        allowTimes:[
                    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '15:00', '17:00', '17:05', '17:20', '19:00', '20:00'
            ],
        step:30
        ,
        onSelectTime:function(dp,$input){

             AddSelection($input.val());

        }
    });


    function AddSelection(date){

        if($.inArray(date,selectedTimes)==-1){
            selectedTimes.push(date);
            $('#dates').append("<li>" + date + "<a href='#' onclick='RemoveSelection()'> Remove</a></li>");

            //$('#selectedDate').append("<div>"+date+"<a href='#' onclick='RemoveSelection(date)'> Remove</span></div>");
            console.log(selectedTimes);
        }
    }
//
//     function RemoveSelection(){
//
//     }
//
    
   
});