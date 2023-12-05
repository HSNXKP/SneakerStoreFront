import axios from '@/util/request'

export function getAllProductCategories(categoryQueryInfo) {
	return axios({
		url: 'getAllProductCategories',
		method: 'GET',
		params: {
			...categoryQueryInfo
		}
	})
}


export function updateProductCategory(visForm) {
	return axios({
		url: 'updateProductCategory',
		method: 'POST',
		params: {
			...visForm
		}
	})
}

export function deleteProductCategory(id) {
	return axios({
		url: 'deleteProductCategory',
		method: 'GET',
		params: {
			id
		}
	})
}


export function getProductCategory(id) {
	return axios({
		url: 'getProductCategory',
		method: 'GET',
		params: {
			id
		}
	})
}

export function addProductCategory(visForm) {
	return axios({
		url: 'addProductCategory',
		method: 'POST',
		params: {
			...visForm
		}
	})
}