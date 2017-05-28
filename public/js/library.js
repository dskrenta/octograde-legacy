/*
 *	Library.js
 */

//window.appUrl = "http://octograde.com/";
window.appUrl = "http://" + window.location.host + "/";

function formatTimestamp(input)
{
	var d = new Date(input);
	return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
}

function help()
{
	mixpanel.track("Help modal");
	$('#modalHelp').modal('show');
}

function deleteAccountModal()
{
	$('#modalHelp').modal('toggle');
	$('#modalDeleteAccount').modal('show');
}

function deleteAccount()
{
	var user = JSON.parse(window.atob(localStorage.getItem("user")));
        var uuid = user.uuid;

	$.post(
                window.appUrl + "teacher/deleteAccount",
                {
                        uuid: uuid
                },
                function(data)
		{
			if(data == "false")
			{
				error("An error occurred. Please try again.");
			}
			else if(data == "nobSub")
			{
				error("You do not have an Octograde subscription to cancel.");
			}
			else
			{
				signOut();
			}
		}
	);
}

function guid()
{
	function s4()
	{
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  	}
  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function yearFooter()
{
	var d = new Date();
        var n = d.getFullYear();
      	document.getElementById("date").innerHTML = n;
}

function renderButton()
{
	gapi.signin2.render('my-signin2',
	{
        	'scope': 'https://www.googleapis.com/auth/plus.login',
        	'width': 200,
        	'height': 50,
        	'longtitle': false,
        	'theme': 'dark',
        	'onsuccess': onSuccess,
        	'onfailure': onFailure
      	});
}

function renderButton2()
{
        gapi.signin2.render('my-signin3',
        {
                'scope': 'https://www.googleapis.com/auth/plus.login',
                'width': 200,
                'height': 50,
                'longtitle': false,
                'theme': 'dark',
                'onsuccess': onSuccess2,
                'onfailure': onFailure
        });
}

function renderButton3()
{
        gapi.signin2.render('my-signinHighSchoolLanding',
        {
                'scope': 'https://www.googleapis.com/auth/plus.login',
                'width': 200,
                'height': 50,
                'longtitle': false,
                'theme': 'dark',
                'onsuccess': onSuccess3,
                'onfailure': onFailure
        });
}

function onSuccess2(googleUser)
{
	profile = googleUser.getBasicProfile();

        var user = {
                uuid: window.btoa(profile.getEmail()),
                name: profile.getName(),
                email: profile.getEmail(),
                image_url: profile.getImageUrl(),
                timestamp: Date(),
                type: null,
                tests: null
        };

	mixpanel.identify(window.btoa(profile.getEmail()));

	mixpanel.people.set({
                "$last_login": new Date()
        });

        var userTrans = JSON.stringify(user);

        var uuid = window.btoa(profile.getEmail());

        $.post(
                window.appUrl + "user",
                {
                        user: userTrans,
                        uuid: uuid
                },
                function(data)
                {
                        if(data == "false")
                        {
				mixpanel.track("New higher-ed teacher sign in");
                        	setType(1, false);
			}
			else
                        {
                                var convertedData = {"uuid": data["uuid"], "name": data["name"], "email": data["email"], "type": data["type"], "image_url": data["image_url"], "pro": data["pro"]};
                                localStorage.setItem("user", window.btoa(JSON.stringify(convertedData)));
                                console.log(data["type"]);
                                if(data["type"] == 0)
                                {
                                        window.location = window.appUrl + "student";
                                }
                                else
                                {
                                        window.location = window.appUrl + "teacher";
                                }
                        }
                }
        );
}

function onSuccess3(googleUser)
{
        profile = googleUser.getBasicProfile();

        var user = {
                uuid: window.btoa(profile.getEmail()),
                name: profile.getName(),
                email: profile.getEmail(),
                image_url: profile.getImageUrl(),
                timestamp: Date(),
                tests: null,
		type: 1
        };

        mixpanel.identify(window.btoa(profile.getEmail()));

        mixpanel.people.set({
                "$last_login": new Date()
        });

        var userTrans = JSON.stringify(user);

        var uuid = window.btoa(profile.getEmail());

        $.post(
                window.appUrl + "checkUser",
                {
                        user: userTrans,
                        uuid: uuid
                },
                function(data)
                {
                        if(data == "false")
                        {
                                //mixpanel.track("New high-school teacher sign in");
                                //setType(1, true);

				//window.email = data["email"];
				window.newUser = user;
                            	$('#myTeacherRegisterModal').modal('show');
                        }
                        else
                        {
                                var convertedData = {"uuid": data["uuid"], "name": data["name"], "email": data["email"], "type": data["type"], "image_url": data["image_url"], "pro": data["pro"]};
                                localStorage.setItem("user", window.btoa(JSON.stringify(convertedData)));
                                console.log(data["type"]);
                                if(data["type"] == 0)
                                {
                                        window.location = window.appUrl + "student";
                                }
                                else
                                {
                                        window.location = window.appUrl + "teacher";
                                }
                        }
		}
	);
}

function setLocalStorage(user)
{
	var convertedData = {"uuid": user.uuid, "name": user.name, "email": user.email, "type": user.type, "image_url": user.image_url};
       	localStorage.setItem("user", window.btoa(JSON.stringify(convertedData)));
}

function onSuccess(googleUser)
{
	profile = googleUser.getBasicProfile();

	var user = {
        	uuid: window.btoa(profile.getEmail()),
             	name: profile.getName(),
             	email: profile.getEmail(),
          	image_url: profile.getImageUrl(),
		timestamp: Date(),
               	type: null,
             	tests: null
      	};

	mixpanel.identify(window.btoa(profile.getEmail()));

	mixpanel.people.set({
		"$last_login": new Date()
       	});

	var userTrans = JSON.stringify(user);

	var uuid = window.btoa(profile.getEmail());

	$.post(
		window.appUrl + "user",
		{
			user: userTrans,
			uuid: uuid
		},
		function(data)
		{
			if(data == "false")
			{
				document.getElementById("name").innerHTML = profile.getName();
				$('#myRegisterModal').modal('show');
			}
			else
			{
				var convertedData = {"uuid": data["uuid"], "name": data["name"], "email": data["email"], "type": data["type"], "image_url": data["image_url"], "pro": data["pro"]};
				localStorage.setItem("user", window.btoa(JSON.stringify(convertedData)));
				console.log(data["type"]);
				if(data["type"] == 0)
				{
					mixpanel.track("Student sign in");
					window.location = window.appUrl + "student";
				}
				else
				{
					mixpanel.track("Teacher sign in");
					window.location = window.appUrl + "teacher";
				}
			}
		}
	);
}

function onFailure(error)
{
	mixpanel.track("Google sign in error");
	console.log(error);
	error("Failed to Sign In. Please try again.");
}

function setType(type, pay)
{
	$.post(
        	window.appUrl + "type",
		{
                	type: type,
			uuid: window.btoa(profile.getEmail()),
              	},
               	function(data)
               	{
			if(data != "false")
			{
				mixpanel.people.set({
					"$name": data["name"],
                			"$email": data["email"],
                			"$created": data["timestamp"],
                			"uuid": data["uuid"],
                			"type": type,
					"pay": pay,
					"profile_img": data["image_url"]
        			});

				var convertedData = {"uuid": data["uuid"], "name": data["name"], "email": data["email"], "type": data["type"], "image_url": data["image_url"]};
				localStorage.setItem("user", window.btoa(JSON.stringify(convertedData)));
				if(type == 0 && pay == true)
				{
					window.email = data["email"];
					window.type = data["type"];
					$('#myRegisterModal').modal('hide');
					$('#myStudentRegisterModal').modal('show');
				}
				else if(type == 1 && pay == true)
                                {
                                        window.email = data["email"];
					window.type = data["type"];
					$('#myRegisterModal').modal('hide');
                                        $('#myTeacherRegisterModal').modal('show');
                                }
				else if(type == 0)
				{
					mixpanel.track("Student sign up");
					window.location = window.appUrl + "student";
				}
				else
				{
					mixpanel.track("Teacher sign up");
					window.location = window.appUrl + "teacher";
				}
			}
			else
			{
				alert("error");
			}
		}
	);
}


function signOut()
{
	mixpanel.track("Sign out");

	var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function ()
        {
        	console.log('User signed out.');
      	});

	localStorage.removeItem("user");
	window.location = window.appUrl;
}

