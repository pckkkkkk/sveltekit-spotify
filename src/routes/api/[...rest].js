import { dev } from '$app/env'
import { access_token_max_age, refreshAccessToken, decrypt } from '$lib/api'
import { parse, serialize } from 'cookie'

const base = 'https://api.spotify.com/v1/'

const spotifyClient = async ({ method, params, locals, request, url }) => {
    const { refreshToken } = parse(request.headers.get('cookie') || '')
    const [, accessTokenFromAuthHeader ] = (request.headers.get('Authorization') || '').split(' ')
    
    let accessToken = (locals.accessToken || accessTokenFromAuthHeader)
    
    const getRequestParams = (token) => {
        return [`${base}${params.rest}${url.search}`, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }]
    }
    
    let resp = await fetch(...getRequestParams(accessToken))
    let cookie = []
    if(resp.status === 401 && refreshToken) {
        const result = await refreshAccessToken(decrypt(refreshToken))
        accessToken = result.access_token
        cookie = [
            serialize('accessToken', result.access_token, {
                path: '/',
                httpOnly: true,
                secure: !dev,
                sameSite: 'lax',
                maxAge: result.expires_in
            })
        ]
        
        resp = await fetch(...getRequestParams(accessToken))
    }
    
    console.log(resp.status, params.rest)
    
    return {
        headers: {
            'Content-Type': 'application/json',
            'set-cookie': cookie
        },
        status: resp.status,
        body: (resp.ok && JSON.stringify(await resp.json())) || { error: true }
    }
}


/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = ({ request, locals, params, url }) => spotifyClient({
    method: 'get',
    params, locals, request, url
})