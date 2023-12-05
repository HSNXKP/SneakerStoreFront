import axios from '@/util/request'

export function getAllUser(queryInfo) {
	return axios({
		url: 'getAllUser',
		method: 'GET',
        params: {
            ...queryInfo
        }
	})
}

export function editUser(form) {
	return axios({
		url: 'editUser',
		method: 'POST',
        data: {
            ...form
        }
	})
}

export function deleteUser(id) {
	return axios({
		url: 'deleteUser',
		method: 'GET',
        params: {
            id
        }
	})
}

export function getUser(id) {
	return axios({
		url: 'getUser',
		method: 'GET',
        params: {
            id
        }
	})
}
