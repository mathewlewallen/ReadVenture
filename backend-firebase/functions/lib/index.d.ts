import * as functions from 'firebase-functions';
export declare const analyzeText: functions.https.CallableFunction<any, any>;
export declare const getChildrenAnalytics: functions.https.CallableFunction<any, Promise<any>>;
export declare const trackReadingProgress: functions.https.CallableFunction<any, Promise<{
    success: boolean;
}>>;
export declare const updateUserSettings: functions.https.CallableFunction<any, Promise<{
    success: boolean;
}>>;
export declare const getParentChildren: functions.https.CallableFunction<any, Promise<{
    children: any;
}>>;
export declare const getReadingAnalytics: functions.https.CallableFunction<any, Promise<{
    totalTime: number;
    averageAccuracy: number;
    totalWords: number;
    readingSessions: any;
}>>;
export declare const updateParentSettings: functions.https.CallableFunction<any, Promise<{
    success: boolean;
}>>;
