import { encrypt, getAccessToken } from '$lib/api'
import { serialize } from 'cookie'
import { dev } from '$app/env'

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ url }) => {
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if(state === null) {
        return {
            status: 302,
            headers: {
                Location: '/#error=state_mismatch'
            }
        }
    }

    const result = await getAccessToken(code)
    const { access_token, refresh_token, expires_in } = result
    
    const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })

    const user = JSON.stringify(await response.json())

    return {
        status: 302,
        headers: {
            'set-cookie': [
                serialize('accessToken', access_token, {
                    path: '/',
                    httpOnly: true,
                    maxAge: expires_in,
                    secure: !dev,
                    sameSite: 'lax'
                }),
                serialize('refreshToken', encrypt(refresh_token), {
                    path: '/',
                    httpOnly: true,
                    secure: !dev,
                    maxAge: 60 * 60 * 24,
                    sameSite: 'lax'
                }),
                serialize('user', encrypt(user), {
                    path: '/',
                    httpOnly: true,
                    secure: !dev,
                    maxAge: 60 * 60 * 24,
                    sameSite: 'lax'
                })
            ],
            Location: '/login/success/',
        }
    }   
}