import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import { Observable } from 'rxjs/Observable';
import { Model, Router } from 'reaxtor';
import { routes, userRoutes } from '../routes';

class AppRouter extends Router.createClass(routes()) {
    constructor() {
        super();
        this.routeUnhandledPathsTo({
            set(jsonGraphEnv) {
                console.log(jsonGraphEnv);
                return Observable.of(jsonGraphEnv);
            }
        });
    }
}

class UserRouter extends Router.createClass(userRoutes()) {
    constructor(userId) {
        super();
        this.userId = userId;
    }
}

export function getDataSourceFactory(
    users = {}, appModel = new Model({
        source: new AppRouter()
    })) {

    return function getDataSource(req) {

        const userId = req.cookies.userId || 'anonymous';
        const userModel = (users[userId] || (users[userId] = new Model({
            source: new UserRouter(userId)
        })));

        userModel._source.routeUnhandledPathsTo(appModel.asDataSource());

        return userModel.asDataSource();
    };
}
