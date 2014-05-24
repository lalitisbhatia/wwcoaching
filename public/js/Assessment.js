var currDate = new Date();


var weekday=new Array(7);
weekday[0]="Sun";
weekday[1]="Mon";
weekday[2]="Tues";
weekday[3]="Wed";
weekday[4]="Thu";
weekday[5]="Fri";
weekday[6]="Sat";



/*******************************
****** ASSESSMENT **************
*******************************/

/**** Save Assessment *****/
function SaveAssessment() {
        
        assmDate = currDate.getMonth() + "/" + currDate.getDate() + "/" + currDate.getFullYear() + " " + currDate.getHours() + ":" + currDate.getMinutes() + ":" + currDate.getSeconds();

        var assessment = {
            FirstName: $.trim($('#q00a01 input').val().toLowerCase()),
            LastName: $.trim($('#q00a02 input').val().toLowerCase()),
            Date: assmDate,
            Questions:
            [
                {
                    Q: $("#q01 .ques").html(),QClass:$("#q01 .ques").attr('class'),
                    QOpts:
                        [
                            { Opt: $("#q01a01 .ques-sub span").html(), Ans: $("input[name='meals_num1']:checked").next('div').find('span').html(), Flag: ($("input[name='meals_num1']:checked").next('div').find('span').html() < 4 ? true : false) },
                            { Opt: $("#q01a02 .ques-sub span").html(), Ans: $("input[name='meals_num2']:checked").next('div').find('span').html(), Flag: ($("input[name='meals_num2']:checked").next('div').find('span').html() < 4 ? true : false) },
                            { Opt: $("#q01a03 .ques-sub span").html(), Ans: $("input[name='meals_num3']:checked").next('div').find('span').html(), Flag: ($("input[name='meals_num3']:checked").next('div').find('span').html() < 4 ? true : false) }

                        ]
                },
                {
                    Q: $("#q02 .ques").html(), Ans: $("input[name='eating_patterns']:checked").next('div').find('span').html(), Flag: ($("input[name='eating_patterns']:checked").next('div').find('span').html() == "I don't have set mealtimes and eat...whenever!" ? true : false)

                },
                {
                    Q: $("#q03 .ques").html(),
                    QOpts:
                        [
                            { Opt: $("#q03a01 .ques-sub span").html(), Ans: $("input[name='meals_out1']:checked").next('div').find('span').html(), Flag: ($("input[name='meals_out1']:checked").next('div').find('span').html() > 2 ? true : false) },
                            { Opt: $("#q03a02 .ques-sub span").html(), Ans: $("input[name='meals_out2']:checked").next('div').find('span').html() },
                            { Opt: $("#q03a03 .ques-sub span").html(), Ans: $("input[name='meals_out3']:checked").next('div').find('span').html(), Flag: ($("input[name='meals_out3']:checked").next('div').find('span').html() > 2 ? true : false) },
                            { Opt: $("#q03a04 .ques-sub span").html(), Ans: $("input[name='meals_out4']:checked").next('div').find('span').html() }

                        ]
                },
                {
                    Q: $("#q04 .ques").html(), Ans: $("input[name='who_cooks']:checked").next('div').find('span').html()
                },
                {
                    Q: $("#q05 .ques").html(),
                    QOpts:
                        [
                            { Opt: $("#q05a01 span").html(), Ans: $("#q05a01 input").val(), Flag: ($("#q05a01 input").val() <= 2 ? true : false) },
                            { Opt: $("#q05a02 span").html(), Ans: $("#q05a02 input").val(), Flag: ($("#q05a02 input").val() <= 2 ? true : false) },
                            { Opt: $("#q05a03 span").html(), Ans: $("#q05a03 input").val(), Flag: ($("#q05a03 input").val() >= 2 ? true : false) },
                            { Opt: $("#q05a04 span").html(), Ans: $("#q05a04 input").val(), Flag: ($("#q05a04 input").val() >= 1 ? true : false) },
                            { Opt: $("#q05a05 span").html(), Ans: $("#q05a05 input").val(), Flag: ($("#q05a05 input").val() >= 1 ? true : false) },
                            { Opt: $("#q05a06 span").html(), Ans: $("#q05a06 input").val(), Flag: ($("#q05a06 input").val() >= 1 ? true : false) },
                            { Opt: $("#q05a07 span").html(), Ans: $("#q05a07 input").val() }

                        ]
                },
                {
                    Q: $("#q06 .ques").html(), Ans: $("input[name='daily_act']:checked").next('div').next('span').html(), Flag: (($("input[name='daily_act']:checked").next('div').next('span').html() == "Sitting down" || $("input[name='daily_act']:checked").next('div').next('span').html() == "Mostly sitting down, but I work out too") ? true : false)
                },
                {
                    Q: $("#q07 .ques").html(), Ans: $("input[name='physical_act']:checked").next('div').next('span').html()
                },
                {
                    Q: $("#q08 .ques").html(), Ans: ($("input[name='act_track']:checked").prop("id") == 'yesDevices' ? GetSelectedCheckboxes("input[name='act_devices']:checked") : $("input[name='act_track']:checked").next('div').find('span').html())
                },
                {
                    Q: $("#q09 .ques").html(), Ans: $("#q09 input").val(), Flag: ($("#q09 input").val() > 200 ? true : false)
                },
                {
                    Q: $("#q10 .ques").html(), Ans: $("#q10 input").val()
                },
                {
                    Q: $("#q11 .ques").html(), QClass: $("#q011 .ques").attr('class'), Ans: ($("input[name='loss_approach']:checked").next('div').closest('label').attr('id') == 'q11a09' ? ($("input[name='loss_approach']:checked").closest('label').next('input[type="text"]').val() == $("input[name='loss_approach']:checked").closest('label').next('input[type="text"]').attr('placeholder') ? '' : $("input[name='loss_approach']:checked").closest('label').next('input[type="text"]').val()) : $("input[name='loss_approach']:checked").next('div').next('span').html())
                },
                {
                    Q: $("#q12 .ques").html(), QType: "BoolRadio",
                    QOpts:
                        [
                            { Opt: $("#q12a01 .ques-sub").html(), Ans: $("input[name='statement1']:checked").next('div').find('span').html() },
                            { Opt: $("#q12a02 .ques-sub").html(), Ans: $("input[name='statement2']:checked").next('div').find('span').html() },
                            { Opt: $("#q12a03 .ques-sub").html(), Ans: $("input[name='statement3']:checked").next('div').find('span').html() },
                            { Opt: $("#q12a04 .ques-sub").html(), Ans: $("input[name='statement4']:checked").next('div').find('span').html() }

                        ]
                },

                {
                    Q: $("#q13 .ques").html(), Ans: $("input[name='wt_to_lose']:checked").next('div').next('span').html()
                },
                {
                    Q: $("#q14 .ques").html(), Ans: $("#q14 textarea").val()
                },
                {
                    Q: $("#q15 .ques").html(), Ans: $("#q15 textarea").val()
                },
                {
                    Q: $("#q16 .ques").html(), Ans: ($("input[name='spend_your_day']:checked").next('div').closest('label').attr('id') == 'q16a06' ? ($("input[name='spend_your_day']:checked").closest('label').next('input[type="text"]').val() == $("input[name='spend_your_day']:checked").closest('label').next('input[type="text"]').attr('placeholder') ? '' : $("input[name='spend_your_day']:checked").closest('label').next('input[type="text"]').val()) : $("input[name='spend_your_day']:checked").next('div').next('span').html())
                },
                {
                    Q: $("#q17 .ques").html(), Ans: $("input[name='household']:checked").next('div').next('span').html()
                },
                {
                    Q: $("#q18 .ques").html(), Ans: $("input[name='support']:checked").next('div').next('span').html()
                },
                {
                    Q: $("#q19 .ques").html(), Ans: $("input[name='stress']:checked").next('div').next('span').html()
                },
                {
                    Q: $("#q20 .ques").html(), Ans: GetSelectedCheckboxes("input[name='stay_on_track']:checked")
                },
                {
                    Q: $("#q21 .ques").html(), Ans: GetMultipleTextInputs($("#q21 input"))
                },
                {
                    Q: $("#q22 .ques").html(), Ans: GetSelectedCheckboxes("input[name='allergies']:checked")
                },
                {
                    Q: $("#q23 .ques").html(), Ans: GetSelectedCheckboxes("input[name='hard_to_lose']:checked")
                },
                {
                    Q: $("#q24 .ques").html(), Ans: $("#q24 textarea").val()
                },
                {
                    Q: $("#q25 .ques").html(), Ans: ($("input[name='mantra']:checked").next('div').closest('label').attr('id') == 'q25a10' ? ($("input[name='mantra']:checked").closest('label').next('textarea').val() == $("input[name='mantra']:checked").closest('label').next('textarea').attr('placeholder') ? '' : $("input[name='mantra']:checked").closest('label').next('textarea').val()) : $("input[name='mantra']:checked").next('div').next('span').html())
                },
                {
                    Q: "Final thoughts", Ans: $("#qstn_assess textarea").val()==$("#qstn_assess textarea").attr('placeholder') ? '':$("#qstn_assess textarea").val()
                }
            ]

        };

        assessment = JSON.stringify(assessment);

        $.ajax({
            type: "POST",
            url: '../Assessment.svc/SaveAssessment',
            data: JSON.stringify({ assmnt: assessment }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: false,
            success: function (data, status, xhr) {
                window.location.replace("/thanks.html");
            },
            error: function (xhr) {
                alert("failed" + xhr.responseText);
            }
        });
}

/******** Validate Assessment form *******/
function ValidAssessment() {
    var valid = true;
    if ($('input[name="First Name"]').val()=="") {
        alert("**Please enter your first name");
        //$('#valFN').html("**Please enter your first name");
        //$('#valFN').prop("class", "validation");
        valid = false;
    }
    if (!$('input[name="Last Name"]').val()) {
        alert("**Please enter your last name");
        //$('#valLN').html("**Please enter your last name");
        //$('#valLN').prop("class", "validation");
        valid = false;
    }

    return valid;
}

/**** returns the checked check box texts in a an array  *****/
function GetSelectedCheckboxes(chkName) {
    var ret = new Array;
    var checkbox = chkName
    $(checkbox).each(function () {
        if ($(this).closest('label').next('input[type="text"]').length) {
            ret.push(($(this).closest('label').next('input[type="text"]').val() == $(this).closest('label').next('input[type="text"]').attr('placeholder') ? '' : $(this).closest('label').next('input[type="text"]').val()));
        }
        else {
            ret.push($(this).next('div').next('span').html());
        }
    });
    return ret;
}

// This is for questions where one question has multiple text input values
function GetMultipleTextInputs(inputName) {
    var ret = new Array
    var inputs = inputName
    $(inputs).each(function () {
        ret.push($(this).val());
    });
    return ret;
}




function GetAssessmentResults(userid) {
    $.ajax({
        url: '../Assessment.svc/GetAssessmentResults',
        data: "userid=" + userid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, xhr) {
            var jsonData = $.parseJSON(data.d);
            $("#Name").text(jsonData.FirstName + " " + jsonData.LastName);
            var questions = jsonData.Questions;
            var divResults = $("#results");
            $.each(questions, function (index, item) {
                //console.log((item.Q));

                /*****Output the question first *****/
                var htm = "";
                if (item.QType) { // special case for boolean type questions

                    htm = "<div class='ques-wrap  true-false'><div class='ques'>" + (item.Q) + "</div>";
                }
                else {
                    htm = "<div class='ques-wrap '><div class='ques'>" + (item.Q) + "</div>";
                }

                /*****Output the corresponding answer *****/
                var answer = "";

                if (JSON.stringify(item.QOpts)) { //questions with multiple sub questions
                    $.each(item.QOpts, function (idx, itemOpt) {
                        //console.log(itemOpt.Opt + " - " + itemOpt.Ans);
                        //console.log(itemOpt.Flag);
                        var flagText = "";
                        if (itemOpt.Flag) {
                            flagText = "<span class='ansflag-text'><img src='css/images/flag_small.png'/></span>"
                        }

                        if (itemOpt.Ans) {
                            answer = itemOpt.Ans;
                        } else {
                            answer = "";

                        }
                        
                        htm += "<div><span class='ques-sub'>" + itemOpt.Opt + " :</span><span class='answ-text'>" + answer + "</span>" + flagText + "</div>"
                    });
                }
                else {
                    //console.log((item.Ans));
                    var flagText = "";
                    if (item.Flag) {
                        flagText = "<span class='ansflag-text'><img src='css/images/flag_small.png'/></span>"
                    }

                    //check if the answer itself is a list or array(e.g multiple checkboxes selected)
                    if (item.Ans instanceof Array) {
                        htm += "<ul>";
                        $.each(item.Ans, function (j, ans) {
                            if (ans) {
                                answer = ans;
                            }
                            htm += "<li><span  class='answ-text'>" + ans + "</span>" + flagText + "</li>";
                        });
                        htm += "</ul>";
                    }
                    else {
                        if (item.Ans) {
                            answer = item.Ans;
                        }
                        htm += "<div ><span  class='answ-text'>" + answer + "</span>" + flagText + "</div>";
                    }
                }

                htm += "</div><div class='aq-divider-res'></div>";
                divResults.append(htm);

            });

        },
        error: function (xhr, status, error) {
            alert('Error occurred: ' + error);
        }
    });
}


