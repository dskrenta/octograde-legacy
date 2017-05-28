var express = require('express');
var router = express.Router();
var User = require('../models/user');
var stripe = require('stripe')(process.env.STRIPE_KEY);

router.use('/student', require('./student'));
router.use('/teacher', require('./teacher'));
router.use('/terms', require('./terms'));
router.use('/privacy', require('./privacy'));
router.use('/landing', require('./landing'));
router.use('/beta', require('./beta'));
router.use('/about', require('./about'));

router.get('/', function(req, res)
{
	res.render('landing');
});

router.post('/', function(req, res)
{
	var stripeToken = req.body.stripeToken;
	var email = req.body.email;
	var uuid = req.body.uuid;
	var type = req.body.type;

	var plan = "octogradeStudent";

	if(type == 1)
	{
		plan = "highSchoolTeacher";
	}

	stripe.customers.create({
  		source: stripeToken,
  		plan: plan,
  		email: email
	},
	function(err, customer)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("Customer: " + JSON.stringify(customer));
			console.log("passed uuid: " + uuid);
			User.updateUserPaymentInfo(uuid, JSON.stringify(customer), function(data)
			{
				if(data == false)
				{
					console.log("Update Error Data: " + data);
				}
				else
				{
					console.log("Update Data: " + data);
					res.redirect('/student');
				}
			});
		}
	});
});

router.post('/user', function(req, res)
{
	var uuid = req.body.uuid;
	var user = JSON.parse(req.body.user);

	User.getUser(uuid, function(data)
	{
		if(data == false)
		{
			User.putUser(user, function(data)
			{
				res.send("false");
			});
		}
		else
		{
			res.send(data);
		}
	});
});

router.post('/checkUser', function(req, res)
{
        var uuid = req.body.uuid;
        var user = JSON.parse(req.body.user);

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

router.post('/putUser', function(req, res)
{
        var uuid = req.body.uuid;
        var user = JSON.parse(req.body.user);

       	User.putUser(user, function(data)
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
});

router.post('/type', function(req, res)
{
	var uuid = req.body.uuid;
	var type = req.body.type;
	var user = req.body.user;

	User.updateUserType(uuid, type, function(data)
	{
		if(data == false)
		{
			res.send("false");
		}
		else
		{
			User.getUser(uuid, function(data1)
			{
				if(data1 == false)
				{
					res.send("false");
				}
				else
				{
					res.send(data1);
				}
			});
		}
	});
});

module.exports = router;
