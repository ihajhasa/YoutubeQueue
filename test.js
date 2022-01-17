import { YoutubeQueue } from './YoutubeQueue.js'

const youtube = new YoutubeQueue()

youtube.search_video('Crab Rave', (data) => {
    console.log(data)
    console.log('=-=-=-=-=-=-=')
    console.log(youtube.queue)
    console.log('=-=-=-=-=-=-=')
    console.log(youtube.pop_next())
    console.log(youtube.queue)
})