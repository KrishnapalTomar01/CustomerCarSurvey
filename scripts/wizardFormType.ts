type wizardFormType = {
    validateBeforeNext(obj: any, obj2: any, step: number): boolean,
    progress(i: number, count: number) : void,
    skipNextStep(i : number) : boolean,
    submitButton: string,
    nextBtnClass: string,
    prevBtnClass: string,
    buttonTag: string
}

export enum GenderOptions {
    M,
    F,
    Other
}

export enum DriveTrain
{
    FWD = "FWD",
    RWD = "RWD",
    DontKnow = "I Don't know"
}

declare global {
    //Add functions in jquery
    export interface JQuery {
        formToWizard(obj: wizardFormType) : void,
    }

    export interface IUserResponse {
        age: number,
        gender: GenderOptions,
        hasCarLicense: boolean,
        isFirstCar: boolean,
        driveTrainType : DriveTrain,
        isWorriedForEmissions: boolean,
        numberOfCars: number,
        carTypes: ICarType[]
    }
    
    export interface ICarType {
        carMake: string,
        modelName: string
    }
}
export {};