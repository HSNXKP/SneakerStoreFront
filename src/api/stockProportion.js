import axios from '@/util/request'

export function getStockProportion() {
	return axios({
		url: 'stockProportion',
		method: 'GET'
	})
}