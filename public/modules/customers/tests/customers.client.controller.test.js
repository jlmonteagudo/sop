'use strict';

(function() {
	// Customers Controller Spec
	describe('Customers Controller Tests', function() {
		// Initialize global variables
		var CustomersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Customers controller.
			CustomersController = $controller('CustomersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Customer object fetched from XHR', inject(function(Customers) {
			// Create sample Customer using the Customers service
			var sampleCustomer = new Customers({
				name: 'New Customer'
			});

			// Create a sample Customers array that includes the new Customer
			var sampleCustomers = [sampleCustomer];

			// Set GET response
			$httpBackend.expectGET('customers').respond(sampleCustomers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customers).toEqualData(sampleCustomers);
		}));

		it('$scope.findOne() should create an array with one Customer object fetched from XHR using a customerId URL parameter', inject(function(Customers) {
			// Define a sample Customer object
			var sampleCustomer = new Customers({
				name: 'New Customer'
			});

			// Set the URL parameter
			$stateParams.customerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/customers\/([0-9a-fA-F]{24})$/).respond(sampleCustomer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customer).toEqualData(sampleCustomer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Customers) {
			// Create a sample Customer object
			var sampleCustomerPostData = new Customers({
				name: 'New Customer'
			});

			// Create a sample Customer response
			var sampleCustomerResponse = new Customers({
				_id: '525cf20451979dea2c000001',
				name: 'New Customer'
			});

			// Fixture mock form input values
			scope.name = 'New Customer';

			// Set POST response
			$httpBackend.expectPOST('customers', sampleCustomerPostData).respond(sampleCustomerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Customer was created
			expect($location.path()).toBe('/customers/' + sampleCustomerResponse._id);
		}));

		it('$scope.update() should update a valid Customer', inject(function(Customers) {
			// Define a sample Customer put data
			var sampleCustomerPutData = new Customers({
				_id: '525cf20451979dea2c000001',
				name: 'New Customer'
			});

			// Mock Customer in scope
			scope.customer = sampleCustomerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/customers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/customers/' + sampleCustomerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid customerId and remove the Customer from the scope', inject(function(Customers) {
			// Create new Customer object
			var sampleCustomer = new Customers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Customers array and include the Customer
			scope.customers = [sampleCustomer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/customers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCustomer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.customers.length).toBe(0);
		}));
	});
}());