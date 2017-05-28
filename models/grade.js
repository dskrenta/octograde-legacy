var ddb = require('dynamodb').ddb({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, endpoint: 'dynamodb.us-west-1.amazonaws.com' });
var table = 'grades';

exports.putGrades = function(grades, cb)
{
        ddb.putItem(table, grades, {}, function(err, res, cap)
        {
                if(err)
                {
                        console.log("Put Grade Err: " + err);
                        cb(false);
                }
                else
                {
                        console.log("Put Grade Res: " + res);
                        cb(res);
                }
        });
};

exports.getGrades = function(testID, cb)
{
        ddb.getItem(table, testID, null, {}, function(err, res, cap) {
                if(err || typeof res === 'undefined')
                {
			if(err == null)
			{
				cb(null);
			}
			else
			{
                        	console.log("Get Grade err: " + err);
                        	cb(false);
                	}
		}
                else
                {
                        console.log("Get Grade res: " + res);
                        cb(res);
                }
        });
};

/*
exports.updateUserType = function(uuid, type, cb)
{
	ddb.updateItem(table, uuid, null, { 'type': { value: type } }, {}, function(err, res, cap)
	{
        	if(err)
		{
                	console.log(err);
			cb(false);
		}
       		else
		{
                   	console.log(res);
			cb(true);
                }
   	});
};

exports.updateUserTest = function(uuid, test, cb)
{
        ddb.updateItem(table, uuid, null, { 'tests': { value: test } }, {}, function(err, res, cap)
        {
                if(err)
                {
                        console.log(err);
                        cb(false);
                }
                else
                {
                        console.log(res);
                        cb(true);
                }
        });
};
*/

exports.deleteGrades = function(testID)
{
	ddb.deleteItem(table, testID, null, {}, function(err, res, cap) {
		if(err)
		{
			console.log(err);
			return false;
		}
		else
		{
			return true;
		}
	});
};
