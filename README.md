# CustomerCarSurvey

## Run Application

### 1. Prerequisite **

Node js and dotnet SDK is required to run the application.  
Install Node js - https://nodejs.org/en/download/ (Latest LTS Version: 16.17.0)  
Install dotnet SDK - https://dotnet.microsoft.com/en-us/download (Download - Dotnet core SDK 6.0)

### 2. Clone application
Open terminal to folder where you want the project to be placed.  
Run : 
> git clone https://github.com/KrishnapalTomar01/CustomerCarSurvey.git

### 3. Run App

Application will run at https://localhost:7129 or http://localhost:5108 [Defined in LaunchSettings file](properties/launchSettings.json)

#### a) From command line:
Locate to application folder on CLI / terminal where .csproj is placed (Under Folder - CustomerCarSurvey).   
Run command :
> dotnet build (optional)
> dotnet run

Open https://localhost:7129 in browser

#### b) From Visual Studio Code : 
Open project folder (/CustomerCarSurvey) in visual studio code. 
Install C# extension in visual studio code. ( ** Can use visual studio code terminal to run app using 'dotnet run'). Open visual studio code and app folder again to set up debugging.
Click yes button for prompt asking for setting up debug options for app.  
Under run and debug -> click 'Start debugging' or 'Run without debugging'

#### c) From Visual Studio : 
Open .csproj file of project to open the project.   
Restore packages (optional) -> Build Application (optional) -> Run Application 













