var express = require('express');
var router = express.Router();
var Test = require('../models/test');
var User = require('../models/user');
var Grades = require('../models/grade');

var stripe = require("stripe")(process.env.STRIPE_KEY);

router.get('/', function(req, res)
{
	res.render('teacher');
});

router.get('/createtest', function(req, res)
{
	res.render('create');
});

router.get('/editTest', function(req, res)
{
	res.render('edit');
});

router.get('/stats/', function(req, res)
{
	res.render('stats');
});

router.post('/deleteAccount', function(req, res)
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
			if(data.paymentInfo)
			{
				var paymentInfo = JSON.parse(data.paymentInfo);

				var cusID = paymentInfo.id;
				var subID = paymentInfo.subscriptions.data[0].id;

				stripe.customers.cancelSubscription(
  					cusID,
  					subID,
 	 				function(err, confirmation)
					{
    						if(err)
						{
							res.send("false");
						}
						else
						{
							User.deleteUser(uuid, function(data)
							{
								if(data == false)
								{
									res.send("false");
								}
								else
								{
									res.send("true");
								}
							});
						}
  					}
				);
			}
			else
			{
				res.send("noSub");
			}
		}
        });
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

router.post('/gradeData', function(req, res)
{
	var testID = req.body.testID;
	var uuid = req.body.uuid;

	Grades.getGrades(testID, function(data)
	{
		if(data == null)
		{
			res.send("null");
		}
		else
		{
			var teacherUUID = data.teacherUUID;

			if(uuid != teacherUUID)
			{
				res.send("invalid");
			}
			else if(data == "false")
			{
				res.send("false");
			}
			else
			{
				res.send(data);
			}
		}
	});
});

router.post('/changeState', function(req, res)
{
	var testID = req.body.testID;
        var uuid = req.body.uuid;

	Test.getTest(testID, uuid, function(data)
	{
		if(data)
		{
			var update = "true";
			if(data["active"] == "true")
			{
				update = "false";
			}
			Test.updateTestState(testID, uuid, update, function(data1)
			{
				if(data1)
				{
					User.getUser(uuid, function(data2)
					{
						if(data2)
						{
							var tests = JSON.parse(data2["tests"]);
							if(tests.constructor !== Array)
							{
								tests = [tests];
							}
							for(var i = 0; i < tests.length; i++)
							{
								if(tests[i]["testID"] == testID)
								{
									tests[i]["active"] = update;
									break;
								}
							}
							User.updateUserTest(uuid, JSON.stringify(tests), function(data3)
							{
								if(data3)
								{
									res.send("true");
								}
								else
								{
									res.send("false");
								}
							});
						}
						else
						{
							res.send("false");
						}
					});
				}
				else
				{
					res.send("false");
				}
			});
		}
		else
		{
			res.send("false");
		}
	});
});

router.post('/test', function(req, res)
{
	var uuid = req.body.uuid;
	var test = req.body.test;
	var timestamp = req.body.timestamp;
	var active = req.body.active;
	var testID = req.body.testID;
	var testTitle = req.body.testTitle;
	var testDuration = req.body.testDuration;

	var tempImportData = {testID: testID, uuid: uuid, test: test, timestamp: timestamp, active: active, testTitle: testTitle, testDuration: testDuration};

	var importData = tempImportData;

	var userImportData = {testID: testID, uuid: uuid, timestamp: timestamp, active: active, testTitle: testTitle, testDuration: testDuration};

	console.log("tempImportData: " + tempImportData + "userImportData: " + userImportData);

        Test.getTest(testID, uuid, function(data)
        {
                if(data == false)
                {
                        Test.putTest(importData, function(data1)
                        {
				if(data1 == false)
				{
					res.send("false");
				}
				else
				{
					User.getUser(uuid, function(data2)
                                        {
                                                if(data2 == false)
                                                {
                                                        res.send("false");
                                                }
                                                else
                                                {
                                                        if(data2["tests"])
                                                        {
								var newData = JSON.parse(data2["tests"]);

								if(newData.constructor !== Array)
								{
									newData = [newData];
								}

								newData.push(userImportData);

								User.updateUserTest(uuid, JSON.stringify(newData), function(data3)
                                                                {
                                                                        if(data3 == false)
                                                                        {
                                                                                res.send("false");
                                                                        }
                                                                        else
                                                                        {
                                                                                res.send(data3);
                                                                        }
                                                                });
                                                        }
                                                        else
                                                        {
                                                                User.updateUserTest(uuid, JSON.stringify(userImportData), function(data4)
                                                                {
                                                                        if(data4 == false)
                                                                        {
                                                                                res.send("false");
                                                                        }
                                                                        else
                                                                        {
                                                                                res.send(data4);
                                                                        }
                                                                });
                                                        }
                                                }
                                        });
				}
			});
                }
                else
                {
                        res.send("false");
                }
        });
});

router.post('/getTest', function(req, res)
{
        var testID = req.body.testID;

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

module.exports = router