function onLoad()
{
	gapi.load('auth2',
		function()
		{
       			gapi.auth2.init();
      		}
	);
}

var count = 2;

function addQuestion()
{
	mixpanel.track("Question added");

	var html = "<div class=\"card question\"><div style=\"margin:20px 0px;\" class=\"card-header\"><div style=\"height: 31px;\" class=\"navLeft\"><h2 class=\"vCenter\">Question " + count + "</h2></div><div class=\"navRight\"><div class=\"dInline\"><span class=\"replace" + count + "\"><button style=\"margin-right:10px;\" class=\"btn btn-default btn-icon-text noShad btnBor addAnswer\" onclick=\"addAnswer(" + count + ", 4);\">Add <i class=\"zmdi zmdi-plus noMarR\"></i></button></span><span class=\"delete" + count + "\"><button style=\"margin-right:10px;\" class=\"btn btn-default btn-icon-text noShad btnBor\" onclick=\"deleteAnswer(" + count + ", 4);\">Delete <i class=\"zmdi zmdi-close noMarR\"></i></button></span></div><select class=\"selectpicker dInline\" id=\"answer_" + count + "\"><option value=\"hide\">Correct Answer </option><option rel=\"icon-temperature\" id=\"option_" + count + "_1\" value=\"1\">1</option><option rel=\"icon-temperature\" id=\"option_" + count + "_2\" value=\"2\">2</option><option rel=\"icon-temperature\" id=\"option_" + count + "_3\" value=\"3\">3</option><option rel=\"icon-temperature\" id=\"option_" + count + "_4\" value=\"4\">4</option></select></div></div><div class=\"card-body card-padding\"><div class=\"row\"><div class=\"col-sm-6\"><div class=\"summernote\" id=\"question_" + count + "\"></div></div><div class=\"col-sm-6\"><div class=\"form-group createA set_" + count + "\"><input type=\"text\" class=\"placePad form-control\" id=\"answer_" + count + "_1\" placeholder=\"Answer 1\"></div><div class=\"form-group createA set_" + count + "\"><input type=\"text\" class=\"placePad form-control\" id=\"answer_" + count + "_2\" placeholder=\"Answer 2\"></div><div class=\"form-group createA set_" + count + "\"><input type=\"text\" class=\"placePad form-control\" id=\"answer_" + count + "_3\" placeholder=\"Answer 3\"></div><div class=\"form-group createA set_" + count + "\"><input type=\"text\" class=\"placePad form-control\" id=\"answer_" + count + "_4\" placeholder=\"Answer 4\"></div></div></div></div></div>";

	$(html).insertAfter(".question:last");
	$('.summernote').summernote();
	count ++;
}