/**************************
******COACHES**************
***************************/
var coachid;
var userid;

//toggle display of new coach table
function ClearNewCoachForm() {
    coachid = null;

    $("#tblNewCoach").show();
    $("input").val('');
    $("#Bio").val('');
    $("input").prop("disabled", false);
    $("#Bio").prop("disabled", false);
    $("#MyButton").prop("disabled", false);
}
function GetCoachDetails(coachid) {
    $.ajax({
        url: '../Assessment.svc/GetCoaches',
        data: "coachId=" + coachid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, xhr) {
            //alert(data.d);
            var mydata = data.d;
            mydata = '{"row":' + mydata + '}';
            //console.log(mydata);
            var myjson = JSON.parse(mydata);

            //first remove all the rows exept the first and then add rows
            $("#tblCoaches").find("tr:gt(0)").remove();

            $.each(myjson.row, function (index, item) {

                var row;
                var jsonItem = JSON.stringify(item);
                if (coachid == "") { // this is for the all coaches page
                    row = $("<tr class='rows'><td style='text-transform: capitalize;'><a href='CoachView.htm?coachid=" + item._id+"'>" + item.FirstName + " " + item.LastName + "</a></td><td>" + item.Phone + "</td><td>" + item.Email + "</td><td align=center> <img src='css/images/thin-002_write_pencil_new_edit-24.png' id='editCoach' onclick='PopulateCoachData(" + jsonItem + ")'></img> </td></tr>");
                    $("#tblCoaches").append(row);
                    $(".rows td").attr('class', 'tab-row');
                }
                else { // when a oach id is passed in, update items on the coach view page
                    $("#coachWlcm").text("Welcome " + item.FirstName);
                    $("#ccName").text(item.CoachesCoach);
                    $("#ccEmail").html(item.CoachesCoachEmail);
                    $("#ccEmail").attr('href',"mailto:"+item.CoachesCoachEmail);
                    document.title = "Welcome " + item.FirstName;
                }

            });

            
        },
        error: function (xhr, status, error) {
            alert('Error occurred: ' + error);
            console.write(data);
        }

    });
}


