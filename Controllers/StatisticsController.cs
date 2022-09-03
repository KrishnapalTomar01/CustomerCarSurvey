using Microsoft.AspNetCore.Mvc;

namespace car_survey_app.Controllers;

public class StatisticsController : Controller
{
    private readonly ILogger<StatisticsController> _logger;

    public StatisticsController(ILogger<StatisticsController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

}
