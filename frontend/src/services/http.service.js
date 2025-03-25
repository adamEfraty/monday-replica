import Axios from 'axios'

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/'

const axios = Axios.create({ withCredentials: true })

export const httpService = {
  get(endpoint, data) {
<<<<<<< HEAD
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
=======
    console.log("data", data);
    console.log("endpoint", endpoint);
    return ajax(endpoint, "GET", data);
  },
  post(endpoint, data) {
    console.log("data", data);
    console.log("endpoint", endpoint);
    return ajax(endpoint, "POST", data);
>>>>>>> origin/master
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  },
}

async function ajax(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`
  const params = method === 'GET' ? data : null

  const options = { url, method, data, params }

  try {
    const res = await axios(options)
    return res.data
  } catch (err) {
    console.dir(err)
    if (err.response && err.response.status === 401) {
      sessionStorage.clear()
      window.location.assign('/')
    }
    throw err
  }
}
