import axios from 'axios';

export async function getCamp(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/camp/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getCampFromSite(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/site/camp/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAmenities(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/camp/amenity/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getSites(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/camp/sites/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getSite(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/site/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getBookedDates(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/site/booked/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getWaitBookedDates(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/site/booked/wait/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAcceptBookedDates(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/site/booked/accept/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getCampReviews(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/camp/reviews/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function book(data) {
    try {
        const response = await axios.post(`http://127.0.0.1:3001/book`, data)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getBook(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/book/?id=${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getSiteImg(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/site/img/?id=${id}`, {
            responseType: 'arraybuffer'
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getSiteImgs(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/site/imgs/?id=${id}`, {
            responseType: 'arraybuffer'
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getCampImg(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:3001/camp/img/?id=${id}`, {
            responseType: 'arraybuffer'
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}