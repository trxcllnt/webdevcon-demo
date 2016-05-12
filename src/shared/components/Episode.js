/** @jsx hJSX */
import { hJSX, Component } from 'reaxtor';
import { episode as episodeClassName } from './styles.css';

export class Episode extends Component {
    loadProps(model) {
        return model.get(`[
            'date', 'number',
            'title', 'description',
            'image_url', 'podcast_url'
        ]`);
    }
    render(model, state) {
        const { date, number,
                title, description,
                image_url, podcast_url } = state;
        return (
            <li className={episodeClassName}>
                <img src={image_url}/>
                <span>{title}</span>
            </li>
        );
    }
}

