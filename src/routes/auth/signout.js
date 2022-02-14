import { dev } from '$app/env';
import { serialize } from 'cookie';

export async function get() {
    return {
		headers: {
			'set-cookie': [
                serialize('accessToken', '', {
                    path: '/',
                    httpOnly: true,
                    maxAge: 1,
                    secure: !dev,
                    sameSite: 'lax'
                }),
                serialize('refreshToken', '', {
                    path: '/',
                    httpOnly: true,
                    maxAge: 1,
                    secure: !dev,
                    sameSite: 'lax'
                }),
                serialize('user', '', {
                    path: '/',
                    httpOnly: true,
                    maxAge: 1,
                    secure: !dev,
                    sameSite: 'lax'
                })
            ],
            Location: '/login/'
		},
        status: 302,
	}
}