import { appLocalStorage } from "./helpers/localStorageHelper";
import { USER_RESPONSES, IUserResponse, DriveTrain, ICarType } from "./modelTypes";
import { Chart } from "chart.js";
const respondentsPercentageChartId = "respondentsPercentage";
const respondentNumberChartId = "respondentsCount";
const fuelEmissionPieId = "fuelEmissionPie";
const driveTrainPieId = "driveTrainPie";
const carMakeModelChartId = "carMakeModelChart";
const backgroundColorsStack = ["#22aa99", "#994499", "#316395", "#109618", "#66aa00", "#990099", "#dc3912", "#3366cc", "#dd4477"];
const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'];
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'];
const colorsCount = backgroundColorsStack.length;
const averageCarsId = "#averageCarsId";
const chartsContainerId = "#charts-container";
const noDataId = "#noData";

export namespace statisticsPage {
    export const InitializePage = () => {
        $(() => {
            const userResponses = appLocalStorage.getLocalStorageValue<IUserResponse[]>(USER_RESPONSES);
            if(!userResponses || userResponses.length == 0) { 
                $(noDataId).html("No survey data available");
                $(chartsContainerId).hide();
                return; 
            }
            let numberOfAdolescents = 0;
            let numberOfUnlicensed = 0;
            let numberOfFirstTimers = 0;

            let targetableUsers: IUserResponse[] = [];
            userResponses.forEach((value) => {
                if (value.age < 18) numberOfAdolescents++;
                else if (value.hasCarLicense === false) numberOfUnlicensed++;
                else if (value.isFirstCar === true) numberOfFirstTimers++;
                else targetableUsers.push(value);
            });
            const numberOfTargetables = targetableUsers.length;
            const totalCount = userResponses.length;
                        
            const respondentChartLabels = ['Adolescents', 'Unlicensed', 'First-timers', 'Targetables'];
            const respondentChartData = [numberOfAdolescents, numberOfUnlicensed, numberOfFirstTimers, numberOfTargetables];
            createBarChartRespondents(respondentNumberChartId, respondentChartData, respondentChartLabels);

            let percentDataRespGroups: number[] = [
                calculatePercentage(numberOfAdolescents, totalCount),
                calculatePercentage(numberOfUnlicensed, totalCount),
                calculatePercentage(numberOfFirstTimers, totalCount),
                calculatePercentage(numberOfTargetables, totalCount)
            ];
            const respondentLabelsPie = ['Adolescents in %', 'Unlicensed in %', 'First-timers in %', 'Targetables in %'];
            createPieChart(respondentsPercentageChartId, percentDataRespGroups, respondentLabelsPie);

            const usersCountForEmission = targetableUsers.filter((value) => value.isWorriedForEmissions).length;
            const percentUserEmissions = calculatePercentage(usersCountForEmission, numberOfTargetables);
            let percentDataEmissions: number[] = [
                percentUserEmissions,
                100 - percentUserEmissions
            ];
            const usersCareForEmissionLabels = ['Targetables that care about fuel emissions in %', 'Targetables that don\'t care about fuel emissions in %'];
            createPieChart(fuelEmissionPieId, percentDataEmissions, usersCareForEmissionLabels);
            
            const countFWD = targetableUsers.filter((value) => value.driveTrainType == DriveTrain.FWD || value.driveTrainType == DriveTrain.DontKnow).length;
            const percentUserFWD = calculatePercentage(countFWD, numberOfTargetables);
            let percentDataFWD: number[] = [
                percentUserFWD,
                100 - percentUserFWD
            ];
            const usersFWDLabels = ['Targetables that picked FWD or “I don\'t know” for drivetrain in %', 'Targetable that picked RWD for drivetrain in %'];
            createPieChart(driveTrainPieId, percentDataFWD, usersFWDLabels);

            initializeAverageCarsCount(targetableUsers);
            createStackChartMakeModel(carMakeModelChartId, targetableUsers);            
        })
    }
}

const createBarChartRespondents = (chartId: string, data: number[], labels: string[]) => {
    new Chart(chartId, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'No. of each respondent group',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

const calculatePercentage = (value: number, total: number): number => {
    const calcValue = value / total * 100;
    return Number(calcValue.toFixed(2));
}

const createPieChart = (chartId: string, data: number[], labels: string[]) => {
    new Chart(chartId, {
        type: 'pie',
        data: {
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }],
            labels: labels
        },
        options: {
            responsive: false
        }
    });
}

const initializeAverageCarsCount = (targetableUsers: IUserResponse[]) => {
    let carsCount = 0;
    targetableUsers.forEach((value) => {
        carsCount += value.numberOfCars;
    });
    let averageCars = carsCount / targetableUsers.length;
    $(averageCarsId).html(averageCars.toFixed(2)); 
}

const createStackChartMakeModel = (chartId: string, targetableUsers: IUserResponse[]) => {
    let carMakeModelList: ICarType[] = [];
    // combining make models list of all targetable users
    targetableUsers.forEach((value) => {
        if (value.carTypes.length > 0) {
            carMakeModelList = carMakeModelList.concat(value.carTypes);
        }
    });
    // unique car make values
    const carMakeList = [...new Set(carMakeModelList.map(item => item.carMake))];
    const carModelMap = new Map<string, Chart.ChartDataSets>();
    let backgroundColorIndex: number = 0;
    // prepare stack chart dataSet for each car model name
    carMakeModelList.forEach((value) => {
        let modelName = value.modelName.trim().toUpperCase();
        if (carModelMap.has(modelName)) {
            let chartSet = carModelMap.get(modelName);
            let carMakeIndex = carMakeList.indexOf(value.carMake);
            if (carMakeIndex != -1) {
                let dataVal = Number(chartSet.data[carMakeIndex]);
                chartSet.data[carMakeIndex] = dataVal + 1;
            }
        }
        else {
            let colorIndex = backgroundColorIndex % colorsCount;
            backgroundColorIndex++;
            let dataArray: number[] = new Array(carMakeList.length).fill(0);
            let carMakeIndex = carMakeList.indexOf(value.carMake);
            if (carMakeIndex != -1)
                dataArray[carMakeIndex] = 1;
            carModelMap.set(modelName,
                {
                    label: modelName,
                    data: dataArray,
                    backgroundColor: backgroundColorsStack[colorIndex]
                });
        }
    });
    const carMakeDataSet = Array.from(carModelMap.values());
    new Chart(chartId, {
        type: 'bar',
        data: {
            labels: carMakeList,
            datasets: carMakeDataSet
        },
        options: {
            responsive: false,
            legend: {
                position: 'right'
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
}