function deleteQuestion()
{
	mixpanel.track("Question deleted");

	if($(".question").length > 1)
	{
		$(".question:last").remove();
		count --;
	}
}

function addAnswer(questionNumber, answerNumber)
{
	mixpanel.track("Answer added");

	answerNumber++;

	var html = "<div class=\"form-group createA set_" + questionNumber + "\"><input type=\"text\" class=\"placePad form-control\" id=\"answer_" + questionNumber + "_" + answerNumber + "\" placeholder=\"Answer " + answerNumber + "\"></div>";

	$(html).insertAfter(".set_" + questionNumber + ":last");

	var extraOption = "<option rel=\"icon-temperature\" id=\"option_" + questionNumber + "_" + answerNumber + "\" value=\"" + answerNumber + "\">" + answerNumber + "</option>";
	$(extraOption).insertAfter("#option_" + questionNumber + "_" + (answerNumber - 1));

	$(".replace" + questionNumber).replaceWith("<span class=\"replace" + questionNumber + "\"><button style=\"margin-right:10px;\" class=\"btn btn-default btn-icon-text noShad btnBor addAnswer\" onclick=\"addAnswer(" + questionNumber + ", " + answerNumber + ");\">Add <i class=\"zmdi zmdi-plus noMarR\"></i></button></span>");

	$(".delete" + questionNumber).replaceWith("<span class=\"delete" + questionNumber + "\"><button style=\"margin-right:10px;\" class=\"btn btn-default btn-icon-text noShad btnBor deleteAnswer\" onclick=\"deleteAnswer(" + questionNumber + ", " + answerNumber + ");\">Delete <i class=\"zmdi zmdi-close noMarR\"></i></button></span>");

	var currentHeight = $("#question_" + questionNumber).height();
	var newHeight = currentHeight + 42;
	$("#question_" + questionNumber).height(newHeight);
}

function deleteAnswer(questionNumber, answerNumber)
{
	mixpanel.track("Answer deleted");

	if(answerNumber > 2)
	{
		$(".set_" + questionNumber + ":last").remove();
		var selector = "#option_" + questionNumber + "_" + answerNumber;
		$(selector).remove();

		answerNumber--;

		$(".delete" + questionNumber).replaceWith("<span class=\"delete" + questionNumber + "\"><button style=\"margin-right:10px;\" class=\"btn btn-default btn-icon-text noShad btnBor\" onclick=\"deleteAnswer(" + questionNumber + ", " + answerNumber + ");\">Delete <i class=\"zmdi zmdi-close noMarR\"></i></button></span>");

		$(".replace" + questionNumber).replaceWith("<span class=\"replace" + questionNumber + "\"><button style=\"margin-right:10px;\" class=\"btn btn-default btn-icon-text noShad btnBor addAnswer\" onclick=\"addAnswer(" + questionNumber + ", " + answerNumber + ");\">Add <i class=\"zmdi zmdi-plus noMarR\"></i></button></span>");

        	var currentHeight = $("#question_" + questionNumber).height();
		var newHeight = currentHeight - 42;
		$("#question_" + questionNumber).height(newHeight);
	}
}

