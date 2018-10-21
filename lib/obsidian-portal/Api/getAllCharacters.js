import Character from './Thing/Character'

export default async function getAllCharacters() {
	const $ = await this.fetch$('/characters')
    
	const $characters = $('.character-list-item-container')
	const characters = []
	$characters.each((index, element) => {
		const $element = $(element)
		const type = $element.hasClass('pc') ? 'pc' : 'npc'
		const name = $element.find('.character-name').text().trim()
		const description = $element.find('.description-text').text().trim()
		const link = $element.find('.character-name a').attr('href')
		const image = $element.find('.game-content-image').attr('src')
		//const local_image = 'images/' + path.basename(image)
		//const slug = $element.find('.character-name a').attr('href').replace(/^.*\//, '')
		characters.push(new Character(this._site, {
			type,
			name,
			description,
			link,
			//	slug,
			image,
			//	local_image,
		}))
	})

	console.log(characters)


}