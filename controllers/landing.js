var express = require('express');
var router = express.Router();
var User = require('../models/user');
var stripe = require('stripe')(process.env.STRIPE_KEY);

router.get('/higher-ed', function(req, res)
{
	res.render('higher-ed');
});

router.get('/high-school', function(req, res)
{
	res.render('high-school');
});

router.post('/high-school', function(req, res)
{
        var stripeToken = req.body.stripeToken;
        var email = req.body.email;
        var uuid = req.body.uuid;
	var user = req.body.user;

        stripe.customers.create({
                source: stripeToken,
                plan: "highSchoolTeacher",
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
			var newUser = JSON.parse(user);
			//var newUser = JSON.stringify(user);
			newUser["paymentInfo"] = JSON.stringify(customer);

			console.log(newUser);

        		User.putUser(newUser, function(data)
        		{
                		if(data == false)
               	 		{
                			console.log(data);
				}
                		else
                		{
                			res.redirect('/teacher');
				}
        		});

			/*
                        User.updateUserPaymentInfo(uuid, JSON.stringify(customer), function(data)
                        {
                                if(data == false)
                                {
                                        console.log("Update Error Data: " + data);
                                }
                                else
                                {
                                        console.log("Update Data: " + data);
                                        res.redirect('/teacher');
                                }
                        });
			*/
                }
        });
});

module.exports = router
