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
        //TempData["FormPage"] = 1;
        return View();
    }

    [HttpPost]
    public IActionResult Index(UserResponse user) {
        if(!TempData.ContainsKey("FormPage")) {
            TempData["FormPage"] = 1;
        }

        if((TempData["FormPage"] as Nullable<int>).GetValueOrDefault() == 1 && user.Age < 18){
            return View("EndSurvey","Thank for taking the time to submit their response");
        }

        if(TempData.ContainsKey("users")) {
            List<UserResponse> users = JsonConvert.DeserializeObject<List<UserResponse>>(TempData["users"] as string);
            users.Add(user);
            TempData["users"] = JsonConvert.SerializeObject(users);
        }
        else {
            List<UserResponse> users = new List<UserResponse>() {user};
            TempData["users"] = JsonConvert.SerializeObject(users);
        }
        TempData["user"] = JsonConvert.SerializeObject(user);
        TempData.Keep();

        //Increment form page number
        if(TempData.ContainsKey("FormPage")){
            int? data = TempData["FormPage"] as Nullable<int>;
            TempData["FormPage"] = data.GetValueOrDefault() + 1;
        }

        return View();
    }

    public IActionResult EndSurvey(){
        return View();
    }

}
