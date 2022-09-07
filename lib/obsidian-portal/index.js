import Api from './Api';

const axiosLib = require('axios');
const { wrapper } = require('@3846masa/axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const axiosConfig = {
	jar,
	withCredentials: true,
};
const axios = wrapper(axiosLib.create(axiosConfig));

const cheerio = require('cheerio');

export default async function obsidianportal(username, password) {
	// Fetch login form
	const loginPageResponse = await axios.get('https://www.obsidianportal.com/login', axiosConfig);
	const loginPageHTML = loginPageResponse.data;
	const $loginPage = cheerio.load(loginPageHTML);
	const $form = $loginPage('.username-login-box form');
	const $array = $form.serializeArray();
	const formData = {};
	$array.forEach(item => {
		if (item.name === 'login') {
			item.value = username;
		}
		if (item.name === 'password') {
			item.value = password;
		}
		formData[item.name] = item.value;
	});

	// Submit login form
	await axios(
		Object.assign(
			{
				method: 'post',
				url: 'https://www.obsidianportal.com/sessions',
				data: formData,
			},
			axiosConfig
		)
	);

	return new Api(axios, axiosConfig);
}
