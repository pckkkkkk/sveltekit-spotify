import dotenv from 'dotenv'
import StringCrypto from 'string-crypto'
import crypto from 'crypto'

dotenv.config()

const {
    encryptString,
    decryptString,
} = new StringCrypto();

export const client_id = process.env.CLIENT_ID
const spotify_api_token_uri = 'https://accounts.spotify.com/api/token'
export const app_url = process.env.APP_URL
export const redirect_uri = `${app_url}/auth/callback`
const client_secret = process.env.CLIENT_SECRET
const credential = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

export const access_token_max_age = 3
export const randomString = (size) => crypto.randomBytes(size).toString('base64').slice(0, size)

const secret =  process.env.APP_SECRET

export const encrypt = (str) => {
    return encryptString(str, secret) 
}
export const decrypt = (str) => {
    return decryptString(str, secret)
}

const authorization = (params) => {
	return fetch(spotify_api_token_uri, {
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + credential
		},
		body: new URLSearchParams(params)
	}).then(r => r.json())
}

export const getAccessToken = (code) => {
	return authorization({
		code,
		redirect_uri,
		grant_type: 'authorization_code'
	})
}

export const refreshAccessToken = (refreshToken) => {
	return authorization({
		refresh_token: refreshToken,
		grant_type: 'refresh_token'
	})
}