function createTest()
{
	mixpanel.track("Test created");

	var arr = [];
	var testId = guid().substring(0, 7);
	var number = 1;
	var timestamp = new Date();
	var user = window.atob(localStorage.getItem("user"));
	user = JSON.parse(user);
	var uuid = user.uuid;
	var filled = true;

	var info = {"testID": testId, "testTitle": $("#test_title").val(), "testTimestamp": Date(), "testDuration": $("#test_duration").val(), "uuid": uuid};
	arr.push(info);

	if($("#test_title").val() == "" || $("#test_duration").val() == "")
	{
		filled = false;
	}

	while($("#question_" + number).length)
	{
		var questionInfo = {};

		var innerSelector = "question_" + number;
		//var question = {[innerSelector]: $("#question_" + number).val()};
		var question = {};
		//question[innerSelector] = $("#question_" + number).val();
		question[innerSelector] = $("#question_" + number).summernote('code');
		jQuery.extend(questionInfo, question);

		/*
		if($("#question_" + number).val() == "")
		{
			filled = false;
		}
		*/

		if($("#question_" + number).summernote('code') == "")
		{
			filled = false;
		}

		var count = 1;

		while($("#answer_" + number + "_" + count).length)
		{
			var tempName = "answer" + count;
			//var answerPart = {[tempName]: $("#answer_" + number + "_" + count).val()};
			var answerPart = {};
			answerPart[tempName] = $("#answer_" + number + "_" + count).val();
			if($("#answer_" + number + "_" + count).val() == "")
			{
				filled = false;
			}
			jQuery.extend(questionInfo, answerPart);
			count ++;
		}

		var correctAnswer = {correctAnswer: $("#answer_" + number).val()};
		jQuery.extend(questionInfo, correctAnswer);

		//console.log($("#answer_" + number).val());

		if($("#answer_" + number).val() == "hide")
		{
			filled = false;
		}

		arr.push(questionInfo);

		number ++;
	}

	var json = JSON.stringify(arr);

	if(filled)
	{
		$("#createTestButton").attr("disabled", "disabled");

		$.post(
			window.appUrl + "teacher/test",
			{
				uuid: uuid,
				test: json,
				timestamp: timestamp,
				active: true,
				testID: testId,
				testTitle: $("#test_title").val(),
				testDuration: $("#test_duration").val()
			},
			function(data)
			{
				if(data != "false")
				{
                                	window.location = window.appUrl + "teacher";
				}
				else
				{
					$("#createTestButton").removeAttr("disabled");
					error("An error occurred, please try again");
				}
			}
		);
	}
	else
	{
		error("One or more inputs were left blank");
	}
}

function changeState(selector)
{
	mixpanel.track("State change");

	var testID = $(selector).attr("testid");
	var user = JSON.parse(window.atob(localStorage.getItem("user")));

	console.log(selector);
	console.log(testID);

	$.post(
		window.appUrl + "teacher/changeState",
		{
			testID: testID,
			uuid: user.uuid
		},
		function(data)
		{
			if(data != "false")
			{
				console.log("State Changed");
			}
			else
			{
				alert("Unable to change state");
			}
		}
	);
}

function displayToolbar()
{
	var user = JSON.parse(window.atob(localStorage.getItem("user")));
	document.getElementById("nameHead").innerHTML = user.name;
	if(user.image_url)
	{
		$("#profileImage").attr("src", user.image_url);
	}
	else
	{
		$("#profileImage").attr("src", "/images/pic.jpeg");
	}
}

var times = 0;

