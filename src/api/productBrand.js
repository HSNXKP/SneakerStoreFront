import axios from '@/util/request'

export function getAllProductBrand(brandQueryInfo) {
	return axios({
		url: 'getAllProductCategories',
		method: 'GET',
		params: {
			...brandQueryInfo
		}
	})
}

export function updateProductBrand(visForm) {
	return axios({
		url: 'updateProductCategory',
		method: 'POST',
		params: {
			...visForm
		}
	})
}

export function deleteProductBrand(id) {
	return axios({
		url: 'deleteProductCategory',
		method: 'GET',
		params: {
			id
		}
	})
}

export function getProductBrand(id) {
	return axios({
		url: 'getProductCategory',
		method: 'GET',
		params: {
			id
		}
	})
}


export function addProductBrand(visForm) {
	return axios({
		url: 'addProductCategory',
		method: 'POST',
		params: {
			...visForm
		}
	})
}
