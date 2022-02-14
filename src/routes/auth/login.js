import { client_id, redirect_uri, randomString } from '$lib/api';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
    const scope = 'user-read-private user-read-email user-library-read'

    const params = new URLSearchParams({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state: randomString(16),
        show_dialog: true
    })
    
    return {
        headers: {
            Location: `https://accounts.spotify.com/authorize?${params.toString()}`
        },
        status: 302
    }
}