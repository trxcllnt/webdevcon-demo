import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { episodesById } from '../json/episodesById';

export function loadEpisode(number) {
    return Observable.of({ podcast: episodesById[number] });
}
