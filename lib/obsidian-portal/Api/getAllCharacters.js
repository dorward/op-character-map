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
		characters.push(new Character(this, {
			type,
			name,
			description,
			link,
			image,
		}))
	})
    
	return await Promise.all(
		characters.map(
			c => c.inflate()
		)
	)
}