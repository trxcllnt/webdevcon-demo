/** @jsx hJSX */
import { hJSX, Component } from 'reaxtor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { app as appClassName } from './styles.css';

import { Episodes } from './Episodes';

export class App extends Component {
    createChildren(models) {

        const episodes = new Episodes(models.deref(`episodes`));

        return models.switchMap(
            (tuple) => episodes,
            (tuple, episodesVDom) => [tuple, episodesVDom]
        );
    }
    loader([model]) {
        return model.get(
            `episodes['length', 'scrollTop']`,
        );
    }
    render([[model, state], episodes]) {
        return (
            <article id='app' key='app' className={appClassName}>
                {episodes}
            </article>
        );
    }
}