//called from edit button
function PopulateCoachData(coach) {
    ClearCoachData();
    $("#tblNewCoach").show();
    $("#MyButton").prop("disabled", false);
    $("input").prop("disabled", false);
    $("#Bio").prop("disabled", false);
    $('#FirstName').val(coach.FirstName);
    $('#LastName').val(coach.LastName);
    $('#Phone').val(coach.Phone);
    $('#Email').val(coach.Email);
    $('#Bio').val(coach.Bio);
    $('#ddCoachesCoach option:selected').text(coach.CoachesCoach);
    $('#ddCoachesCoach option:selected').val(coach.CoachId);
    coachid = coach._id;
   
}

function ClearCoachData() {
    $("#tblNewCoach").show();
    $("#MyButton").prop("disabled", false);
    $("input").prop("disabled", false);
    $("#Bio").prop("disabled", false);
    $('#FirstName').val("");
    $('#LastName').val("");
    $('#Phone').val("");
    $('#Email').val("");
    $('#Bio').val("");
    $('#ddCoachesCoach option:selected').text("");
    $('#ddCoachesCoach option:selected').val(0);
    coachid = "";
}

//Save coache data
function SaveCoach() {
    //ValidateCoachInputForm();
    if (!coachid) {
        $('#valFN').html("");
        $('#valLN').html("");
        $('#valPh').html("");
        $('#valEm').html("");       
    }

    var valid = true;
    if (!$('#FirstName').val()) {
        $('#valFN').html("**Please enter your first name");
        $('#valFN').prop("class", "validation");
        valid = false;
    }
    if (!$('#LastName').val()) {
        $('#valLN').html("**Please enter your last name");
        $('#valLN').prop("class", "validation");
        valid = false;
    }
//    if (!$('#Phone').val()) {
//        $('#valPh').html("**Please enter your phone number");
//        $('#valPh').prop("class", "validation");
//        valid = false;
//    }
//    if (!$('#Email').val()) {
//        $('#valEm').html("**Please enter your email address");
//        $('#valEm').prop("class", "validation");
//        valid = false;
//    }

    if (valid) {
        //trannslate obsolete checkbox to string
        var obsStr = "false";
        
        //instantiate coachid;        
        var coach = 'coach=' +
                   JSON.stringify({
                       _id: coachid,
                       FirstName: $.trim($('#FirstName').val().toLowerCase()),
                       LastName: $.trim($('#LastName').val().toLowerCase()),
                       Phone: $('#Phone').val(),
                       Email: $('#Email').val(),
                       Bio: $('#Bio').val(),
                       CoachesCoach: $.trim($('#ddCoachesCoach option:selected').text().toLowerCase()),
                       CoachId: $('#ddCoachesCoach option:selected').val(),
                       CoachesCoachEmail: $('#ddCoachesCoach option:selected').attr('email')
                   });
        $.ajax({
            url: '../Assessment.svc/SaveCoach',
            data: coach,
            contentType: "application/json;charset=utf-8",
            dataType: 'json',
            processData: true,
            success: function (data, status, xhr) {
                $("input").prop("disabled", true);
                $("#MyButton").prop("disabled", true);
                $("#Bio").prop("disabled", true);
                $('#thankYou').html('Thanks for entering your details <br />'
                                         );

                GetCoachDetails("");
            },
            error: function (xhr, status, error) {
                alert('Error occurred: ' + error);
            }

        });
    }
}


