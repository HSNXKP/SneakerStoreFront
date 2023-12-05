import axios from '@/util/request'

export function getDeWuSneakerGoods(queryInfo) {
	return axios({
		url: 'getDeWuSneakerGoods',
		method: 'GET',
        params: {
			...queryInfo
		}
	})
}

export function addDeWuSneakerGoods(data) {
	return axios({
		url: 'addDeWuSneakerGoods',
		method: 'POST',
		data
	})
}

export function editDeWuSneakerGoods(data) {
	return axios({
		url: 'editDeWuSneakerGoods',
		method: 'POST',
		data
	})
}

export function deleteDeWuSneakerGoods(id) {
	return axios({
		url: 'deleteDeWuSneakerGoods',
		method: 'POST',
		params: {
			id
		}
	})
}

