// const fetch = require('node-fetch');
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config();

export class YoutubeQueue {

    static base_url = `https://www.googleapis.com/youtube/v3/`
    static base_video_url = `https://www.youtube.com/watch?v=`
    static api_key = process.env.YOUTUBE_V3_API_KEY

    constructor() {
        this.queue = []
        this.index = 0
    }

    // Private Functions

    _generate_headers() {
        return {
            Accept: 'application/json'
        }
    }

    _query_params(opts = {}) {
        return {
            key: YoutubeQueue.api_key,
            part: 'snippet',
            type: 'video',
            safeSearch: 'none',
            ...opts
        }
    }

    _is_empty() {
        return (this.queue.length == 0)
    }

    _is_at_end() {
        return this.index >= this.queue.length
    }

    _is_at_first() {
        if (this._is_empty()) {
            return true
        }

        return this.index == 0
    }

    _add_to_queue(item) {
        const entry = {
            url: `${YoutubeQueue.base_video_url}${item.id.videoId}`,
            title: item.snippet.title,
            description: item.snippet.description
        }
        this.queue.push(entry)
        return entry
    }

    // Public Functions

    // Adds the first search result to the queue
    // Input:
    //  q: search query
    //  cb: call back function to run after adding result to queue
    search_video(q, cb) {
        let url = `${YoutubeQueue.base_url}search?`

        const params = this._query_params({q})

        for (const param in params) {
            url = `${url}&${param}=${params[param]}`
        }

        fetch(url, this._generate_headers())
        .then(resp => resp.json())
        .then(data => {
            const items = data.items

            if (!items) {
                cb(null)
                return
            }

            if (items.length === 0) {
                cb(null)
                return
            }

            const first = items[0]
            cb(this._add_to_queue(first))
        })
        .catch(err => cb(err))
    }

    // get the next video
    get_next() {
        if (this._is_empty()) {
            return null
        }

        if(this.index >= this.queue.length) {
            this.index = 0
        }

        const entry = this.queue[this.index]
        this.index += 1
        return entry
    }

    // clear the queue
    clear() {
        this.queue = []
        this.index = 0
    }

    // skip upcoming video
    skip_next() {
        if (this._is_empty() || this._is_at_end()) {
            return false
        }
        this.index += 1
        return true
    }

    // go back to previous video
    go_to_prev() {
        if (this._is_empty() || this._is_at_first()) {
            return false
        }

        this.index -= 1
        return true
    }

}