function listTestsTeacher()
{
	var user = JSON.parse(window.atob(localStorage.getItem("user")));
	$.post(
		window.appUrl + "teacher/listTests",
                {
                        uuid: user.uuid
                },
                function(data)
                {
                        if(data != "false")
                        {
				var html;
				var count = 0;

				var tests = JSON.parse(data["tests"]);

				if(tests.constructor !== Array)
				{
					tests = [tests];
				}

				if(tests.length == 0)
				{
					html += "<h3>Hooray, no tests yet!</h3>";
				}
				else
				{
					for(var i = tests.length; i-- > 0; )
					{
						var attr = "";
						var increment = "Minutes";

						if(tests[i]["active"] == "true")
						{
							attr = "checked";
						}

						if(tests[i]["testDuration"] == 1)
						{
							increment = "Minute";
						}

						var subHtml = "<tr>"+
                                            	"<td>" + tests[i]["testTitle"] + "</td>"+
                                             	"<td>" + tests[i]["testID"] + "</td>"+
						"<td><a href=\"/teacher/stats?id=" + tests[i]["testID"] + "\"><span style=\"color:#3498db;\">Results</span></a></td>"+
                                              	"<td>" + tests[i]["testDuration"] + " " + increment + "</td>"+
						"<td>" + formatTimestamp(tests[i]["timestamp"]) + "</td>"+
                                               	"<td>"+
                                                	"<div class=\"toggle-switch\" data-ts-color=\"green\">"+
                                                		"<input id=\"ts" + count + "\" testid=\"" + tests[i]["testID"] + "\" onclick=\"changeState(ts" + count + ");\" type=\"checkbox\" hidden=\"hidden\"" + attr + ">"+
                                                            	"<label for=\"ts" + count + "\" class=\"ts-helper\"></label>"+
                                                 	"</div>"+
                                            	"</td>"+
                                                "</tr>";

						html += subHtml;
						count++;
					}
					$("tr:last").after(html);
				}
			}
                        else
                        {
                                error("Problem loading tests. Please reload the page.");
                        }
                }

	);

	times ++;
}

function listTestsStudent()
{
	var user = JSON.parse(window.atob(localStorage.getItem("user")));
        $.post(
                window.appUrl + "student/listTests",
                {
                        uuid: user.uuid
                },
                function(data)
                {
			if(data != "false")
			{
				var html;
				var tests = JSON.parse(data["tests"]);

				if(tests.constructor !== Array)
                               	{
                                       	tests = [tests];
                               	}
                               	if(tests.length == 0)
                               	{
                                       	html += "<h3>Hooray, no tests yet!</h3>";
                               	}
                           	else
                               	{
                                       	for(var i = tests.length; i-- > 0; )
                                      	{
						var subHtml = "<tr>"+
                                               	"<td>" + tests[i]["title"] + "</td>"+
                                               	"<td>" + tests[i]["percentage"] + "%</td>"+
						"<td>" + tests[i]["correct"] + "/" + tests[i]["total"] + "</td>"+
						"<td>" + "<a href=\"student/review?id=" + tests[i]["testID"] + "\"><span style=\"color:#3498db;\">Test Review</span></a>" + "</td>"+
						"<td>" + formatTimestamp(tests[i]["timestamp"]) + "</td>"+
                                               	"</tr>";

                                               	html += subHtml;
					}
				}
				$("tr:last").after(html);
			}
			else
			{
				error("Problem loading tests. Please reload the page.");
			}
		}
	);

}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function displayTestForEdit()
{
        var testID = getUrlParameter('id');
        var user = JSON.parse(window.atob(localStorage.getItem("user")));

	 $.post(
         	window.appUrl + "teacher/getTest",
              	{
                	testID: testID
            	},
           	function(data)
           	{
			var testData = JSON.parse(data);

			if(test["uuid"] != user.uuid)
			{
				error("You do not have permission to edit this test.");
			}
			else
			{
				var test = testData["test"];

				for(var i = 0; i < test.length; i++)
				{

				}
			}
		}
	);
}

