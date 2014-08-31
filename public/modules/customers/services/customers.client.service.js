'use strict';

//Customers service used to communicate Customers REST endpoints
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('customers/:customerId', { customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);