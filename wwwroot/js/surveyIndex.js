const formId = "#CarSurveyForm";
const genderDropdownId = "#genderDropdown";
const ageTextId = "#Age";
const selectGenderId = "#selectGender";
const drivingLicenseRadioName = "drivingLicenseRadio";
const firstCarRadioName = "firstCarRadio";
const selectDriveTrainId = "#selectDriveTrain";
const fuelEmissionsRadioName = "fuelEmissionsRadio";
const carsCountId = "#carsCount";
const carMakeFormId = "#carMakeForm";
const selectCarMakeId = "#selectCarMake";
const carModelId = "#carModel";
import { GenderOptions, DriveTrain } from "./wizardFormType.js";
let currentUser = {
    age: 0,
    gender: GenderOptions.M,
    driveTrainType: null,
    hasCarLicense: null,
    isFirstCar: null,
    isWorriedForEmissions: null,
    numberOfCars: null,
    carTypes: null
};
$(function () {
    var $signupForm = $(formId);
    jQuery.validator.addMethod("BMWModelValidation", function (value, element) {
        const idVal = element.getAttribute("dataid");
        const carValue = $(selectCarMakeId + idVal).val().toString();
        const inputValue = value.toString();
        const patternOne = /^M?\d{3}(d|i)?$/i;
        const patternTwo = /^(X|Z)\d{1}$/i;
        return carValue != "BMW" || (carValue == "BMW" && (patternOne.test(inputValue) || patternTwo.test(inputValue)));
    }, "Model value not valid for BMW");
    $signupForm.validate({
        errorElement: 'em',
        rules: {
            drivingLicenseRadio: { required: true },
            firstCarRadio: { required: true },
            fuelEmissionsRadio: { required: true }
        },
        messages: {
            drivingLicenseRadio: {
                required: "Please select a choice<br/>"
            },
            fuelEmissionsRadio: {
                required: "Please select a choice<br/>"
            },
            firstCarRadio: {
                required: "Please select a choice<br/>"
            }
        },
        errorPlacement: function (error, element) {
            if (element.is(":radio")) {
                error.insertAfter(element.parents('.container-radio'));
            }
            else {
                // This is the default behavior 
                error.insertAfter(element);
            }
        }
    });
    $signupForm.formToWizard({
        submitButton: 'SubmitBtn',
        nextBtnClass: 'btn btn-primary next',
        prevBtnClass: 'btn btn-default prev',
        buttonTag: 'button',
        validateBeforeNext: function (form, step, i) {
            var stepIsValid = true;
            var validator = form.validate();
            $(':input', step).each(function (index) {
                var xy = validator.element(this);
                stepIsValid = stepIsValid && (typeof xy == 'undefined' || xy);
            });
            return stepIsValid && UpdateValuesOfUserResponse(i);
        },
        skipNextStep: function (i) {
            // If on second step and age greater than 25 then skip page of first car choice. 
            // Below 18 are already filtered out
            if (i == 1 && (currentUser.age > 25)) {
                return true;
            }
            return false;
        },
        progress: function (i, count) {
            $('#progress-complete').width('' + (i / count * 100) + '%');
        }
    });
    $(formId).show();
    InitializeGenderDropdown();
    onChangeCarsCount();
    $(formId).on("submit", (event) => {
        event.preventDefault();
        $(".car-model-class").each(function () {
            $(this).rules("add", {
                BMWModelValidation: true
            });
        });
        var isValid = $(formId).valid();
        if (isValid) {
            let driveTrainVal = $(selectDriveTrainId).val().toString();
            currentUser.driveTrainType = DriveTrain[driveTrainVal];
            var fuelEmissionsRadioVal = $(`input[name="${fuelEmissionsRadioName}"]:checked`).val();
            if (fuelEmissionsRadioVal)
                currentUser.isWorriedForEmissions = fuelEmissionsRadioVal.toString() == "Yes";
            var carCount = Number($(carsCountId).val());
            currentUser.numberOfCars = carCount;
            const carTypesArray = [];
            for (var i = 1; i <= carCount; i++) {
                const carType = {
                    carMake: $(selectCarMakeId + i).val().toString(),
                    modelName: $(carModelId + i).val().toString()
                };
                carTypesArray.push(carType);
            }
            currentUser.carTypes = carTypesArray;
            console.log(currentUser);
        }
    });
});
const onChangeCarsCount = () => {
    $(carsCountId).on('input', (event) => {
        if ($(carsCountId).valid()) {
            var num = Number($(carsCountId).val());
            //Generating dynamic partial view
            $.ajax({
                url: '/Survey/PartialViewCarForm',
                type: 'POST',
                data: { num },
                cache: false,
                success: function (data) {
                    //data contains the html generated by partial view
                    $(carMakeFormId).empty().append(data);
                },
                error: function (jxhr) {
                    if (typeof (console) != 'undefined') {
                        console.log(jxhr.status);
                        console.log(jxhr.responseText);
                    }
                }
            });
        }
        else {
            $(carMakeFormId).empty();
        }
    });
};
const UpdateValuesOfUserResponse = (i) => {
    switch (i) {
        case 0:
            currentUser.age = Number($(ageTextId).val());
            if (currentUser.age < 18) {
                location.href = "/survey/endsurvey";
                return false;
            }
            return true;
        case 1:
            var licenseRadioVal = $(`input[name="${drivingLicenseRadioName}"]:checked`).val();
            if (licenseRadioVal)
                currentUser.hasCarLicense = licenseRadioVal.toString() == "Yes";
            if (!currentUser.hasCarLicense) {
                location.href = "/survey/endsurvey";
                return false;
            }
            return true;
        case 2:
            var firstCarRadioValue = $(`input[name="${firstCarRadioName}"]:checked`).val();
            if (firstCarRadioValue)
                currentUser.isFirstCar = firstCarRadioValue.toString() == "Yes";
            if (currentUser.isFirstCar) {
                location.href = "/survey/endsurvey";
                return false;
            }
            return true;
        default:
            return false;
    }
};
const InitializeGenderDropdown = () => {
    var $GenderDropdown = $(genderDropdownId);
    $GenderDropdown
        .append($(document.createElement('select')).prop({
        id: 'selectGender',
        name: 'gender'
    }).addClass("col-md-3 form-control"));
    const GenderArray = Object.keys(GenderOptions).filter((v) => isNaN(Number(v)));
    for (const val of GenderArray) {
        $(selectGenderId).append($(document.createElement('option')).prop({
            value: val,
            text: val
        }));
    }
    $(selectGenderId).on('change', function () {
        let genderVal = $(this).val().toString();
        currentUser.gender = GenderOptions[genderVal];
    });
};
//# sourceMappingURL=surveyIndex.js.map