/************************
******USERS**************
*************************/

//Save User Data
function SaveUser() {
    //ValidateCoachInputForm();
    if (!coachid) {
        $('#valFN').html("");
        $('#valLN').html("");
        $('#valPh').html("");
        $('#valEm').html("");
    }
    
    var valid = true;
    if (!$('#FirstName').val()) {
        $('#valFN').html("**Please enter your first name");
        $('#valFN').prop("class", "validation");
        valid = false;
    }
    if (!$('#LastName').val()) {
        $('#valLN').html("**Please enter your last name");
        $('#valLN').prop("class", "validation");
        valid = false;
    }
    if (!$('#Phone').val()) {
        $('#valPh').html("**Please enter your phone number");
        $('#valPh').prop("class", "validation");
        valid = false;
    }
    if (!$('#Email').val()) {
        $('#valEm').html("**Please enter your email address");
        $('#valEm').prop("class", "validation");
        valid = false;
    }

    if (valid) {
        var coach = 'user=' +
                   JSON.stringify({
                       _id: userid,
                       FirstName: $.trim($('#FirstName').val().toLowerCase()),
                       LastName: $.trim($('#LastName').val().toLowerCase()),
                       Phone: $('#Phone').val(),
                       Email: $.trim($('#Email').val()),
                       Username: $.trim($('#username').val()),
                       Password: $.trim($('#password').val()),
                       CoachName: $.trim($('#ddcoaches option:selected').text().toLowerCase()),
                       CoachId: $('#ddcoaches option:selected').val()
                   });
        $.ajax({
            url: '../Assessment.svc/SaveUser',
            data: coach,
            contentType: "application/json;charset=utf-8",
            dataType: 'json',
            processData: true,
            success: function (data, status, xhr) {
                $("input").prop("disabled", true);
                $("#MyButton").prop("disabled", true);
                $('#thankYou').html('Thanks for entering your details <br />'
                                         );

                GetUserDetails("");
            },
            error: function (xhr, status, error) {
                alert('Error occurred: ' + error);
            }

        });
    }
//    else {
//        $('#thankYou').html("Please enter valid values");
//        $('#thankYou').prop("class", "validation");
//    }
}


