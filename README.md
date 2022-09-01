# CarCustomerSurvey

## Run Application

### 1. Prerequisite

Node js and dotnet SDK is required to run the application.  
Install Node js - https://nodejs.org/en/download/ (Latest LTS Version: 16.17.0)  
Install dotnet SDK - https://dotnet.microsoft.com/en-us/download (Latest - Dotnet core 6.0)

### 2. Clone application
Open terminal to folder where you want the project to be placed.  
Run : 
> git clone https://github.com/KrishnapalTomar01/CarCustomerSurvey.git

### 3. Run App

Application will run at https://localhost:7134 or http://localhost:5211 [Defined in LaunchSettings file](properties/launchSettings.json)

#### a) From Visual Studio : 
Open .csproj file of project to open the project.   
Restore packages (optional) -> Build Application (optional) -> Run Application 


#### b) From Visual Studio Code : 
Open project folder in visual studio code.  
Click yes button for prompt asking for setting up debug options for app  
Under run and debug -> click 'Start debugging' or 'Run without debugging'

#### c) From command line:
Locate to application folder on CLI / terminal where .csproj is placed.   
Run command :
> dotnet build 
> dotnet run

Open https://localhost:7134 in browser








