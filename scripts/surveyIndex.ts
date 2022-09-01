const formId = "#CarSurveyForm";
const genderDropdownId = "#genderDropdown";
const ageTextId = "#Age";
const selectGenderId = "#selectGender"

enum GenderOptions {
    M,
    F,
    Other
}

enum DriveTrain {
    FWD = "FWD",
    RWD = "RWD",
    DontKnow = "I Don't know"
}

let currentUser: IUserResponse = {
    age : 0,
    gender : GenderOptions.M,
    driveTrainType: null,
    hasCarLicense: null,
    isFirstCar : null,
    isWorriedForEmissions : null,
    numberOfCars : null,
    carTypes : null
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

const UpdateValuesOfUserResponse = (i: number) : boolean => {
    switch(i) {
        case 0: 
            currentUser.age = Number($(ageTextId).val());
            if(currentUser.age < 18){
                location.href = "/survey/endsurvey";
                return false;
            }
            return true;
        case 1:
            break;
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

    $(selectGenderId).on('change', function()
    {
        let genderVal : string  = $(this).val().toString();
        currentUser.gender = (<any>GenderOptions)[genderVal];
    });

}
