import { decrypt } from '$lib/api'
import { parse } from 'cookie'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {    
    const { user } = parse(event.request.headers.get('cookie') || '')
    
    const val = user && decrypt(user)
    event.locals.user = val ? JSON.parse(val) : null

    return await resolve(event)
}

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({ locals }) {
    return {
        user: locals.user
    }
}