function displayGradeData()
{
	var testID = getUrlParameter('id');
	var user = JSON.parse(window.atob(localStorage.getItem("user")));

	$.post(
                window.appUrl + "teacher/gradeData",
                {
                        testID: testID,
			uuid: user.uuid
                },
                function(data)
                {
                        if(data == "false")
                        {
                        	error("Please try again.");
			}
                        else if(data == "invalid")
                        {
                                error("You are not authorized to view this data");
                        }
			else if(typeof data.grades === 'undefined')
			{
				//error("Results not avaliable yet.");
				$("#gradeData").html("<center><h1 style=\"font-family:'Roboto';font-weight:100;color:#4d4d4d;\">Results not avaliable yet</h1></center>");
			}
			else
			{
				console.log(typeof data);

				var sumGrades = 0;
				var totalGrades = data.grades.length;

				var html = "<div class=\"col-sm-12\"><div class=\"card\"><div class=\"card-header\"><h2>Student List<small>Here is a list of everyone who has ever taken your test</small></h2></div><div class=\"table-responsive\"><table class=\"table table-hover\"><thead><tr><th>#</th><th>Name</th><th>Percentage</th><th>Score</th><th>Times Left Window</th></tr></thead><tbody>";

				for(i = 0; i < data.grades.length; i++)
				{
					var attr = "";
					var num = i + 1;
					var gradeData = JSON.parse(data.grades[i]);
					sumGrades += gradeData.percentage;
					if(gradeData.cheat == 1)
					{
						attr = "warning";
					}
					else if(gradeData.cheat >= 2)
					{
						attr = "danger";
					}
					html += "<tr class=\"" + attr + "\"><td>" + num + "</td><td>" + gradeData.name  + "</td><td>" + gradeData.percentage + "%</td><td>" + gradeData.correct + "/" + gradeData.total + "</td><td>" + gradeData.cheat + "</td></tr>";
				}

				var averageGrade = (sumGrades / totalGrades);
				var roundedAverageGrade = +((averageGrade).toFixed(2));

				var html2 = "<div class=\"col-sm-12\"><div class=\"card\"><div class=\"card-header\"><center><h2>" + data.title + "</h2></center></div></div></div>";

				html2 += "<div class=\"col-sm-12\"><div class=\"card\"><div class=\"card-body card-padding\"><div style=\"display: inline-block ;width: 200px\"><h4 class=\"progress-words\">Average Grade: " + roundedAverageGrade + "%</h4></div><div class=\"progress progress-striped tall-progress vCenter2 time-progress\"><div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"" + roundedAverageGrade + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: " + roundedAverageGrade + "%;\"><span class=\"sr-only\">" + roundedAverageGrade + "% Complete</span></div></div></div></div></div>";

				html += "</tbody></table></div></div></div>";

				$("#gradeData").html(html2 + html);
			}
                }
        );
}

function showTestID(testID)
{
	var html = "<h3>" + testID + "</h3>";
	console.log(html);
	$("#testID").html(html);
	$("#modalShowTestID").modal('show');
}

function testOnload()
{
	$("#modalStartTest").modal('show');
}

var testStarted = false;

function beginTest()
{
	mixpanel.track("Taking a test");

	testStarted = true;

	$.get(
                window.appUrl + "student/test/data",
                function(data)
                {
			window.test = data;
			window.cheat = 0;
			var numMinutes = 60 * data.testDuration,
        		display = document.querySelector('#time');
        		startTimer(numMinutes, display);
                        displayQuestions2();
                }
        );
}

function endTest()
{
	mixpanel.track("Submitting a test");

	$("#endTestButton").attr("disabled", "disabled");

	var innerGradeData = {};
	var total = 0;
	var correct = 0;
	var score = 0;
	var percentage = 0;
	var testID = window.test[0].testID;

	var user = JSON.parse(window.atob(localStorage.getItem("user")));
	innerGradeData["testID"] = testID;
	innerGradeData["uuid"] = user.uuid;

	for(var i = 1; i < window.test.length; i++)
	{
		total ++;

		var correctAnswer = window.test[i]["correctAnswer"];
		var formSelector = "#answerForm_" + i;
		var inputAnswer = $('input[type=radio]:checked', formSelector).val();

		var index1 = "inputAnswer" + i;
		var index2 = "correctAnswer" + i;
		innerGradeData[index1] = inputAnswer;
		innerGradeData[index2] = correctAnswer;

		if(correctAnswer == inputAnswer)
		{
			correct ++;
		}
	}

	score = correct / total;
	var roundedScore = +((score).toFixed(2));
	percentage = +((score * 100).toFixed(2));

	innerGradeData["total"] = total;
	innerGradeData["correct"] = correct;
	innerGradeData["score"] = roundedScore;
	innerGradeData["percentage"] = percentage;
	innerGradeData["name"] = user.name;
	innerGradeData["timestamp"] = Date();
	innerGradeData["title"] = window.test[0].testTitle;
	innerGradeData["cheat"] = window.cheat;

	var teacherUUID = window.test[0].uuid;

	$.post(
                window.appUrl + "student/gradeTest",
                {
                        uuid: user.uuid,
			gradeData: JSON.stringify(innerGradeData),
			testID: testID,
			teacherUUID: teacherUUID,
			title: window.test[0].testTitle
                },
                function(data)
                {
			if(data == "true")
			{
				window.cheat = 0;
				window.location = window.appUrl + "student";
			}
			else
			{
				$("#endTestButton").removeAttr("disabled");
				error("Problem grading test. Tests can only be taken once, however if this is your first time try resubmitting.");
			}
		}
	);
}