/************************
      Get User Data
*************************/
function GetUserDetails(coachid) {
    $.ajax({
        url: '../Assessment.svc/GetUsers',
        data: "coachId=" + coachid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, xhr) {
            var mydata = data.d;
            mydata = '{"row":' + mydata + '}';
            //console.log(mydata);
            var myjson = JSON.parse(mydata);
            var month = currDate.getMonth() + 1;
            //first remove all the rows exept the first and then add rows
            $("#tblUsers").find("tr:gt(0)").remove();
            var userNo = 0;
            $.each(myjson.row, function (index, item) {

                userNo += 1;
                var jsonItem = JSON.stringify(item);
                var row;
                var rowDetail;
                var rowDetailStr = "";
                var assmLink = "";
                //If generate the assesment link depending on whether the user has taken the assessment
                if (item.assmId != "") {
                    assmLink = "</td><td align='center'> <button  id='editUser' class='aq-btn-edit teal' onclick='window.location=\"/AssessmentResult.htm?userid=" + item._id + "&coachid=" + coachid + "\"" + "'>Results</button></td>";
                }
                else {
                    assmLink = "</td><td align=center> Pending </td>"
                }


                if (coachid == "") { // no coach id - this is being called from AllUsers
                    row = $("<tr ><td style='text-transform: capitalize;'> " + item.FirstName + " " + item.LastName + "</td><td>" + item.Phone + "</td><td>" + item.Email + "</td><td style='text-transform: capitalize;'>" + item.CoachName + "</td><td>" + item.Username + "</td><td>" + item.Password + assmLink +"</td><td align=center> <img src='css/images/thin-002_write_pencil_new_edit-24.png' id='editUser' onclick='PopulateUserData(" + jsonItem + ")' alt='Edit'> </img> </td></tr>");
                }
                else {//users associated with a specific coach id

                    //row = $("<tr class='userDetailRow'><td style='text-transform: capitalize;'>" + item.FirstName + " " + item.LastName + "<span class='aq-btn-edit' onclick='GetTrackerDetails(" + "\"" + item.Username + "\"" + "," + "\"" + item.Password + "\"" + ")'>Details</span><div></div></td><td>" + item.Phone + "</td><td>" + item.Email + "</td><td>" + item.Username + "</td><td>" + item.Password + assmLink + "</tr>");
                    row = $("<tr class='userDetailRow'><td><img id='imgDetails' onClick='showHideDetails(); GetUserWWDetails(" + "\"" + item.Username + "\"" + "," + "\"" + item.Password + "\"" + ") ;toggleImageSrc()' src='../img/details_open.png'></img></td><td style='text-transform: capitalize;'>" + item.FirstName + " " + item.LastName + "<div></div></td><td>" + item.Phone + "</td><td>" + item.Email + "</td><td>" +"</td><td>" + assmLink + "</tr>");

                    rowDetail = $("<tr id='trDetails' style='display:none'><td id='tdTrackerDetails' colspan='3'><div id='divDetails'></div></td><td id='tdTrackerDetails' colspan='4'><div><img id='imgDetails' onClick='GetTrackerDetails() ;toggleImageSrc()' src='../img/details_open.png'></img>See tracker details</div><div id='divTrackerDetails'></div></td></tr>")
                }
                rowDetailStr = "<tr id='trDetails' style='display:none'>";
                rowDetailStr += "<td id='tdUserDetails' colspan='3'><div id='divDetails'></div></td>";
                //TD for points/food tracker deatils
                rowDetailStr += "<td id='tdTrackerDetails' colspan='4'>";
                rowDetailStr += "<div class='trkHeader'>";
                rowDetailStr += "<span id='spanTrkHeader'><img onclick='SetCurrDate(" + '\"subtract\"' + ")' src='../img/ArrowLeft.png' ></img><span id='currDateSpan'>" + weekday[currDate.getDay()] + ' ' + month + '/' + currDate.getDate() + "</span><img id='imgDatePicker' src='../img/calendar_sm.png'></img>&nbsp; <img onclick='SetCurrDate(" + '\"add\"' + ")' src='../img/ArrowRight.png' ></img></span>"; //date navigation
                rowDetailStr += "<img id='imgPPV' src='../img/PPV.png'></img>" //points plut tracker image
                rowDetailStr += "<span id='spanDaily'><table><tr><td>Daily Used</br><span id='spanDailyUsed'></span></td><td>Remaining</br><span id='spanDailyRemaining'></span></td><td>Wkly Remianing</br><span id='spanWeeklyRemaining'></span></td><td>Activity Earned</br><span id='spanActivity'></span></td></tr> </table></span>" //daily used
                rowDetailStr += "</div>"
                rowDetailStr += "<div id='divTrackerDetails'></div>";
                rowDetailStr += "</td></tr>";

                rowDetail = $(rowDetailStr);
                $("#tblUsers").append(row).append(rowDetail);
                $(".rows td").attr('class', 'tab-row');
            });

            //ToggleHover('#tblUsers tr');
        },
        error: function (xhr, status, error) {
            alert('Error occurred: ' + error);
            console.write(data);
        }

    });
}

