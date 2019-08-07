export interface ResourceStoreOptions {
    httpRequestMap: {
        [key: string]: (params: RequestParams) => void;
    };
}
export interface RequestParams {
    [key: string]: any;
}
export declare type ResourceStoreState = ({
    [key: string]: Resource<any>;
});
export interface Resource<T> {
    data?: T;
    error?: any;
    isBusy: boolean;
    isSuccess: boolean;
}