function displayQuestions()
{
	var user = JSON.parse(window.atob(localStorage.getItem("user")));
	var testID = getUrlParameter('id');

	$.post(
                window.appUrl + "student/listTests",
                {
                        uuid: user.uuid
                },
                function(data)
                {
			var tests = JSON.parse(data["tests"]);

                      	for(var i = 0; i < tests.length; i++)
                    	{
				if(tests[i]["testID"] == testID)
				{
					window.gradeData = tests[i];
					break;
				}
                     	}

			$.post(
                		window.appUrl + "student/getTest",
                		{
                        		testID: testID
               	 		},
                		function(data)
                		{
                        		var result = JSON.parse(data["test"]);
					var active = JSON.parse(data["active"]);

					if(active == false)
					{
                        			var questionsHtml = "";
                        			var navHtml = "";

                       	 			for(var i = 1; i < result.length; i++)
                        			{
                                			var attr = "";
                                			var index = "question_" + i;
							var colorClass = "";

							if(i == 1)
                                                	{
                                                        	attr = "active";
                                                        	navHtml += "<li class=\"active\"><a href=\"#question_1\" aria-controls=\"question_1\" role=\"tab\" data-toggle=\"tab\">1</a></li>";
                                                	}
                                                	else
                                                	{
                                                        	navHtml += "<li><a href=\"#question_" + i + "\" aria-controls=\"question_" + i + "\" role=\"tab\" data-toggle=\"tab\">" + i + "</a></li>";
                                                	}

                                			var html = "<div role=\"tabpanel\" class=\"tab-pane " + attr + "\" id=\"question_" + i + "\"><div class=\"row\"><div class=\"col-sm-6\"><div class=\"card testCard\"><div class=\"card-header ch-alt\"><h2>Question " + i + "</h2></div><div class=\"card-body card-padding\"><p class=\"lead\">" + result[i][index] + "</p></div></div></div><div class=\"col-sm-6\"><div class=\"card testCard\"><div class=\"card-header ch-alt\"><h2>Answers</h2></div><div class=\"card-body card-padding\"><form id=\"answerForm_" + i + "\">";

                                			var count = 1;

                                			var inputSelector = "inputAnswer" + i;
                                			var correctSelector = "correctAnswer" + i;

							while(true)
                                			{
                                        			var index = "answer" + count;

                                        			if(result[i][index])
                                        			{
                                                			var attr = "";
									var checked = "";

                                                			if(window.gradeData[correctSelector] == window.gradeData[inputSelector] && window.gradeData[correctSelector] == count)
                                                			{
                                                        			attr = "<div class=\"correctanswer navRight\"><i class=\"fa fa-check\"></i></div>";
                                                				checked = "checked";
										colorClass = "correctLabel";
									}
                                                			else
                                                			{
                                                        			if(count == window.gradeData[inputSelector])
                                                        			{
                                                                			attr = "<div class=\"wronganswer navRight\"><i class=\"fa fa-times fa-lg\"></i></div>";
                                                        				checked = "checked";
											colorClass = "incorrectLabel";
										}
                                                        			else if(count == window.gradeData[correctSelector])
                                                        			{
                                                                			attr = "<div class=\"correctanswer navRight\"><i class=\"fa fa-check\"></i></div>";
										}
                                                			}

                                                			html += "<div class=\"radio m-b-15 answerBor\"><label class=\"answerLabel\"><input disabled " + checked + " type=\"radio\" name=\"sample\" id=\"answer_" + i + "\" value=\"" + count + "\"><i class=\"input-helper\"></i>" + result[i][index] + "</label>" + attr + "</div>";

                                                			count ++;
                                        			}
                                        			else
                                        			{
                                                			break;
                                       	 			}
                                			}

                                			html += "</form></div></div></div></div></div>";

                                			questionsHtml += html;
                        			}

                        			$(".tab-content").html(questionsHtml);
                        			$("#questionTabs").html(navHtml);
					}
					else
					{
						error("Test review not avaliable yet because the test is still active. Wait for your teacher to deactivate the test.");
					}
                		}
        		);
		}
        );
}

