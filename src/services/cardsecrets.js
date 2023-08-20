import axios from "axios";

const baseUrl = 'http://lopl.me/api/card'

const getAll = () => {
    return axios.get(baseUrl)
        .then(res => res.data)
}

const create = newObj => {
    return axios.post(baseUrl, newObj)
        .then(res => res.data)
}

const update = async (id, newObj) => {
    const res = await axios.put(`${baseUrl}/${id}`, newObj);
    return res.data;
}

const deleteCard = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const cardService = {
    getAll,
    create,
    update,
    deleteCard
}

export default cardService