/**
 * @param {string} id guild ID
 */
sertex.getGuild = async (id) => {
    const res = await fetch(`https://discord.com/api/${sertex.api.ver}/guilds/${id}`, {
        headers: {
            Authorization: atob(sertex.user.token)
        }
    });

    const guild = await res.json();
    return guild;
}
