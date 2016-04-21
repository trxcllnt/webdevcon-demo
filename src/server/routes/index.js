import { episodes } from './episodes';
import { episodesById } from './episodesById';
import { episodeScrollTop } from './episodeScrollTop';

export function routes() {
    return ([]
        .concat(episodes())
        .concat(episodesById())
    );
}

export function userRoutes() {
    return ([]
        .concat(episodeScrollTop())
    );
}
