var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Test = require('../models/test');
var Grades = require('../models/grade');

router.get('/', function(req, res)
{
	res.render('student');
});

router.get('/test', function(req, res)
{
	//res.render('test', {test: req.session.test});
	res.render('test');
});

router.get('/test/data', function(req, res)
{
	var test = req.session.test;
	console.log(test);
	res.send(test);
});

router.get('/review', function(req, res)
{
        res.render('review');
});

router.post('/listTests', function(req, res)
{
        var uuid = req.body.uuid;

        User.getUser(uuid, function(data)
        {
                if(data == false)
                {
                        res.send("false");
                }
                else
                {
                        res.send(data);
                }
        });
});

router.post('/getTest', function(req, res)
{
	var testID = req.body.testID;
        //var uuid = req.body.uuid;

	Test.getTest(testID, null, function(data)
        {
		if(data == false)
		{
			res.send("false");
		}
		else
		{
			res.send(data);
		}
	});
});

router.post('/testID', function(req, res)
{
        var testID = req.body.testID;
	var uuid = req.body.uuid;

        Test.getTest(testID, null, function(data)
        {
                if(data == false)
                {
                        res.send("false");
                }
                else
                {
			if(data["active"] == "true")
			{
				//var exists = false;
				User.getUser(uuid, function(data2)
				{
					if(data2 == false)
					{
						res.send("false");
					}
					else
					{
						var exists = false;
						if(data2["tests"] != 'undefined' && data2["tests"] != null)
						{
							var existingGrades = JSON.parse(data2["tests"]);
							for(i = 0; i < existingGrades.length; i++)
							{
								if(existingGrades[i]["testID"] == testID)
								{
									exists = true;
									break;
								}
							}
						}
						if(!exists)
                                		{
                                        		req.session.test = data;
                                        		res.send("true");
                                		}
                                		else if(exists)
                                		{
                                        		res.send("duplicate");
                                		}
					}
				});
			}
			else
			{
				res.send("false");
			}
		}
        });
});

router.post('/gradeTest', function(req, res)
{
	var uuid = req.body.uuid;
	var gradeData = JSON.parse(req.body.gradeData);
	var testID = req.body.testID;
	var teacherUUID = req.body.teacherUUID;
	var title = req.body.title;

	User.getUser(uuid, function(data)
      	{
        	if(data == false)
              	{
                 	res.send("false");
     		}
           	else
            	{
			//var gradeExists = false;
			//var existingGrades = JSON.parse(data["tests"]);
			//for(i = 0; i < existingGrades.length; i++)
			//{
			//	if(existingGrades[i]["uuid"] == uuid)
			//	{
			//		gradeExists = true;
			//		break;
			//	}
			//}
			//if(!gradeExists)
			//{
                 		if(data["tests"])
                      		{
                      			var newData = JSON.parse(data["tests"]);

                               		if(newData.constructor !== Array)
                               		{
                                		newData = [newData];
                            		}

                            		newData.push(gradeData);

                           		User.updateUserTest(uuid, JSON.stringify(newData), function(data2)
                            		{
                                		if(data2 == false)
                                     		{
                                           		res.send("false");
                                       		}
                             		});
           			}
                    		else
                    		{
                         		User.updateUserTest(uuid, JSON.stringify(gradeData), function(data3)
                              		{
                                 		if(data3 == false)
                                      		{
                                        	     	res.send("false");
                                     		}
                               		});
                      		}
        		//}
    		}
	});

	Grades.getGrades(testID, function(data)
	{
		if(data == null)
		{
			var inner = JSON.stringify(gradeData);
			var deployedGradeData = {"testID": testID, "teacherUUID": teacherUUID, "grades": [inner], "title": title};
			console.log(JSON.stringify(deployedGradeData));
                      	Grades.putGrades(deployedGradeData, function(data1)
                        {
                      		if(data1 == undefined)
                                {
                                	res.send("true");
                            	}
                             	else
                           	{
                              		res.send("false");
                          	}
                    	});
		}
		else if(data == false)
		{
			res.send("false");
		}
		else
		{
			var exists = false;
			for(var i = 0; i < data["grades"].length; i++)
			{
				if(JSON.parse(data["grades"][i])["uuid"] == uuid)
				{
					exists = true;
					break;
				}
			}
			if(exists)
                    	{
                      		res.send("false");
                      	}
                     	else
                    	{
                             	data["grades"].push(JSON.stringify(gradeData));
                            	Grades.putGrades(data, function(data2)
                            	{
					if(data2 == undefined)
                                	{
                                       		res.send("true");
                                	}
                                    	else
                                   	{
                                           	res.send("false");
                                     	}
                              	});
                     	}
		}
	});
});

module.exports = router
