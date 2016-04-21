import { App } from '../shared/components/App';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export function reloadHotModules(module) {

    const hotModules = new BehaviorSubject({ App });

    if (module.hot) {
        module.hot.accept('../shared/components/App', () => {
            hotModules.next({
                App: require('../shared/components/App')
            });
        })
    }

    return hotModules;
}
