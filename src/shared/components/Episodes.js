/** @jsx hJSX */
import { Episode } from './Episode';
import { hJSX, Container } from 'reaxtor';
import { episodes as episodesClassName } from './styles.css';
import { episodesList as episodesListClassName } from './styles.css';
import { episodesScroller as episodesScrollerClassName } from './styles.css';
import { episodesListContainer as episodesListContainerClassName } from './styles.css';

import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/auditTime';
import { Observable } from 'rxjs/Observable';

export class Episodes extends Container {
    constructor(props, createChild) {
        super({
            ...props,
            listHeight: 600,
            virtualOffset: 0,
            start: 0, end: 0,
            width: 600, height: 600 }, createChild);
    }
    deref(subjects, children, model, state) {
        return super.deref(subjects, children, model, state, {
            to: this.end,
            from: this.start
        });
    }
    createChild(models, index, state) {
        return new Episode({ models, index });
    }
    loadProps(model) {
        return model.getItems(
            () =>   [['scrollTop'], ['length']],
            (xs) => getEpisodePaths.call(this, xs)
        );
    }
    loadState(model, props) {
        return this
            .listen('scroll-episodes')
            .auditTime(10)
            .switchMap(
                (ev) => model.set({ json: {
                    scrollTop: ev.target.scrollTop
                }}),
                (ev, { json }) => json)
    }
    render(model, { scrollTop = 0 }, ...episodes) {
        return (
            <section key='episodes' className={episodesClassName}>
                <h2>Episodes</h2>
                <div key='episodes-scroller'
                     className={episodesScrollerClassName}
                     on-scroll={this.dispatch('scroll-episodes')}
                     hook={{
                        insert(vnode) {
                            vnode.elm.scrollTop = scrollTop;
                         }
                    }}>
                    <div key='episodes-container'
                         style={{ height: `${this.listHeight}px` }}
                         className={episodesListContainerClassName}>
                        <ul key='episodes-list'
                            style={{transform: `translate3d(0,
                                ${this.virtualOffset + scrollTop}px, 0)`}}
                            className={episodesListClassName}>
                            {episodes}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}

function getEpisodePaths({ json: { length, scrollTop = 0 }}) {

    const { width, height } = this;

    const episodeMargin = 20;
    const episodeWidth = 280 + episodeMargin;
    const episodeHeight = 180 + episodeMargin;

    const overfetchRowsCount = 2;
    const underfetchRowsCount = 1;
    const episodesPerRow = Math.floor(width / episodeWidth);

    this.listHeight = Math.ceil(length / episodesPerRow) * episodeHeight;

    if (length === 0) {
        return [];
    }

    this.virtualOffset = (scrollTop % episodeHeight) * -1;

    const firstVisibleRow = Math.floor(scrollTop / episodeHeight) - underfetchRowsCount;
    const visibleEpisodeRows = Math.floor(height / episodeHeight) + overfetchRowsCount;

    const from = this.start = Math.max(0, firstVisibleRow * episodesPerRow);
    const to = this.end = Math.min(length - 1, from + (visibleEpisodeRows * episodesPerRow));

    return [
        [{ from, to }, [
            'date', 'number',
            'title', 'description',
            'image_url', 'podcast_url'
        ]]
    ];

}
