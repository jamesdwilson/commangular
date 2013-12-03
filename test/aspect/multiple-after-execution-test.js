describe("Multiple After execution testing", function() {

	var provider;
	var scope;
	var interceptorExecutedAfter = false;
	var commandExecuted = false;

	beforeEach(function() {

		commangular.commands = {};
		commangular.aspects = [];
		
		commangular.aspect('@After(/com.test1/)', function(){

			return {

				execute : function () {

					interceptorExecutedAfter = true;
				}
			}
			
		});
		
		commangular.aspect('@After(/com.test2/)', function(lastResult){
			
			return {

				execute : function() {

					expect(lastResult).toBeDefined();
					expect(lastResult).toBe('monkey');
				}
			}
			
		});

		commangular.create('com.test1.Command1',function(){

			return {

				execute : function() {
										
						commandExecuted = true;
				}
			};
		});
	});

	beforeEach(function() {

		module('commangular', function($commangularProvider) {
			provider = $commangularProvider;
		});
		inject(function($rootScope) {
			scope = $rootScope;
		});
	});

	it("provider should be defined", function() {

		expect(provider).toBeDefined();
	});

	it("should execute the interceptor before the command", function() {
	
		var complete = false;
		provider.mapTo('BeforeTestEvent').asSequence().add('com.test1.Command1');

		runs(function() {

			scope.$apply(function(){

				scope.dispatch('BeforeTestEvent').then(function(){

					complete = true;
				});
			});
		});

		waitsFor(function() {

			return complete;
		});
		
		runs(function() {

			expect(interceptorExecutedAfter).toBe(true);
			expect(commandExecuted).toBe(true);

		});

	});
	
	
	
});