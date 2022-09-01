using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using car_survey_app.Models;
using Newtonsoft.Json;

namespace car_survey_app.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        if(TempData.ContainsKey("user")){
            UserResponse user = JsonConvert.DeserializeObject<UserResponse>(TempData["user"] as string);
            Console.WriteLine("Age = "+ user.Age +", Gender = "+user.Gender.ToString());
            TempData.Keep();
        }
        if(TempData.ContainsKey("users")){
            List<UserResponse> users = JsonConvert.DeserializeObject<List<UserResponse>>(TempData["users"] as string);
            Console.WriteLine("Total users count = " + users.Count);
            TempData.Keep();
        }
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
