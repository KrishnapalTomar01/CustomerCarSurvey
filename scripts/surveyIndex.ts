const formId = "#CarSurveyForm";
const genderDropdownId = "#genderDropdown";
let currentUser: IUserResponse;

enum GenderOptions {
    M,
    F,
    Other
}

enum DriveTrain
{
    FWD = "FWD",
    RWD = "RWD",
    DontKnow = "I Don't know"
}

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
            console.log(i);
            return stepIsValid;
        },
        progress: function (i, count) {
            $('#progress-complete').width('' + (i / count * 100) + '%');
        }
    });
    console.log("Form initialized");
    InitializeGenderDropdown();
});

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
        $('#selectGender').append($(document.createElement('option')).prop({
            value: val,
            text: val
        }))
    }
}
