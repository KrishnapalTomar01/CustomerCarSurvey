using Microsoft.AspNetCore.Mvc;
using car_survey_app.Models;

namespace car_survey_app.Controllers;

public class SurveyController : Controller
{
    private readonly ILogger<SurveyController> _logger;

    public SurveyController(ILogger<SurveyController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public ActionResult PartialViewCarForm(int num)
    {
        return PartialView("_CarMakeLayout", num);
    }
    public IActionResult EndSurvey(int id)
    {
        return View((UserRespondentType)id);
    }

}
