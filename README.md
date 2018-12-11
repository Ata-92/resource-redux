# Resource Redux
Resource redux is a redux library for easily managing http resources lifecyle. It works with `redux-saga`, `react-redux` and `redux`. It has builtin reusable store actions (generators), reducer and selectors.

## Installation
- Installing from npm registry
```sh
npm i --save resource-redux
```
- You can also manually clone & build if you have lerna use cases
```sh
git clone git@github.com:oplog/resource-redux.git
```

## The Design
In resource-redux, each http resource is defined as the following model;
```ts
export interface Resource<T> {
    data?: T; // The data that is returned from the http call
    error?: Error; // The error (non HTTP 200) body that is returned from the http call
    isBusy: boolean; // Represents the request continuity
}
```

These http resource states are kept in redux state tree as the following model;
```ts
{
    "createUser": Resource<any>,
    "updateUser": Resource<any>
}
```

The state is mutated by the resourceType (i.e "createUser"), builtin actions & reducer.

## Getting Started

In your store type definition add resource store state;
```ts
import { ResourceStoreState } from "resource-redux";

export interface StoreState {
    // other type definitions of store
    resources: ResourceStoreState;
}
```

####Add resource types for a model definition;
```ts
export enum ResourceType {
    CreateUser = "createUser" // Here, string enums are required
    UpdateUser = "updateUser"
}
```

####Add initial states of your resources;

```ts
import { initialResourceState } from "resource-redux";

// This is the initial state of your redux state configuration
export const initialState = {
    resources: {
        [ResourceType.CreateUser]: { ...initialResourceState },
        [ResourceType.UpdateUser]: { ...initialResourceState }
    }
}
```

####Create a http api map and configure your redux saga middleware

Http api map is a dictionary which has the resource type as keys and http call functions as the value;
```ts

export type RequestParams = Dictionary<any>;

function createUser(params: RequestParams) {
    const accessToken = getAccessToken();
    // Here the following function performs an http call and returns the Promise object
    // The following function is auto generated by swagger
    return api.Users.apiCreateUser(
        params.createUser, // These are the post body parameters that is passed by resource redux saga
        addAuthToHeader(accessToken)
    ).then(r => r);
}

const resourceApiMap = {
  [ResourceType.CreateUser]: createUser,
}

// middleware configuration
export const resources = resourceStore({
  httpRequestMap: resourceApiMap,
});

sagaMiddleware.run(resources.resourceSaga); // This is required for saga to catch your requested actions
```

####Mapping props to store & Dispatching actions in containers;
```ts
import { resourceActions, resourceSelectors } from "resource-redux";

function mapStateToProps({resources}: StoreState) {
    return {
        user: resourceSelectors.getData(resources, ResourceType.User)
    };
}

function mapDispatchToProps(dispatch: Dispatch<resourceActions.ResourceAction>) {
    return {
        onUserSubmit: () => {
            dispatch(
                resourceActions.resourceRequested(ResourceType.CreateUser, {
                    customerFormModel
                })
            );
        }
    }
}
```