function showHideDetails() {
    //console.log('clicked show/hide image');            
    //console.log($(event.target).closest('tr').next('tr').attr('id'));
    var detailTr = $(event.target).closest('tr').next('tr')
    detailTr.toggle();
    var currImg = $(event.target).attr('src');
    
}

function SetCurrDateSpan(date) {
    $('#currDateSpan').html(date);
}

          

$("#imgDatePicker").click(function () {
    console.log('button clicked');
    $(this).datepicker({
        altField: "#currDateSpan"
    });
});
   

    

function toggleImageSrc(){
    //console.log(event.target.id);
    //console.log($('#' + event.target.id).attr('src'));
    var currImg = $(event.target).attr('src');
    if (currImg == '../img/details_open.png') {
        $(event.target).attr('src', '../img/details_close.png')
    } else {
        $(event.target).attr('src', '../img/details_open.png')
    }
}

function formatDate(d) {
    var dd = d.getDate()
    if (dd < 10) dd = '0' + dd

    var mm = d.getMonth() + 1
    if (mm < 10) mm = '0' + mm

    var yy = d.getFullYear()


    return yy + '-' + mm + '-' + dd + 'T00:00:00';
}




function SetCurrDate(change) {
    //console.log('called SetCurrDate');
    $('#divTrackerDetails').html("<img height='30' width='30' align='bottom' src='../img/loading.gif'></img>");
    if (change == 'add') {
        currDate.setDate(currDate.getDate() + 1);
    } else {
        currDate.setDate(currDate.getDate() - 1);
    }
    //console.log(currDate);
    var month = currDate.getMonth() + 1;
    SetCurrDateSpan(weekday[currDate.getDay()] + ' ' + month + '/' + currDate.getDate());
    GetTrackerDetails(currDate);
   
}

