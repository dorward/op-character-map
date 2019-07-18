import fs from 'fs'

export default async function getImages(entities) {
	const api = entities[0]._api
	const images = entities.map(e => ({
		image: e.image,
		local: e.localImage
	})).filter(i => i.local)
	const uniqueImages = images.filter((v, i, a) => {
		const matches = a.filter(potential => potential.image === v.image)
		return a.indexOf(matches[0]) === i 
	}) 
	return Promise.all(uniqueImages.map(data => download(data, api)))
}

async function download(data, api) {
	const target = data.local
	const response = await api.fetchUrl(data.image, {responseType: 'stream'})
	response.data.pipe(fs.createWriteStream(target))
	return new Promise((resolve, reject) => {
		response.data.on('end', () => {
			resolve()
		})
		response.data.on('error', () => {
			reject()
		})
	})
}
