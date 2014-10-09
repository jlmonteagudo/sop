'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Customer = mongoose.model('Customer'),
	_ = require('lodash');

/**
 * Create a Customer
 */
exports.create = function(req, res) {
	var customer = new Customer(req.body);
	customer.user = req.user;

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
	res.jsonp(req.customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
	var customer = req.customer ;

	customer = _.extend(customer , req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
	var customer = req.customer ;

	customer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * List of Customers
 */

 /*
exports.list = function(req, res) { 


	Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customers);
		}
	});
};
*/

exports.list = function(req, res) { 

	var count = req.query.count || 5;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};




	var pagination = {
		start: (page - 1) * count,
		count: count
	};


	var sort = {
		sort: {
			desc: '_id'
		}
	};


	Customer
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, customers){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(customers);
			}			
		});

};





/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) { Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
		if (err) return next(err);
		if (! customer) return next(new Error('Failed to load Customer ' + id));
		req.customer = customer ;
		next();
	});
};

/**
 * Customer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.customer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};