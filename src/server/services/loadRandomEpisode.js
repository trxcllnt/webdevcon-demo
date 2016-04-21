import 'rxjs/add/observable/of';
import { episodes } from '../json/episodes';
import { Observable } from 'rxjs/Observable';

export function loadRandomEpisode() {
    return Observable.of({ podcast: episodes[
            Math.floor(Math.random() * episodes.length)
        ]
    });
}
