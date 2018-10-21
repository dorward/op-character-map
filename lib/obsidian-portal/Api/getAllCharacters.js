export default async function getAllCharacters() {
	const $ = await this.fetch$('/characters')
    
	const $characters = $('.character-list-item-container')
	const characters = []
	$characters.each((index, element) => {
		const $element = $(element)
		const type = $element.hasClass('pc') ? 'pc' : 'npc'
		const name = $element.find('.character-name').text()
		const description = $element.find('description-text').text()
		const link = this.resolveUrl($element.find('.character-name a').attr('href'))
		const image = this.resolveUrl($element.find('.game-content-image').attr('src'))
		//const local_image = 'images/' + path.basename(image)
		//const slug = $element.find('.character-name a').attr('href').replace(/^.*\//, '')
		characters.push({
			type,
			name,
			description,
			link,
			//	slug,
			image,
		//	local_image,
		})
	})

	console.log(characters)


}