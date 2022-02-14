<script context="module">
    /** @type {import('@sveltejs/kit').ErrorLoad} */
    export async function load({ session, url }) {
        if(!session.user && !['/login', '/auth/success'].includes(url.pathname)) {
            return {
                status: 302,
                redirect: '/login'
            }
        } 
        
        return {
            props: {
                user: session.user,
            }
        }
    }
</script>

<script>    
    import "../app.css";
    
    export let user
</script>

<header class="container mx-auto flex justify-between items-center my-4 mb-12 px-4">
    <div class="flex items-center gap-x-4">
        <img width="32" height="32" alt="{user?.display_name}'s profile picture" class="w-8 rounded-full" src={user?.images[0]?.url}>
        <span class="font-bold text-sm text-white">{user?.display_name}</span>
    </div>
    <div>
        <a href="/auth/signout" rel="external" class="text-white border border-white font-bold px-4 py-1 rounded-full text-sm hover:bg-white hover:text-black" >Sign out</a>
    </div>
</header>

<main class="container mx-auto px-4">
    <slot />
</main>