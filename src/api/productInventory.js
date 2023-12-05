import axios from '@/util/request'


export function getAllProductInventory(queryInfo) {
	return axios({
		url: 'getAllProductInventory',
		method: 'GET',
		params: {
			...queryInfo
		}
	})
}

export function getProductInventoryInfoByProductId(queryInfo) {
	return axios({
		url: 'getProductInventoryInfoByProductId',
		method: 'GET',
		params: {
			...queryInfo
		}
	})
}

export function addProductInventoryInfo(visForm) {
	return axios({
		url: 'addProductInventoryInfo',
		method: 'POST',
		params: {
			...visForm
		}
	})
}

export function updateProductInventoryInfo(queryInfo) {
	return axios({
		url: 'updateProductInventoryInfo',
		method: 'POST',
		params: {
			...queryInfo
		}
	})
}

export function getProductInventory(id) {
	return axios({
		url: 'getProductInventory',
		method: 'GET',
		params: {
			id
		}
	})
}


export function deleteProductInventory(id) {
	return axios({
		url: 'deleteProductInventory',
		method: 'GET',
		params: {
			id
		}
	})
}



