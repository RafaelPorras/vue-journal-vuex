import axios from 'axios'

const journalApi = axios.create({
    baseURL: 'https://vue-demos-4170d-default-rtdb.europe-west1.firebasedatabase.app',
})

//console.log(process.env.NODE_ENV)

export default journalApi;