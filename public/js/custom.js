 $(document).ready(function () {
    $('#datetimepicker').datetimepicker({
        format:'d.m.Y H:i',
        inline:true,
        lang:'en',
        //minTime:'10:00',
        //maxTime:'20:00',
        allowTimes:[
                    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '15:00', '17:00', '17:05', '17:20', '19:00', '20:00'
            ],
        step:30,
        onChangeDateTime:function(dp,$input){
            $('#selectedDate').html($input.val());
        }
    });
   
});