function displayQuestions2()
{
        test = JSON.parse(window.test["test"]);
	var order = [test.length-1];

	for(var i = 1; i < test.length; i++)
	{
		order[i-1] = i;
	}

	shuffle(order);
	var navHtml = "";

	for(var i = 1; i < test.length; i++)
	{
		if(i == 1)
		{
			navHtml = "<li class=\"active\"><a href=\"#question_" + order[i - 1] + "\" aria-controls=\"question_" + order[i - 1] + "\" role=\"tab\" data-toggle=\"tab\">" + i + "</a></li>";
		}
		else
		{
			navHtml += "<li><a href=\"#question_" + order[i - 1] + "\" aria-controls=\"question_" + order[i - 1] + "\" role=\"tab\" data-toggle=\"tab\">" + i + "</a></li>";
		}
	}

        var questionsHtml = "";

        for(var i = 1; i < test.length; i++)
        {
                var index = "question_" + i;

		if(i == order[0])
		{
			var html = "<div role=\"tabpanel\" class=\"tab-pane active\" id=\"question_" + i + "\"><div class=\"row\"><div class=\"col-sm-6\"><div class=\"card testCard\"><div class=\"card-header ch-alt\"><h2>Question</h2></div><div class=\"card-body card-padding\"><p class=\"lead\">" + test[i][index] + "</p></div></div></div><div class=\"col-sm-6\"><div class=\"card testCard\"><div class=\"card-header ch-alt\"><h2>Answers</h2></div><div class=\"card-body card-padding\"><form id=\"answerForm_" + i + "\">";
		}
		else
		{
			var html = "<div role=\"tabpanel\" class=\"tab-pane\" id=\"question_" + i + "\"><div class=\"row\"><div class=\"col-sm-6\"><div class=\"card testCard\"><div class=\"card-header ch-alt\"><h2>Question</h2></div><div class=\"card-body card-padding\"><p class=\"lead\">" + test[i][index] + "</p></div></div></div><div class=\"col-sm-6\"><div class=\"card testCard\"><div class=\"card-header ch-alt\"><h2>Answers</h2></div><div class=\"card-body card-padding\"><form id=\"answerForm_" + i + "\">";

		}

                var count = 1;

                while(true)
                {
                        var index = "answer" + count;

                        if(test[i][index])
                        {
                                html += "<div class=\"radio m-b-15 answerBor\"><label class=\"answerLabel\"><input type=\"radio\" name=\"sample\" id=\"answer_" + i + "\" value=\"" + count + "\"><i class=\"input-helper\"></i>" + test[i][index] + "</label></div>";

                                count ++;
                        }
                        else
                        {
                                break;
                        }
                }

                html += "</form></div></div></div></div></div>";

                questionsHtml += html;
        }

        $(".tab-content").html(questionsHtml);
        $("#questionTabs").html(navHtml);
}

function shuffle(o)
{
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function launchTest()
{
	var testID = $("#testID").val();
	var user = JSON.parse(window.atob(localStorage.getItem("user")));
	var uuid = user.uuid;

	$.post(
                window.appUrl + "student/testID",
                {
                        testID: testID,
			uuid: uuid
                },
                function(data)
                {
                        if(data == "false")
                        {
                                error("Error with test ID");
                        }
			else if(data == "duplicate")
			{
				error("You have already taken this test");
			}
			else
			{
				console.log("true");
				window.location = window.appUrl + "student/test";
			}
                }
        );
}

function startTimer(duration, display)
{
	var timer = duration, minutes, seconds;
        setInterval(function ()
        {
        	minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

            	minutes = minutes < 10 ? "0" + minutes : minutes;
               	seconds = seconds < 10 ? "0" + seconds : seconds;

            	display.textContent = minutes + ":" + seconds;

              	if (--timer < 0)
             	{
                	timer = duration;
			endTest();
		}
     	}, 1000);
}

function addEvent(obj, evt, fn)
{
	if (obj.addEventListener)
       	{
        	obj.addEventListener(evt, fn, false);
      	}
      	else if (obj.attachEvent)
      	{
          	obj.attachEvent("on" + evt, fn);
      	}
}

addEvent(window,"load",function(e)
{
	addEvent(document, "mouseout", function(e)
     	{
        	e = e ? e : window.event;
             	var from = e.relatedTarget || e.toElement;
          	if (!from || from.nodeName == "HTML")
              	{
			if(testStarted)
			{
				mixpanel.track("Left window");
				window.cheat ++;
                		$('#modalAntiCheat').modal('show');
			}

               	}
   	});
});

function launchIntoFullscreen(element)
{
 	if(element.requestFullscreen)
	{
    		element.requestFullscreen();
  	}
	else if(element.mozRequestFullScreen)
	{
    		element.mozRequestFullScreen();
  	}
	else if(element.webkitRequestFullscreen)
	{
    		element.webkitRequestFullscreen();
  	}
	else if(element.msRequestFullscreen)
	{
    		element.msRequestFullscreen();
  	}
}

function exitFullscreen()
{
	if(document.exitFullscreen)
	{
    		document.exitFullscreen();
  	}
	else if(document.mozCancelFullScreen)
	{
    		document.mozCancelFullScreen();
  	}
	else if(document.webkitExitFullscreen)
	{
    		document.webkitExitFullscreen();
  	}
}

function error(message)
{
	sweetAlert("Error!", message, "error");
}