function GetUserWWDetails(username, password) {
    var loginInfo = { "U": username, "P": password, "R": "true" };
    var detailDiv = $(event.target).closest('tr').next('tr').find('#divDetails');
    console.log(loginInfo);
    $.ajax({
        url: 'https://mobile.weightwatchers.com/authservice.svc/login',
        type: "POST",
        data: JSON.stringify(loginInfo),
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: false,
        success: function (data, status, xhr) {
            var row = "";
            console.log(JSON.stringify(data.LoginSuccessful));
            if (JSON.stringify(data.LoginSuccessful) == 'true') {
                //$.each(data.UserInformation, function (index, item) {
                //    row += '<span>' + index + " = " + item + "</span><br>";
                //});

                row += '<span style="margin-left:20px">' + "Age : " + data.UserInformation.Age + "</span><br>";
                row += '<span style="margin-left:20px">' + "Gender  : " + data.UserInformation.Gender + "</span><br>";
                row += '<span style="margin-left:20px">' + "Height  : " + data.UserInformation.Height + "</span><br>";
                row += '<span style="margin-left:20px">' + "Weight   : " + data.UserInformation.Weight + "</span><br>";
                row += '<span style="margin-left:20px">' + "MinSafeWeight  : " + data.UserInformation.MinSafeWeight + "</span><br>";
                row += '<span style="margin-left:20px">' + "MaxSafeWeight  : " + data.UserInformation.MaxSafeWeight + "</span><br>";

                
                detailDiv.html(row);
            } else {
                detailDiv.html((data.Message));
            }
        },
        error: function (xhr) {
            alert('Error occurred: ' + error);
        },
        complete: function () {
            GetTrackerDetails(currDate);
            
        }
    });
}



var dailyUsed;
var dailyRemaining;
var weeklyRemaining;
var activityEarned;
var trackerData;

function GetTrackerDetails(date) {
    var start = new Date().getTime();

  
    //set the tracker date
    var trackerDate;  //2014-04-11T00:00:00    
    if (!date) {
        trackerDate = formatDate(currDate);
    } else {
        trackerDate = formatDate(date);
    }
    //console.log('trackerDate = ' + trackerDate);


    $.ajax({
        url: 'https://mobile.weightwatchers.com/TrackerService.svc/',
        type: "POST",
        data: JSON.stringify({ "Date": formatDate(currDate) }),// "2014-04-10T00:00:00"
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: false,
        success: function (data, status, xhr) {
            trackerData = data.PointsPlusTracker;
            //console.log(data);
            var end = new Date().getTime();
            var time = end - start;
            //alert('Execution time: ' + time);

            displayTrackerInfo(trackerData);
            
        },
        error: function (xhr) {
            alert('Error occurred: ' + error);
        }

    });
}


