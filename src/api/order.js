import axios from '@/util/request'

export function getAllOrder(queryInfo) {
	return axios({
		url: 'getAllOrder',
		method: 'GET',
        params: {
            ...queryInfo
        }
	})
}


export function deleteOrder(id) {
	return axios({
		url: 'deleteOrder',
		method: 'GET',
        params: {
            id
        }
	})
}

export function updateExpress(visForm) {
	return axios({
		url: 'updateExpress',
		method: 'GET',
        params: {
            ...visForm
        }
	})
}

export function refund(refundVisForm) {
	return axios({
		url: 'refund',
		method: 'GET',
        params: {
            ...refundVisForm
        }
	})
}

export function refuseRefund(refundVisForm) {
	return axios({
		url: 'refuseRefund',
		method: 'GET',
        params: {
            ...refundVisForm
        }
	})
}




