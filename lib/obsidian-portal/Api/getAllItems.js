import Character from './Thing/Character'

export default async function getAllCharacters() {
	const $ = await this.fetch$('/items')
    
	const $items = $('.character-list-item-container')
	const items = []
	$items.each((index, element) => {
		const $element = $(element)
		const name = $element.find('.item-name').text().trim()
		const link = $element.find('.item-name a').attr('href')
		const image = $element.find('.game-content-image').attr('src')
		items.push(new Character(this, {
			name,
			link,
			image,
		}))
	})
    
	return await Promise.all(
		items.map(
			c => c.inflate()
		)
	)
}