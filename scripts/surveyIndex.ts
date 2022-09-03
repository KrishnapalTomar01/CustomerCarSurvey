const formId: string = "#CarSurveyForm";
const genderDropdownId: string = "#genderDropdown";
const ageTextId: string = "#Age";
const selectGenderId: string = "#selectGender";
const drivingLicenseRadioName: string = "drivingLicenseRadio";
const firstCarRadioName: string = "firstCarRadio";
const selectDriveTrainId: string = "#selectDriveTrain";
const fuelEmissionsRadioName: string = "fuelEmissionsRadio";
const carsCountId: string = "#carsCount";
const carMakeFormId: string = "#carMakeForm";
const selectCarMakeId: string = "#selectCarMake";
const carModelId: string = "#carModel";
const USER_RESPONSES = "USER_RESPONSES";

import { GenderOptions, DriveTrain, UserRespondentType } from "./modelTypes.js";
import { setItemInLocalStorageArray } from "./helpers/localStorageHelper.js"

let currentUser: IUserResponse = {
    age: 0,
    gender: GenderOptions.M,
    driveTrainType: null,
    hasCarLicense: null,
    isFirstCar: null,
    isWorriedForEmissions: null,
    numberOfCars: null,
    carTypes: null
};
const radioValidationMessage = "Please select a choice<br/>";

$(() => {
    var $signupForm = $(formId);
    jQuery.validator.addMethod("BMWModelValidation", AddBMWValidationFunction, "Model value not valid for BMW");

    $signupForm.validate({
        errorElement: 'em',
        rules:
        {
            drivingLicenseRadio: { required: true },
            firstCarRadio: { required: true },
            fuelEmissionsRadio: { required: true }
        },
        messages:
        {
            drivingLicenseRadio: { required: radioValidationMessage },
            fuelEmissionsRadio: { required: radioValidationMessage },
            firstCarRadio: { required: radioValidationMessage }
        },
        errorPlacement: (error, element) => {
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
        validateBeforeNext: (form, step, i) => {
            var stepIsValid = true;
            var validator = form.validate();
            $(':input', step).each(function (index) {
                var xy = validator.element(this);
                stepIsValid = stepIsValid && (typeof xy == 'undefined' || xy);
            });
            return stepIsValid && UpdateValuesOfUserResponse(i);
        },
        skipNextStep: (i: number) => {
            // If on second step and age greater than 25 then skip page of first car choice. 
            // Below 18 are already filtered out
            if (i == 1 && (currentUser.age > 25)) {
                return true;
            }
            return false;
        },
        progress: (i, count) => {
            $('#progress-complete').width('' + (i / count * 100) + '%');
        }
    });
    $(formId).show();
    InitializeGenderDropdown();
    onChangeCarsCount();
    $(formId).on("submit", onSubmitForm);
});

const onSubmitForm = (event: JQuery.Event) => {
    event.preventDefault();
    $(".car-model-class").each(function () {
        $(this).rules("add",
            {
                BMWModelValidation: true
            })
    });
    var isValid = $(formId).valid();
    if (isValid) {
        let driveTrainVal: string = $(selectDriveTrainId).val().toString();
        currentUser.driveTrainType = (<any>DriveTrain)[driveTrainVal];

        var fuelEmissionsRadioVal = $(`input[name="${fuelEmissionsRadioName}"]:checked`).val();

        if (fuelEmissionsRadioVal)
            currentUser.isWorriedForEmissions = fuelEmissionsRadioVal.toString() == "Yes";

        var carCount = Number($(carsCountId).val());
        currentUser.numberOfCars = carCount;
        const carTypesArray: ICarType[] = [];
        for (var i = 1; i <= carCount; i++) {
            const carType: ICarType = {
                carMake: $(selectCarMakeId + i).val().toString(),
                modelName: $(carModelId + i).val().toString()
            }
            carTypesArray.push(carType);
        }
        currentUser.carTypes = carTypesArray;

        endSurvey(UserRespondentType.Targetables);
    }
}

const endSurvey = (respondentType: number) => {
    setItemInLocalStorageArray<IUserResponse>(USER_RESPONSES, currentUser);
    location.href = `/survey/endsurvey/${respondentType}`;
}

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
                success: (data) => {
                    //data contains the html generated by partial view
                    $(carMakeFormId).empty().append(data);
                },
                error: (jxhr) => {
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
}

const UpdateValuesOfUserResponse = (i: number): boolean => {
    switch (i) {
        case 0:
            currentUser.age = Number($(ageTextId).val());
            if (currentUser.age < 18) {
                endSurvey(UserRespondentType.Adolescents);
                return false;
            }
            break;
        case 1:
            var licenseRadioVal = $(`input[name="${drivingLicenseRadioName}"]:checked`).val();

            if (licenseRadioVal)
                currentUser.hasCarLicense = licenseRadioVal.toString() == "Yes";
            if (!currentUser.hasCarLicense) {
                endSurvey(UserRespondentType.Unlicensed);
                return false;
            }
            break;
        case 2:
            var firstCarRadioValue = $(`input[name="${firstCarRadioName}"]:checked`).val();

            if (firstCarRadioValue)
                currentUser.isFirstCar = firstCarRadioValue.toString() == "Yes";
            if (currentUser.isFirstCar) {
                endSurvey(UserRespondentType.FirstTimers);
                return false;
            }
            break;
        default:
            return false;
    }
    return true;
}

const InitializeGenderDropdown = () => {
    var $GenderDropdown = $(genderDropdownId);

    $GenderDropdown
        .append(
            $(document.createElement('select')).prop({
                id: 'selectGender',
                name: 'gender'
            }).addClass("col-md-3 form-control")
        );

    const GenderArray = Object.keys(GenderOptions).filter((v) => isNaN(Number(v)));
    for (const val of GenderArray) {
        $(selectGenderId).append($(document.createElement('option')).prop({
            value: val,
            text: val
        }))
    }

    $(selectGenderId).on('change', function () {
        let genderVal: string = $(this).val().toString();
        currentUser.gender = (<any>GenderOptions)[genderVal];
    });
}

const AddBMWValidationFunction = (value: any, element: HTMLElement): boolean => {
    const idVal = element.getAttribute("dataid");
    const carMakeValue: string = $(selectCarMakeId + idVal).val().toString();
    const carModelinputValue: string = value.toString();
    const patternOne = /^M?\d{3}(d|i)?$/i;
    const patternTwo = /^(X|Z)\d{1}$/i;
    if (carMakeValue == "BMW") {
        return patternOne.test(carModelinputValue) || patternTwo.test(carModelinputValue);
    }
    return true;
}
