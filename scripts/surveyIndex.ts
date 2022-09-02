const formId: string = "#CarSurveyForm";
const genderDropdownId: string = "#genderDropdown";
const ageTextId: string = "#Age";
const selectGenderId: string = "#selectGender";
const drivingLicenseRadioName: string = "drivingLicenseRadio";
const firstCarRadioName: string = "firstCarRadio";
import { GenderOptions, DriveTrain } from "./wizardFormType.js";

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

$(function () {
    var $signupForm = $(formId);

    $signupForm.validate({
        errorElement: 'em',
        rules:
        {
            drivingLicenseRadio: { required: true },
            firstCarRadio: { required: true }
        },
        messages:
        {
            drivingLicenseRadio:
            {
                required: "Please select a choice<br/>"
            },
            firstCarRadio:
            {
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
        submitButton: 'SaveAccount',
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
        skipNextStep: function (i: number) {
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
    console.log("Form initialized");
    $("#CarSurveyForm").show();
    InitializeGenderDropdown();
});

const UpdateValuesOfUserResponse = (i: number): boolean => {
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
}

const InitializeGenderDropdown = () => {
    var $GenderDropdown = $(genderDropdownId);

    $GenderDropdown
        .append(
            $(document.createElement('select')).prop({
                id: 'selectGender',
                name: 'gender'
            }).addClass("col-md-3")
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
