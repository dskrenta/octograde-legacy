require('dotenv').config('../.env');
var ddb = require('dynamodb').ddb({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, endpoint: 'dynamodb.us-west-1.amazonaws.com' });
var table = 'users';

exports.putUser = function(user, cb)
{
        ddb.putItem(table, user, {}, function(err, res, cap)
        {
                if(err)
                {
                        console.log("Put User Err: " + err);
                        cb(false);
                }
                else
                {
                        console.log("Put User Res: " + res);
                        cb(res);
                }
        });
};

exports.getUser = function(uuid, cb)
{
        ddb.getItem(table, uuid, null, {}, function(err, res, cap) {
                if(err || typeof res === 'undefined')
                {
                        console.log("Get user err: " + err);
                        cb(false);
                }
                else
                {
                        console.log("Get user res: " + res);
                        cb(res);
                }
        });
};

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

exports.updateUserPaymentInfo = function(uuid, payInfo, cb)
{
        ddb.updateItem(table, uuid, null, { 'paymentInfo': { value: payInfo } }, {}, function(err, res, cap)
        {
                if(err)
                {
                        console.log(err);
                        cb(false);
                }
                else
                {
                        cb(true);
                }
        });
};

exports.deleteUser = function(uuid, cb)
{
	ddb.deleteItem(table, uuid, null, {}, function(err, res, cap) {
		if(err)
		{
			console.log(err);
			cb(false);
		}
		else
		{
			cb(true);
		}
	});
};
