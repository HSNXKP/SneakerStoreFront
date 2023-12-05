import axios from '@/util/request'


export function getAllProduct(queryInfo) {
	return axios({
		url: 'getAllProduct',
		method: 'GET',
		params: {
			...queryInfo
		}
	})
}

export function addProduct(visForm) {
	return axios({
		url: 'addProduct',
		method: 'POST',
		data: {
			...visForm
		}
	})
}

export function updateProduct(visForm) {
	return axios({
		url: 'updateProduct',
		method: 'POST',
		data: {
			...visForm
		}
	})
}

export function getProduct(productId) {
	return axios({
		url: 'getProduct',
		method: 'GET',
		params: {
			productId
		}
	})
}


export function deleteProduct(productId) {
	return axios({
		url: 'deleteProduct',
		method: 'GET',
		params: {
			productId
		}
	})
}

export function changeRecommend(id,checked) {
	return axios({
		url: 'changeRecommend',
		method: 'GET',
		params: {
			id,
			checked
		}
	})
}

export function getAllProductByCodeOrName(productQueryInfo) {
	return axios({
		url: 'getAllProductByCodeOrName',
		method: 'GET',
		params: {
			...productQueryInfo
		}
	})
}