function displayTrackerInfo(trackerData) {
    $('#divTrackerDetails').html("");
    var foodTrackerData = trackerData.FoodTracker.TimeToFoodEntry;
    var pointsTrackerData = trackerData.PointsTracker;
    //console.log(pointsTrackerData);
    //Set the points tracker values


    dailyUsed = pointsTrackerData.DailyUsed;
    dailyRemaining = pointsTrackerData.DailyRemaining;
    weeklyRemaining = pointsTrackerData.WeeklyRemaining;
    activityEarned = pointsTrackerData.ActivityEarned;

    $("#spanDailyUsed").html(dailyUsed );
    $("#spanDailyRemaining").html(dailyRemaining );
    $("#spanWeeklyRemaining").html(weeklyRemaining);
    $("#spanActivity").html(activityEarned );



    var trackerRow = "";
    if (foodTrackerData.length > 0) {
        $.each(foodTrackerData, function (index, item) {
            trackerRow += "<span id='trackTimeHeader'>" + item.Key + "</span><br>";

            $.each(item.Value, function (idx, trackerItem) {
                trackerRow += "<div class='trackerItemDetail'><span>" + trackerItem.ServingSize + " " + trackerItem.ServingType + "</span><span>" + trackerItem.Name + "</span><span>" + trackerItem.Points + "</span></div></br>"
            });
        });
    } else {
        trackerRow += '<span></br>' + "No tracking data for this date" + "</span><br>";
    }

    $('#divTrackerDetails').html(trackerRow);
}

//populate coach dropdown on user info form
function PopulateCoachDD() {
    $.ajax({
        url: '../Assessment.svc/GetCoaches',

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, xhr) {

            var mydata = data.d;
            mydata = '{"row":' + mydata + '}';

            var myjson = JSON.parse(mydata);


            $.each(myjson.row, function (index, item) {

                var jsonItem = JSON.stringify(item);
                if (!item.Obsolete || item.Obsolete=="false") {                
                    $("#ddcoaches").append($("<option>").val(item._id).text(item.FirstName + " " + item.LastName));
                }

            });
        },
        error: function (xhr, status, error) {
            alert('Error occurred: ' + error);
            console.write(data);
        }

    });
}

//called from edit button
function PopulateUserData(user) {
    $("#tblNewUser").show();
    $("#MyButton").prop("disabled", false);
    $("input").prop("disabled", false);
    $('#FirstName').val(user.FirstName);
    $('#LastName').val(user.LastName);
    $('#Phone').val(user.Phone);
    $('#Email').val(user.Email);
    $('#username').val(user.Username);
    $('#password').val(user.Password);

    $('#ddcoaches option:selected').text(user.CoachName);
    $('#ddcoaches option:selected').val(user.CoachId);
    
    userid = user._id;
}

function ClearUserData() {
    $("#tblNewUser").show();
    $("#MyButton").prop("disabled", false);
    $("input").prop("disabled", false);
    $('#FirstName').val("");
    $('#LastName').val("");
    $('#Phone').val("");
    $('#Email').val("");
    $('#username').val("");
    $('#password').val("");

    $('#ddcoaches option:selected').text("");
    $('#ddcoaches option:selected').val(0);
    
    userid="";
}

function ToggleHover(item) {
    $(item).hover(function () {
        $(this).toggleClass('LightHighlight');
    });


}
function ValidateUser() {
    //get admin user id from querystring
    var adminid = "";
    adminid = $.QueryString("adminid");
    //alert(adminid);
    if (adminid == null) {
      //  alert("userid is null");
        window.location.replace("/assessment.htm")
    }
    else {
        $.ajax({
            url: '../Assessment.svc/ValidateAdminUser',
            data: "userid=" + adminid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, xhr) {
                var jsonData = $.parseJSON(data.d);
                //alert(jsonData);
                if (jsonData) {
                    $("#body").attr('class', '');
                }
                else {
                    window.location.replace("/assessment.htm");
                }
            },
            error: function (xhr, status, error) {
                alert('Error occurred: ' + error);
            }
        });
    }
}

