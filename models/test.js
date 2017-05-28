var ddb = require('dynamodb').ddb({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, endpoint: 'dynamodb.us-west-1.amazonaws.com' });
var table = 'tests';

exports.putTest = function(test, cb)
{
        ddb.putItem(table, test, {}, function(err, res, cap)
        {
                if(err)
                {
                        console.log("Put Test Error: " + err);
                        cb(false);
                }
                else
                {
                        cb(res);
                }
        });
};

exports.getTest = function(testID, uuid, cb)
{
        ddb.getItem(table, testID, null, {}, function(err, res, cap) {
                if(err || typeof res === 'undefined')
                {
                        console.log(err);
                        cb(false);
                }
                else
                {
                        cb(res);
                }
        });
};

exports.updateTestState = function(testID, uuid, state, cb)
{
	ddb.updateItem(table, testID, null, { 'active': { value: state } }, {}, function(err, res, cap)
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

exports.deleteTest = function(testID, uuid, cb)
{
	ddb.deleteItem(table, testID, null, {}, function(err, res, cap) {
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
