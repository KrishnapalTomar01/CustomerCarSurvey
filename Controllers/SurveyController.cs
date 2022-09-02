using Microsoft.AspNetCore.Mvc;
using car_survey_app.Models;
using Newtonsoft.Json;

namespace dotnet_core_ts.Controllers;

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
    public IActionResult EndSurvey(){
        return View();
    }

}
