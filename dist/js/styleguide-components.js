angular.module("tw.form-validation", []);
angular.module("tw.form-styling", []);
angular.module("tw.form-components", []);
angular.module("tw.styleguide-components", ['tw.form-validation', 'tw.form-styling', 'tw.form-components']);
!function(angular) {
    "use strict";
    function TwDateController($element, $log, $scope) {
        function init() {
            if (vm.ngModel) applyDateModelIfValidOrThrowError(), initialisedWithDate = !0; else {
                if (vm.modelType) {
                    if (vm.modelType !== STRING_TYPE && vm.modelType !== OBJECT_TYPE) throw new Error("Invalid modelType, should be " + STRING_TYPE + " or " + OBJECT_TYPE);
                    vm.dateModelType = vm.modelType;
                } else vm.dateModelType = OBJECT_TYPE;
                vm.day = null, vm.month = "0", vm.year = null;
            }
            ngModel = $element.controller("ngModel"), ngModel.$validators.min = function(value) {
                var limit = prepDateLimitForComparison(vm.ngMin, vm.min), dateValue = prepDateValueForComparison(value);
                return !limit || !dateValue || dateValue >= limit;
            }, ngModel.$validators.max = function(value) {
                var limit = prepDateLimitForComparison(vm.ngMax, vm.max), dateValue = prepDateValueForComparison(value);
                return !limit || !dateValue || limit >= dateValue;
            }, setDateRequired(), setDateDisabled(), setDateLocale(), setMonths(), registerWatchers();
        }
        function prepDateLimitForComparison(ngLimit, attrLimit) {
            var limit = ngLimit ? ngLimit : attrLimit ? attrLimit : !1;
            return limit ? (limit = "string" == typeof limit ? new Date(limit) : limit, validDateObject(limit) ? limit : !1) : !1;
        }
        function prepDateValueForComparison(dateValue) {
            return "string" == typeof dateValue ? new Date(dateValue) : dateValue;
        }
        function applyDateModelIfValidOrThrowError() {
            if (!validDate(vm.ngModel)) throw new Error("date model passed should either be instance of Date or valid ISO8601 string");
            vm.dateModelType = "string" == typeof vm.ngModel ? STRING_TYPE : OBJECT_TYPE, vm.explodeDateModel(vm.ngModel);
        }
        function setMonths() {
            vm.dateMonths = getMonthsBasedOnIntlSupportForLocale();
        }
        function setDateRequired() {
            vm.dateRequired = void 0 !== vm.ngRequired ? vm.ngRequired : void 0 !== vm.required;
        }
        function setDateDisabled() {
            vm.dateDisabled = void 0 !== vm.ngDisabled ? vm.ngDisabled : void 0 !== vm.disabled;
        }
        function setDateLocale() {
            vm.locale || (vm.locale = DEFAULT_LOCALE_EN);
        }
        function explodeDateModel(date) {
            var dateObj = "string" == typeof date ? new Date(date) : date;
            vm.day = dateObj.getDate(), vm.month = dateObj.getMonth(), vm.year = dateObj.getFullYear();
        }
        function validDate(date) {
            return validDateObject(date) || validDateString(date);
        }
        function validDateObject(dateObj) {
            return "[object Date]" === Object.prototype.toString.call(dateObj) && !isNaN(dateObj.getTime());
        }
        function validDateString(dateString) {
            return "string" == typeof dateString && validDateObject(new Date(dateString));
        }
        function registerWatchers() {
            $scope.$watch("vm.day", function(newValue, oldValue) {
                newValue !== oldValue && initialisedWithDate && ngModel.$setDirty();
            }), $scope.$watch("vm.month", function(newValue, oldValue) {
                newValue !== oldValue && (vm.adjustLastDay(), ngModel.$setTouched(), initialisedWithDate && ngModel.$setDirty());
            }), $scope.$watch("vm.year", function(newValue, oldValue) {
                newValue !== oldValue && initialisedWithDate && ngModel.$setDirty();
            }), $scope.$watch("vm.ngModel", function(newValue, oldValue) {
                newValue !== oldValue && validDate(vm.ngModel) && (ngModel.$setDirty(), vm.explodeDateModel(vm.ngModel));
            }), $scope.$watch("vm.ngRequired", function(newValue, oldValue) {
                newValue !== oldValue && setDateRequired();
            }), $scope.$watch("vm.ngDisabled", function(newValue, oldValue) {
                newValue !== oldValue && setDateDisabled();
            }), $scope.$watch("vm.locale", function(newValue, oldValue) {
                newValue !== oldValue && (setDateLocale(), setMonths());
            });
        }
        function getMonthsBasedOnIntlSupportForLocale() {
            var monthNames;
            return isIntlSupportedForLocale(vm.locale) ? monthNames = getMonthNamesForLocale() : ($log.warn('i18n not supported for locale "' + vm.locale + '"'), 
            monthNames = DEFAULT_MONTHS_EN), extendMonthsWithIds(monthNames);
        }
        function isIntlSupportedForLocale(locale) {
            return window.Intl && "object" == typeof window.Intl && window.Intl.DateTimeFormat.supportedLocalesOf([ locale ]).length > 0;
        }
        function getMonthNamesForLocale() {
            for (var date, months = [], i = 0; 12 > i; i++) {
                date = new Date(Date.UTC(2e3, i, 15));
                var monthName = date.toLocaleDateString(vm.locale, {
                    month: "long"
                });
                monthName = monthName[0].toUpperCase() + monthName.substring(1), months.push(monthName);
            }
            return months;
        }
        function extendMonthsWithIds(monthNames) {
            return monthNames.map(function(monthName, index) {
                return {
                    value: index,
                    label: monthName
                };
            });
        }
        function isExplodedDatePatternCorrect() {
            return isNumber(vm.year) && isNumber(vm.day) && (isNumber(vm.month) || isNumericString(vm.month));
        }
        function isNumber(value) {
            return "number" == typeof value;
        }
        function isNumericString(value) {
            return "string" == typeof value && !isNaN(Number(vm.month));
        }
        function combineDate() {
            var date = new Date(Date.UTC(Number(vm.year), Number(vm.month), Number(vm.day)));
            return date.setFullYear(vm.year), date;
        }
        function updateDateModelAndValidationClasses() {
            if (vm.adjustLastDay(), !isExplodedDatePatternCorrect()) return void ngModel.$setViewValue(null);
            var dateObj = combineDate();
            if (vm.dateModelType === STRING_TYPE) {
                var isoString = dateObj.toISOString(), dateString = isoString.substring(0, isoString.indexOf("T"));
                ngModel.$setViewValue(dateString);
            } else ngModel.$setViewValue(dateObj);
        }
        function adjustLastDay() {
            var day = Number(vm.day), month = Number(vm.month), year = Number(vm.year), lastUTCDateForMonthAndYear = new Date(Date.UTC(year, month + 1, 0)), lastUTCDayForMonthAndYear = lastUTCDateForMonthAndYear.getUTCDate();
            day > lastUTCDayForMonthAndYear && (vm.day = parseInt(lastUTCDayForMonthAndYear));
        }
        var ngModel, vm = this, initialisedWithDate = !1;
        vm.updateDateModelAndValidationClasses = updateDateModelAndValidationClasses, vm.explodeDateModel = explodeDateModel, 
        vm.combineDate = combineDate, vm.adjustLastDay = adjustLastDay, vm.validDate = validDate;
        var DEFAULT_LOCALE_EN = "en", DEFAULT_MONTHS_EN = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ], STRING_TYPE = "string", OBJECT_TYPE = "object";
        init();
    }
    angular.module("tw.form-components").controller("TwDateController", TwDateController), 
    TwDateController.$inject = [ "$element", "$log", "$scope" ];
}(window.angular), function(angular) {
    "use strict";
    function TwDateDirective() {
        var directive = {
            require: "ngModel",
            bindToController: !0,
            controller: "TwDateController",
            controllerAs: "vm",
            replace: !1,
            restrict: "E",
            scope: {
                ngModel: "=",
                required: "@",
                ngRequired: "=",
                disabled: "@",
                ngDisabled: "=",
                locale: "@",
                twLocale: "=",
                min: "@",
                ngMin: "=",
                max: "@",
                ngMax: "=",
                modelType: "@"
            },
            template: templateAsString,
            link: TwDateLink
        };
        return directive;
    }
    function TwDateLink(scope, element, attrs, ngModel) {
        var dayTouched, yearTouched;
        element.find("input[name=day]").on("blur", function() {
            dayTouched = !0, dayTouched && yearTouched && (ngModel.$setTouched(), element.trigger("blur"));
        }), element.find("input[name=year]").on("blur", function() {
            yearTouched = !0, ngModel.$setTouched(), element.trigger("blur");
        });
    }
    angular.module("tw.form-components").directive("twDate", TwDateDirective);
    var templateAsString = " 			<div class='row'> 				<div class='col-sm-3'> 					<label class='sr-only' for='day-{{::uniqueId}}'>Day</label> 					<input type='number' 						name='day' 						id='day-{{::uniqueId}}' 						class='form-control tw-date-day' 						ng-model='vm.day' 						ng-change='vm.updateDateModelAndValidationClasses()' 						placeholder='DD' 						min='1' 						ng-min='1' 						ng-disabled='vm.dateDisabled' 						ng-required='vm.dateRequired' 						tw-focusable /> 				</div> 				<div class='col-sm-5'> 					<label class='sr-only' for='month-{{::uniqueId}}'>Month</label> 					<tw-select 						name='month' 						class='tw-date-month' 						id='month-{{::uniqueId}}' 						ng-model='vm.month' 						ng-change='vm.updateDateModelAndValidationClasses()' 						ng-required='vm.dateRequired' 						ng-disabled='vm.dateDisabled' 						options='vm.dateMonths'> 					</tw-select> 				</div> 				<div class='col-sm-4'> 					<label class='sr-only' for='year-{{::uniqueId}}'>Year</label> 					<input type='number' 						id='year-{{::uniqueId}}' 						name='year' 						class='form-control tw-date-year' 						placeholder='YYYY' 						ng-model='vm.year' 						ng-change='vm.updateDateModelAndValidationClasses()' 						ng-min='vm.dateRange.min.getFullYear()' 						ng-max='vm.dateRange.max.getFullYear()' 						maxlength='4' 						ng-maxlength='4' 						ng-disabled='vm.dateDisabled' 						ng-required='vm.dateRequired' 						tw-focusable /> 				</div> 			</div>";
}(window.angular), function(angular) {
    function TwDynamicFormControl() {
        return {
            restrict: "E",
            require: "ngModel",
            transclude: !0,
            controllerAs: "$ctrl",
            bindToController: !0,
            controller: "TwDynamicFormControlController",
            link: TwDynamicFormControlLink,
            scope: {
                type: "@",
                name: "@",
                id: "@",
                placeholder: "@",
                step: "@",
                options: "=",
                ngModel: "=",
                ngRequired: "=",
                ngDisabled: "=",
                ngMinlength: "=",
                ngMaxlength: "=",
                ngMin: "=",
                ngMax: "=",
                ngPattern: "="
            },
            template: "<div ng-switch='$ctrl.type'> 				<input ng-switch-when='text'  					name='{{$ctrl.name}}'  					id='{{$ctrl.id}}' 					type='text' 					class='form-control' 					placeholder='{{$ctrl.placeholder}}' 					ng-model='$ctrl.ngModel' 					ng-model-options='{ allowInvalid: true }' 					ng-required='$ctrl.ngRequired' 					ng-disabled='$ctrl.ngDisabled' 					ng-pattern='$ctrl.ngPattern' 					ng-change='$ctrl.change()' 					ng-blur='$ctrl.blur()' 					ng-minlength='$ctrl.ngMinlength' 					ng-maxlength='$ctrl.ngMaxlength' />  				<input ng-switch-when='number'  					name='{{$ctrl.name}}'  					id='{{$ctrl.id}}' 					type='number' 					step='{{$ctrl.step}}' 					class='form-control' 					placeholder='{{$ctrl.placeholder}}' 					ng-model='$ctrl.ngModel' 					ng-model-options='{ allowInvalid: true }' 					ng-required='$ctrl.ngRequired' 					ng-disabled='$ctrl.ngDisabled' 					ng-change='$ctrl.change()' 					ng-blur='$ctrl.blur()' 					ng-min='$ctrl.ngMin' 					ng-max='$ctrl.ngMax' />  				<div ng-switch-when='radio' 					class='radio' 					ng-class='{disabled: $ctrl.ngDisabled}' 					ng-repeat='option in $ctrl.options'> 					<label> 						<input type='radio' tw-input 							name='{{$ctrl.name}}' 							value='{{option.value}}' 							ng-model='$ctrl.ngModel' 							ng-required='$ctrl.ngRequired' 							ng-disabled='$ctrl.ngDisabled' 							ng-change='$ctrl.change()' 							ng-click='$ctrl.change()' 							ng-blur='$ctrl.blur()' /> 						{{option.label}} 					</label> 				</div> 				<div ng-switch-when='checkbox' 					class='checkbox' 					ng-class='{disabled: $ctrl.ngDisabled}'> 					<label> 						<input type='checkbox' tw-input 							name='{{$ctrl.name}}' 							id='{{$ctrl.id}}' 							ng-model='$ctrl.ngModel' 							ng-required='$ctrl.ngRequired' 							ng-disabled='$ctrl.ngDisabled' 							ng-change='$ctrl.change()' 							ng-click='$ctrl.change()' 							ng-blur='$ctrl.blur()' /> 						{{$ctrl.placeholder}} 					</label> 				</div> 				<select ng-switch-when='select' 					name='{{$ctrl.name}}' 					id='{{$ctrl.id}}' 					class='form-control tw-dynamic-select' 					ng-options='option.value as option.label for option in $ctrl.options' 					ng-model='$ctrl.ngModel' 					ng-required='$ctrl.ngRequired' 					ng-disabled='$ctrl.ngDisabled' 					ng-change='$ctrl.change(); $ctrl.blur();'> 					ng-blur='$ctrl.blur()'> 					<option ng-if='$ctrl.placeholder' value=''> 						{{$ctrl.placeholder}} 					</option> 				</select> 				<ng-transclude class='error-messages'></ng-transclude> 			</div>"
        };
    }
    function TwDynamicFormControlController($element, $scope) {
        var $ctrl = this, ngModelController = $element.controller("ngModel");
        $ctrl.change = function() {
            ngModelController.$setDirty();
        }, $ctrl.blur = function() {
            ngModelController.$setTouched(), $element.trigger("blur");
        };
    }
    function TwDynamicFormControlLink(scope, element, attrs, ngModel) {
        ngModel.$validators.min = function(modelValue, viewValue) {
            return "undefined" == typeof scope.$ctrl.ngMin ? !0 : !("number" == typeof viewValue && "number" == typeof scope.$ctrl.ngMin && viewValue < scope.$ctrl.ngMin);
        }, ngModel.$validators.max = function(modelValue, viewValue) {
            return "undefined" == typeof scope.$ctrl.ngMax ? !0 : !("number" == typeof viewValue && "number" == typeof scope.$ctrl.ngMax && viewValue > scope.$ctrl.ngMax);
        };
    }
    angular.module("tw.form-components").directive("twDynamicFormControl", TwDynamicFormControl), 
    angular.module("tw.form-components").controller("TwDynamicFormControlController", TwDynamicFormControlController), 
    TwDynamicFormControlController.$inject = [ "$element", "$scope" ];
}(window.angular), function(angular) {
    function TwLoader() {
        return {
            restrict: "E",
            template: "<div class='loader'> 			  <div class='loader-spinner'></div> 			  <div class='loader-flag'> 			    <svg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='-2 -2 56 56'> 			      <polygon class='loader-flag-stroke'  stroke='#00B9FF' stroke-width='2' stroke-linejoin='miter' stroke-linecap='round' stroke-miterlimit='10' stroke-dasharray='300' stroke-dashoffset='300' fill='none' points='24.6,27.3 0,27.3 14.3,13.7 6.1,0 48.2,0 26.3,52 19.5,52 39.2,5.5 16.8,5.5 21.6,13.6 13.4,21.8 27,21.8' /> 			    </svg> 			    <svg class='loader-flag-fill' xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 2 52 48'> 			      <polygon fill='#00B9FF' points='6.1,0 14.3,13.7 0,27.3 24.6,27.3 27,21.8 13.4,21.8 21.6,13.6 16.8,5.5 39.2,5.5 19.5,52 26.3,52 48.2,0 '/> 			    </svg> 			  </div> 			</div>"
        };
    }
    angular.module("tw.form-components").directive("twLoader", TwLoader);
}(window.angular), function(angular) {
    "use strict";
    function TwFormControlStyling() {
        return {
            restrict: "C",
            link: FocusableLink
        };
    }
    function TwFocusable() {
        return {
            restrict: "A",
            link: FocusableLink
        };
    }
    function FocusableLink(scope, element) {
        var formGroup = $(element).closest(".form-group");
        $(element).on("focus", function() {
            formGroup.addClass("focus");
        }).on("blur", function() {
            formGroup.removeClass("focus");
        });
    }
    angular.module("tw.form-styling").directive("formControl", TwFormControlStyling), 
    angular.module("tw.form-styling").directive("twFocusable", TwFocusable);
}(window.angular), function(angular) {
    function TwInputStyling() {
        function onFocus() {
            $(this).closest(".form-group").addClass("focus"), $(this).closest(labelSelector).addClass("focus");
        }
        function onBlur() {
            $(this).closest(".form-group").removeClass("focus"), $(this).closest(labelSelector).removeClass("focus");
        }
        function onClick(event) {
            fakeClick(this), event.stopPropagation();
        }
        function fakeClick(buttonReplacement) {
            var formControl = $(buttonReplacement).closest("label").find("input");
            "undefined" != typeof formControl[0] && (MouseEvent ? formControl[0].dispatchEvent(new MouseEvent("click", {
                view: window,
                bubbles: !0,
                cancelable: !0
            })) : formControl.click());
        }
        function onKeypress(event) {
            13 === (event.keyCode ? event.keyCode : event.which) && fakeClick(this);
        }
        function link(scope, element, attrs, ctrl) {
            if (attrs.type) {
                var type = attrs.type.toLowerCase();
                if (("radio" === type || "checkbox" === type) && 0 !== $(element).closest(labelSelector).length) {
                    var replacement;
                    replacement = "radio" === type ? $(radioTemplate) : $(checkboxTemplate), replacement.keypress(onKeypress).click(onClick).focus(onFocus).blur(onBlur), 
                    $(element).addClass("sr-only").after(replacement), replacement.after(disabledReplacement);
                }
            }
        }
        var labelSelector = ".checkbox > label, .radio > label", checkboxTemplate = "<button type='button' class='input-replacement'><span class='glyphicon glyphicon-ok'></span></button>", radioTemplate = "<button type='button' class='input-replacement'><span></span></button>", disabledReplacement = "<span class='disabled-replacement input-replacement'><span></span></span>";
        return {
            restrict: "EA",
            link: link
        };
    }
    angular.module("tw.form-styling").directive("twInput", TwInputStyling);
}(window.angular), function(angular) {
    "use strict";
    function TwSelectDirective() {
        return {
            require: "ngModel",
            bindToController: !0,
            controller: [ "$element", "$scope", "$transclude", TwSelectController ],
            controllerAs: "$ctrl",
            replace: !1,
            transclude: !0,
            restrict: "EA",
            scope: {
                ngModel: "=",
                ngRequired: "=",
                ngDisabled: "=",
                ngChange: "&",
                ngBlur: "&",
                options: "=",
                name: "@",
                disabled: "@",
                required: "@",
                placeholder: "@"
            },
            template: " 				<div class='btn-group btn-block tw-select' aria-hidden='true'> 					<button type='button' class='btn btn-input dropdown-toggle' 						data-toggle='dropdown' aria-expanded='false' 						ng-disabled='$ctrl.ngDisabled' 						tw-focusable> 						<span class='tw-select-selected' ng-if='$ctrl.ngModel != null'> 							<i class='icon {{$ctrl.selected.icon}}' ng-if='$ctrl.selected && $ctrl.selected.icon'> 							</i><i class='currency-flag currency-flag-{{$ctrl.selected.currency | lowercase}}' ng-if='$ctrl.selected && $ctrl.selected.currency'> 							</i><span class='selected-label'>{{$ctrl.selected.label}}</span> 						</span> 						<span class='form-control-placeholder' ng-if='$ctrl.ngModel == null'>{{$ctrl.placeholder}}</span> 						<span class='caret'></span> 					</button> 					<ul class='dropdown-menu' role='menu'> 						<li ng-class='{active: !$ctrl.ngModel}' 							ng-if='$ctrl.placeholder && !$ctrl.ngRequired'> 							<a href='' value='' class='tw-select-placeholder' tw-focusable> 								{{$ctrl.placeholder}} 							</a> 						</li> 						<li ng-if='$ctrl.placeholder && !$ctrl.ngRequired' class='divider'></li> 						<li 							ng-repeat='option in $ctrl.options' 							ng-class='{active: $ctrl.ngModel === option.value}'> 							<a href='' value='{{option.value}}' class='tw-select-option' tw-focusable> 								<i class='icon {{option.icon}}' ng-if='option.icon'> 								</i><i class='currency-flag currency-flag-{{option.currency | lowercase}}' ng-if='option.currency'> 								</i>{{option.label}} 							</a> 						</li> 						<li ng-if='$ctrl.hasTranscluded' class='divider'></li> 						<li ng-transclude ng-if='$ctrl.hasTranscluded' class='tw-select-transcluded'></li> 					</ul> 				</div> 				<input type='hidden' class='tw-select-hidden' 					name='{{$ctrl.name}}' 					value='{{$ctrl.ngModel}}' 					ng-disabled='$ctrl.ngDisabled' /> "
        };
    }
    function TwSelectController($element, $scope, $transclude) {
        var $ctrl = this, options = $ctrl.options, $ngModel = $element.controller("ngModel");
        $ctrl.search = "", preSelectModelValue($ngModel, $ctrl, options), setDefaultIfRequired($ngModel, $ctrl, $element, $ctrl), 
        addWatchers($ctrl, $scope, $ngModel), addEventHandlers($ctrl, $element, $ngModel, options), 
        checkForTranscludedContent($transclude, $ctrl);
    }
    function addWatchers($ctrl, $scope, $ngModel) {
        $scope.$watch("$ctrl.ngModel", function(newValue, oldValue) {
            (newValue || oldValue) && newValue !== oldValue && $ngModel.$setDirty(), modelChange(newValue, oldValue, $ctrl);
        });
    }
    function addEventHandlers($ctrl, $element, $ngModel, options) {
        $element.find(".btn, .dropdown-menu").on("focusout", function() {
            setTimeout(function() {
                0 !== $element.find(".btn:focus").length || $element.find(".btn-group").hasClass("open") || $element.trigger("blur");
            }, 150);
        }), $element.on("blur", function(event) {
            $ngModel.$setTouched();
        }), $element.find(".btn").on("keypress", function(event) {
            var characterCode = getCharacterFromKeypress(event);
            continueSearchAndSelectMatch($ngModel, $ctrl, options, characterCode), $element.find(".active a").focus();
        }), $element.find(".btn").on("click", function() {
            setTimeout(function() {
                $element.find(".active a").focus();
            });
        }), $element.find("ul").on("click", "a", function(event) {
            $element.find(".btn").focus(), optionFocus(event, options, $ngModel, $ctrl, this);
        }), $element.find("ul").on("focus", "a", function(event) {
            optionFocus(event, options, $ngModel, $ctrl, this);
        }), $element.find("ul").on("keypress", "a", function(event) {
            var characterCode = getCharacterFromKeypress(event);
            continueSearchAndSelectMatch($ngModel, $ctrl, options, characterCode), $element.find(".active a").focus();
        });
    }
    function checkForTranscludedContent($transclude, $ctrl) {
        $transclude(function(clone) {
            (clone.length > 1 || "" !== clone.text().trim()) && ($ctrl.hasTranscluded = !0);
        });
    }
    function getCharacterFromKeypress(event) {
        return String.fromCharCode(event.which || event.charCode || event.keyCode);
    }
    function optionFocus(event, options, $ngModel, $ctrl, optionElement) {
        if ($(event.target).hasClass("tw-select-option")) {
            var option = findOptionFromValue(options, optionElement.getAttribute("value"));
            selectOption($ngModel, $ctrl, option);
        } else $(event.target).hasClass("tw-select-placeholder") && resetOption($ngModel, $ctrl);
    }
    function preSelectModelValue($ngModel, $ctrl, options) {
        if ($ctrl.ngModel) {
            var option = findOptionFromValue(options, $ctrl.ngModel);
            selectOption($ngModel, $ctrl, option);
        }
    }
    function modelChange(newVal, oldVal, $ctrl) {
        if (newVal !== oldVal) {
            var option = findOptionFromValue($ctrl.options, newVal);
            option ? $ctrl.selected = option : $ctrl.selected = null;
        }
    }
    function findOptionFromValue(options, value) {
        var optionMatch = !1;
        return options.forEach(function(option) {
            String(option.value) === String(value) && (optionMatch = option);
        }), optionMatch;
    }
    function setDefaultIfRequired($ngModel, $ctrl, $element, $attrs) {
        ($ctrl.ngRequired || $attrs.required) && !$ctrl.ngModel && $ctrl.options[0] && selectOption($ngModel, $ctrl, $ctrl.options[0]);
    }
    function selectOption($ngModel, $ctrl, option) {
        $ngModel.$setViewValue(option.value), $ctrl.selected = option;
    }
    function resetOption($ngModel, $ctrl) {
        $ngModel.$setViewValue(null), $ctrl.selected = !1;
    }
    function continueSearchAndSelectMatch($ngModel, $ctrl, options, letter) {
        var found = searchAndSelect($ngModel, $ctrl, options, $ctrl.search + letter);
        return found ? $ctrl.search += letter : ($ctrl.search = letter, found = searchAndSelect($ngModel, $ctrl, options, $ctrl.search)), 
        found;
    }
    function searchAndSelect($ngModel, $ctrl, options, term) {
        var found = !1, searchTerm = term.toLowerCase();
        return options.forEach(function(option) {
            found || 0 === option.label.toLowerCase().indexOf(searchTerm) && (selectOption($ngModel, $ctrl, option), 
            found = !0);
        }), found;
    }
    angular.module("tw.form-components").directive("twSelect", TwSelectDirective);
}(window.angular), function(angular) {
    "use strict";
    function TwFormValidation() {
        return {
            restrict: "E",
            link: function(scope, element) {
                $(element).on("submit", function() {
                    $(element).find("[tw-validation].ng-invalid").closest(".form-group").addClass("has-error");
                    var invalidControl = $(element).find("input[type=checkbox].ng-invalid, input[type=radio].ng-invalid");
                    return invalidControl.closest(".checkbox, .radio").addClass("has-error"), invalidControl.parents(".form-group").addClass("has-error"), 
                    !0;
                });
            }
        };
    }
    angular.module("tw.form-validation").directive("form", TwFormValidation);
}(window.angular), function(angular) {
    function TwInputValidation() {
        function checkValid(input, label, formGroup) {
            setTimeout(function() {
                input.hasClass("ng-invalid") ? (label.addClass("has-error"), formGroup.addClass("has-error")) : (label.removeClass("has-error"), 
                checkFormGroup(formGroup));
            });
        }
        function checkFormGroup(formGroup) {
            var formGroupInvalidInputs = formGroup.find("input.ng-invalid"), formGroupValidInputsContainers = formGroup.find("input.ng-valid").closest(".checkbox, .radio");
            setTimeout(function() {
                formGroupValidInputsContainers.removeClass("has-error"), 0 === formGroupInvalidInputs.length && formGroup.removeClass("has-error");
            });
        }
        function link(scope, element, attrs, ctrl) {
            if (attrs.type) {
                var type = attrs.type.toLowerCase();
                if (("radio" === type || "checkbox" === type) && 0 !== $(element).closest(labelSelector).length) {
                    var formControl = $(element), label = formControl.closest("label");
                    label.on("click", function() {
                        checkValid(formControl, formControl.closest(".checkbox, .radio"), formControl.closest(".form-group"));
                    });
                }
            }
        }
        var labelSelector = ".checkbox > label, .radio > label";
        return {
            restrict: "E",
            link: link
        };
    }
    angular.module("tw.form-validation").directive("input", TwInputValidation);
}(window.angular), function(angular) {
    "use strict";
    function TwValidation() {
        return {
            restrict: "AC",
            require: "ngModel",
            link: validationLink
        };
    }
    function validationLink(scope, element, attrs, ngModel) {
        var formGroup = element.closest(".form-group");
        element.on("invalid", function(event) {
            event.preventDefault();
        }), ngModel.$validators.validation = function() {
            return scope.$evalAsync(function() {
                checkModelAndUpdate(ngModel, formGroup, element);
            }), !0;
        }, element.on("blur", function() {
            scope.$evalAsync(function() {
                checkModelAndUpdate(ngModel, formGroup, element);
            });
        });
    }
    function checkModelAndUpdate(ngModel, formGroup, element) {
        return ngModel.$valid ? (formGroup.removeClass("has-error"), void element.removeAttr("aria-invalid")) : void (ngModel.$touched && ngModel.$dirty && (formGroup.addClass("has-error"), 
        element.attr("aria-invalid", !0)));
    }
    angular.module("tw.form-validation").directive("twValidation", TwValidation);
}(window.angular);