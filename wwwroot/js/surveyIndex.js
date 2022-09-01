const formId = "#CarSurveyForm";
const genderDropdownId = "#genderDropdown";
const ageTextId = "#Age";
const selectGenderId = "#selectGender";
var GenderOptions;
(function (GenderOptions) {
    GenderOptions[GenderOptions["M"] = 0] = "M";
    GenderOptions[GenderOptions["F"] = 1] = "F";
    GenderOptions[GenderOptions["Other"] = 2] = "Other";
})(GenderOptions || (GenderOptions = {}));
var DriveTrain;
(function (DriveTrain) {
    DriveTrain["FWD"] = "FWD";
    DriveTrain["RWD"] = "RWD";
    DriveTrain["DontKnow"] = "I Don't know";
})(DriveTrain || (DriveTrain = {}));
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
    $signupForm.validate({ errorElement: 'em' });
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
        progress: function (i, count) {
            $('#progress-complete').width('' + (i / count * 100) + '%');
        }
    });
    console.log("Form initialized");
    InitializeGenderDropdown();
});
const UpdateValuesOfUserResponse = (i) => {
    switch (i) {
        case 0:
            console.log($(ageTextId).val());
            currentUser.age = Number($(ageTextId).val());
            console.log("currentUser = ");
            console.log(currentUser);
            if (currentUser.age < 18) {
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
    }).addClass("col-md-3"));
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