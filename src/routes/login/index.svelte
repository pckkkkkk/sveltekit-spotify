<script context="module">
    /** @type {import('@sveltejs/kit').ErrorLoad} */
    export async function load({ session }) {        
        if(session.user) {
            return {
                status: 302,
                redirect: '/'
            }
        }
        
        return {}
    }
</script>

<script>
    import { goto } from '$app/navigation'
    import { session } from '$app/stores'    
    import { popupWindow } from '$lib/utils'
    
    let windowRef 
    
    const onAuthSuccess = ({ detail: { user } }) => {
        if(!windowRef) return
        
        closePopup()
        $session.user = user
        goto('/')
    }
    
    
    const closePopup = () => {
        if(windowRef) {
            windowRef.close()
        }
    }
    
    function login() {
        closePopup()
        
        windowRef = popupWindow('/auth/login', 'Sign in with Spotify', window, 650, 900)
    }
</script>

<svelte:window on:auth-success={onAuthSuccess}></svelte:window>

<div class="flex justify-center items-center w-full h-screen">
    <div class="space-y-8">
        <div class="space-y-4">
            <h1 class="text-white font-bold text-3xl">Sign in</h1>
            <p class="text-white">with your Spotify account.</p>
        </div>
        <div>
            <button class="bg-green-500 font-bold text-white rounded-full px-4 py-2" on:click={login}>Sign in with Spotify</button>   
        </div>
    </div> 
</div>

