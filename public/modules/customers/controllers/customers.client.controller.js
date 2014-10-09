'use strict';

// Customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers', 'ngTableParams',
	function($scope, $stateParams, $location, Authentication, Customers, ngTableParams ) {
		$scope.authentication = Authentication;

		var params = {
	        page: 1,
	        count: 5
		};


		var settings = {
	        total: 0,
	        counts: [5, 10, 15],
	        getData: function($defer, params) {
	        	Customers.get(params.url(), function(response) {
	        		params.total(response.total);
	        		$defer.resolve(response.results);
	        	});
	        }
		};


    	$scope.tableParams = new ngTableParams(params, settings);


		// Create new Customer
		$scope.create = function() {
			// Create new Customer object
			var customer = new Customers ({
				name: this.name,
				address: this.address,
				state: this.state,
				country: this.country
			});

			// Redirect after save
			customer.$save(function(response) {
				$location.path('customers/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.address = '';
				$scope.state = '';
				$scope.country = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Customer
		$scope.remove = function( customer ) {
			if ( customer ) { customer.$remove();

				for (var i in $scope.customers ) {
					if ($scope.customers [i] === customer ) {
						$scope.customers.splice(i, 1);
					}
				}
			} else {
				$scope.customer.$remove(function() {
					$location.path('customers');
				});
			}
		};

		// Update existing Customer
		$scope.update = function() {
			var customer = $scope.customer ;

			customer.$update(function() {
				$location.path('customers/' + customer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Customers
		$scope.find = function() {
			var customers = Customers.get();
			console.log(customers);
			$scope.customers = customers.results;

			//$scope.customers = Customers.query();
		};

		// Find existing Customer
		$scope.findOne = function() {
			$scope.customer = Customers.get({ 
				customerId: $stateParams.customerId
			});
		};
	}
]);