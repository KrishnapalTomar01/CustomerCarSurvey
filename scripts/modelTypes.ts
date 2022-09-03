export type wizardFormType = {
    validateBeforeNext(obj: any, obj2: any, step: number): boolean,
    progress(i: number, count: number): void,
    skipNextStep(i: number): boolean,
    submitButton: string,
    nextBtnClass: string,
    prevBtnClass: string,
    buttonTag: string
}

export const USER_RESPONSES = "USER_RESPONSES";

export enum GenderOptions {
    M = "M",
    F = "F",
    Other = "Other"
}

export enum DriveTrain {
    FWD = "FWD",
    RWD = "RWD",
    DontKnow = "I Don't know"
}

export enum UserRespondentType {
    Adolescents,
    Unlicensed,
    FirstTimers,
    Targetables
}
export interface JQuery {
    formToWizard(obj: wizardFormType): void,
}

export interface IUserResponse {
    age: number,
    gender: GenderOptions,
    hasCarLicense: boolean,
    isFirstCar: boolean,
    driveTrainType: DriveTrain,
    isWorriedForEmissions: boolean,
    numberOfCars: number,
    carTypes: ICarType[]
}

export interface ICarType {
    carMake: string,
    modelName: string
}