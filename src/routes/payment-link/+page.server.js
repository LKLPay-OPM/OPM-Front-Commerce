import { error } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    generateLink: async ({request}) => {
        const formData = await request.formData();
        const email = formData.get('email');
        if(!email){
            return error(400, {email, missing:true})
        }

        generateLink(email)
        return { success: true }
    }
};