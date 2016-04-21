import {
    ref as $ref,
    atom as $atom,
    pathValue as $pathValue
} from 'falcor-json-graph';

export function episodeScrollTop() {
    const scrollCache = {};
    return [{
        route: `episodes.scrollTop`,
        get() {
            return $pathValue(
                `episodes.scrollTop`,
                scrollCache[this.userId] || 0
            );
        },
        set({ episodes }) {
            return $pathValue(
                `episodes.scrollTop`,
                scrollCache[this.userId] = episodes.scrollTop
            );
        }
    }];
}
