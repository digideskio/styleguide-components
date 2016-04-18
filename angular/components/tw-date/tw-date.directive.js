(function(angular) {
	'use strict';

	angular
		.module('tw.form-components')
		.directive('twDate', TwDateDirective);

	function TwDateDirective() {
		var directive = {
			bindToController: true,
			controller: "TwDateController",
			controllerAs: 'vm',
			replace: true,
			restrict: 'E',
			scope: {
				date: '=ngModel',
				required: '@',
				ngRequired: '=',
				disabled: '@',
				ngDisabled: '=',
				locale: '@',
				twLocale: '=',
				minDateString: '@min',
				ngMin: '=',
				maxDateString: '@max',
				ngMax: '=',
				modelType: '@'
			},
			template: templateAsString
		};

		return directive;
	}

	function TwDateLink(scope, element, attrs, ngModel) {
		/*
		ngModel.$formatters.push(function(value) {
			// explode(value)
			scope.vm.day =
			scope.vm.month =
			scope.vm.year =
			return value;
		});

		element.find('input').on('change', function() {
			var dateString = combine();
			ngModel.$setViewValue(dateString);
		})
		ngModel.$validators.min = function(value) {
			return
		};
		ngModel.$validators.max = function(value) {
			return
		};
		*/
	}

	var templateAsString = " \
			<div class='row'> \
				<div class='col-sm-3'> \
					<label class='sr-only' for='day-{{::uniqueId}}'>Day</label> \
					<input type='number' \
						name='day' \
						id='day-{{::uniqueId}}' \
						class='form-control tw-date-day' \
						ng-model='vm.day' \
						ng-change='vm.updateDateModelAndValidationClasses()' \
						placeholder='DD' \
						min='1' \
						max='31' \
						maxlength='2' \
						ng-min='1' \
						ng-max='31' \
						ng-maxlength='2' \
						ng-disabled='vm.dateDisabled' \
						ng-required='vm.dateRequired' \
						tw-validation /> \
				</div> \
				<div class='col-sm-5'> \
					<label class='sr-only' for='month-{{::uniqueId}}'>Month</label> \
					<select name='month' \
						id='month-{{::uniqueId}}' \
						class='form-control tw-date-month' \
						ng-model='vm.month' \
						ng-change='vm.updateDateModelAndValidationClasses()' \
						ng-options='month.value as month.label for month in vm.dateMonths' \
						ng-disabled='vm.dateDisabled' \
						ng-required='vm.dateRequired' \
						autocomplete='off' \
						tw-validation> \
					</select> \
				</div> \
				<div class='col-sm-4'> \
					<label class='sr-only' for='year-{{::uniqueId}}'>Year</label> \
					<input type='number' \
						id='year-{{::uniqueId}}' \
						name='year' \
						class='form-control tw-date-year' \
						placeholder='YYYY' \
						ng-model='vm.year' \
						ng-change='vm.updateDateModelAndValidationClasses()' \
						ng-min='vm.dateRange.min.getFullYear()' \
						ng-max='vm.dateRange.max.getFullYear()' \
						maxlength='4' \
						ng-maxlength='4' \
						ng-disabled='vm.dateDisabled' \
						ng-required='vm.dateRequired' \
						tw-validation /> \
				</div> \
			</div>";

	/*

<tw-select \
	name='month' \
	id='month-{{::uniqueId}}' \
	ng-model='vm.month' \
	ng-change='vm.updateDateModelAndValidationClasses()' \
	ng-required='vm.dateRequired' \
	ng-disabled='vm.dateDisabled' \
	tw-options='vm.dateMonths'> \
</tw-select> \

	*/
})(window.angular);
