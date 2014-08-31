'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('listCustomers', {
			url: '/customers',
			templateUrl: 'modules/customers/views/list-customers.client.view.html'
		}).
		state('createCustomer', {
			url: '/customers/create',
			templateUrl: 'modules/customers/views/create-customer.client.view.html'
		}).
		state('viewCustomer', {
			url: '/customers/:customerId',
			templateUrl: 'modules/customers/views/view-customer.client.view.html'
		}).
		state('editCustomer', {
			url: '/customers/:customerId/edit',
			templateUrl: 'modules/customers/views/edit-customer.client.view.html'
		});
	}
]);