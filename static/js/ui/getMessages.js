/**
 * 
 * @param {string} channel channel ID
 * @param {int} limit limit of messages to load (default: 50)
 */
sertex.ui.getMessages = async (channel, limit = 50) => {
    if (!channel)
        return sertex.logger('sertex->getMessages: Enter valid channel ID', 'err');

    while ($('#messages').firstChild) $('#messages').firstChild.remove();
    sertex.currentChannel = channel;
    sertex.getChannel(sertex.currentChannel);
    sertex.logger(`Fetching messages for ${channel} (limit: ${limit})`);

    const res = await fetch(`https://discord.com/api/${sertex.api.ver}/channels/${channel}/messages?limit=${limit}`, {
        headers: {
            Authorization: atob(sertex.user.token)
        }
    });

    let messages = await res.json();
    if (messages.length > 0) {
        messages.sort((a, b) => a - b);

        messages.forEach(message => {
            // @TODO: bot and system badges
            // WARNING: dirty code ahead
            const isImageLink = message.content.endsWith('.png') || message.content.endsWith('.gif') || message.content.endsWith('.jpg') || message.content.endsWith('.jpeg') || message.content.endsWith('.webp');
            const isVideoLink = message.content.endsWith('.mp4') || message.content.endsWith('.webm') || message.content.endsWith('.mov');

            // text message without attachments, embeds, etc.
            if (message.embeds.length === 0 && message.attachments.length === 0) {
                // creating message container
                const msgElem = document.createElement('div');
                msgElem.className = 'msg';
                $('#messages').appendChild(msgElem);

                const msgBr = document.createElement('br');
                msgElem.parentNode.insertBefore(msgBr, msgElem);

                // creating avatar element
                const msgAvatar = document.createElement('img');
                msgAvatar.src = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
                msgAvatar.alt = message.author.username;
                msgAvatar.className = 'msg_avatar';
                msgElem.appendChild(msgAvatar);

                // creating message author username element
                const msgUsername = document.createElement('h3');
                msgUsername.className = 'msg_username';
                msgUsername.innerText = message.author.username;
                msgElem.appendChild(msgUsername);

                // creating message date element
                const msgTime = document.createElement('span');
                msgTime.className = 'msg_time';
                msgTime.innerText = `${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`;
                msgUsername.appendChild(msgTime);

                // creating message content container
                const msgContent = document.createElement('pre');
                msgContent.className = 'msg_msgcontent';
                msgContent.innerText = message.content;
                msgElem.appendChild(msgContent);

                const msgAttachmentBr = document.createElement('br');
                msgContent.parentNode.insertBefore(msgAttachmentBr, msgContent);
            } else if (message.embeds.length > 0 && !isVideoLink) {
                // @TODO: remove embed when isImageLink
                // msg with embed
                // creating message container
                const msgElem = document.createElement('div');
                msgElem.className = 'msg';
                $('#messages').appendChild(msgElem);

                const msgBr = document.createElement('br');
                msgElem.parentNode.insertBefore(msgBr, msgElem);

                // creating avatar element
                const msgAvatar = document.createElement('img');
                msgAvatar.src = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
                msgAvatar.alt = message.author.username;
                msgAvatar.className = 'msg_avatar';
                msgElem.appendChild(msgAvatar);

                // creating message author username element
                const msgUsername = document.createElement('h3');
                msgUsername.className = 'msg_username';
                msgUsername.innerText = message.author.username;
                msgElem.appendChild(msgUsername);

                // creating message date element
                const msgTime = document.createElement('span');
                msgTime.className = 'msg_time';
                msgTime.innerText = `${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`;
                msgUsername.appendChild(msgTime);

                // creating message content container
                const msgContent = document.createElement('div');
                msgContent.className = 'msg_msgcontent';
                msgElem.appendChild(msgContent);

                const msgAttachmentBr = document.createElement('br');
                msgContent.parentNode.insertBefore(msgAttachmentBr, msgContent);

                // embeds implementation
                let embed = message.embeds[0];

                // main embed element
                const msgEmbedContainer = document.createElement('div');
                msgEmbedContainer.className = 'msg_embed';
                msgContent.appendChild(msgEmbedContainer);

                // embed body
                const msgEmbedBody = document.createElement('div');
                msgEmbedBody.className = 'msg_embed-description';
                msgEmbedContainer.appendChild(msgEmbedBody);

                embed.color ? msgEmbedContainer.style.borderColor = `#${embed.color.toString(16)}` : false;

                switch (embed.type) {
                    case 'video':
                        if (embed.provider?.name === 'YouTube') {
                            // video author
                            const msgEmbedYTVideoAuthor = document.createElement('p');
                            msgEmbedYTVideoAuthor.innerText = embed.author.name;
                            msgEmbedBody.appendChild(msgEmbedYTVideoAuthor);

                            // video name (embed title)
                            const msgEmbedYTVideoTitle = document.createElement('a');
                            msgEmbedYTVideoTitle.className = 'msg_embed-title-link';
                            msgEmbedYTVideoTitle.innerText = embed.title;
                            msgEmbedYTVideoTitle.href = embed.url;
                            msgEmbedBody.appendChild(msgEmbedYTVideoTitle);

                            // video thumb and yt iframe
                            const msgEmbedYTVideoThumb = document.createElement('img');
                            msgEmbedYTVideoThumb.className = 'msg_embed-thumb';
                            msgEmbedYTVideoThumb.src = embed.thumbnail.proxy_url;
                            msgEmbedYTVideoThumb.onclick = async () => {
                                // replacing thumbnail with yt video iframe
                                msgEmbedYTVideoThumb.remove();

                                // creating iframe
                                const YTVideoIframe = document.createElement('iframe');
                                YTVideoIframe.className = 'msg_embed-ytiframe';
                                YTVideoIframe.src = embed.video.url;
                                msgEmbedBody.appendChild(YTVideoIframe);
                            }

                            msgEmbedBody.appendChild(msgEmbedYTVideoThumb);
                        }
                        break;

                    case 'link':
                        const msgEmbedLinkTitle = document.createElement('a');
                        msgEmbedLinkTitle.href = embed.url;
                        msgEmbedLinkTitle.className = 'msg_embed-title-link';
                        msgEmbedTitle.innerText = embed.title;
                        msgEmbedLinkTitle.appendChild(msgEmbedLinkTitle);

                        if (embed.description) {
                            const msgEmbedLinkDesc = document.createElement('p');
                            msgEmbedLinkDesc.className = 'msg_embed-description';
                            msgEmbedLinkDesc.innerText = embed.description;
                            msgEmbedBody.appendChild(msgEmbedLinkDesc);
                        }
                        break;

                    case 'image':
                        const msgElem = document.createElement('div');
                        msgElem.className = 'msg';
                        msgElem.innerHTML = '<br>';
                        $('#messages').appendChild(msgElem);

                        // creating avatar element
                        const msgAvatar = document.createElement('img');
                        msgAvatar.src = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
                        msgAvatar.alt = message.author.username;
                        msgAvatar.className = 'msg_avatar';
                        msgElem.appendChild(msgAvatar);

                        // creating message author username element
                        const msgUsername = document.createElement('h3');
                        msgUsername.className = 'msg_username';
                        msgUsername.innerText = message.author.username;
                        msgElem.appendChild(msgUsername);

                        // creating message time and date element
                        const msgTime = document.createElement('span');
                        msgTime.className = 'msg_time';
                        msgTime.innerText = `${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`;
                        msgUsername.appendChild(msgTime);

                        // creating message content container
                        const msgContent = document.createElement('p');
                        msgContent.className = 'msg_msgcontent';
                        msgElem.appendChild(msgContent);

                        // creating link to picture 
                        const msgPictureLink = document.createElement('a');
                        msgPictureLink.href = embed.url;
                        msgPictureLink.target = '_blank';
                        msgPictureLink.innerText = embed.url;
                        msgContent.appendChild(msgPictureLink);

                        const msgImageAttachmentLinkBr = document.createElement('br');
                        msgContent.appendChild(msgImageAttachmentLinkBr);

                        // creating message attachment container (clickable image)
                        const msgImageAttachmentLink = document.createElement('a');
                        msgImageAttachmentLink.href = embed.url;
                        msgContent.appendChild(msgImageAttachmentLink);

                        // creating message attachment element
                        const msgImageAttachment = document.createElement('img');
                        msgImageAttachment.src = embed.url;
                        msgImageAttachment.alt = embed.url;
                        msgImageAttachment.className = 'msg_img';
                        msgImageAttachmentLink.appendChild(msgImageAttachment);
                        break;

                    default:
                        const msgEmbedTitle = document.createElement('p');
                        msgEmbedTitle.className = 'msg_embed-title';
                        msgEmbedTitle.innerText = embed.title;
                        msgEmbedBody.appendChild(msgEmbedTitle);

                        if (embed.description) {
                            const msgEmbedDesc = document.createElement('p');
                            msgEmbedDesc.className = 'msg_embed-description';
                            msgEmbedDesc.innerText = embed.description;
                            msgEmbedBody.appendChild(msgEmbedDesc);
                        }
                        break;
                }
            }

            // displaying attachments without additional text
            // @NOTE: message.content can't be `null`
            if (message.content === '' && message.embeds.length === 0 && message.attachments.length > 0) {
                // creating main message container
                const msgElem = document.createElement('div');
                msgElem.className = 'msg';
                $('#messages').appendChild(msgElem);

                const msgBr = document.createElement('br');
                msgElem.parentNode.insertBefore(msgBr, msgElem);

                // creating avatar element
                const msgAvatar = document.createElement('img');
                msgAvatar.src = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
                msgAvatar.alt = message.author.username;
                msgAvatar.className = 'msg_avatar';
                msgElem.appendChild(msgAvatar);

                // creating message author username element
                const msgUsername = document.createElement('h3');
                msgUsername.className = 'msg_username';
                msgUsername.innerText = message.author.username;
                msgElem.appendChild(msgUsername);

                // creating message time and date element
                const msgTime = document.createElement('span');
                msgTime.className = 'msg_time';
                msgTime.innerText = `${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`;
                msgUsername.appendChild(msgTime);

                // creating message content container
                const msgContent = document.createElement('p');
                msgContent.className = 'msg_msgcontent';
                msgElem.appendChild(msgContent);

                const msgAttachmentBr = document.createElement('br');
                msgContent.parentNode.insertBefore(msgAttachmentBr, msgContent);

                // creating message attachment element
                message.attachments.forEach(attachment => {
                    if (attachment.content_type?.startsWith('image/')) {
                        // creating message image attachment container (clickable image)
                        const msgImageAttachmentLink = document.createElement('a');
                        msgImageAttachmentLink.href = attachment.proxy_url;
                        msgImageAttachmentLink.target = '_blank';
                        msgContent.appendChild(msgImageAttachmentLink);

                        const msgImageAttachment = document.createElement('img');
                        msgImageAttachment.src = attachment.proxy_url;
                        msgImageAttachment.alt = attachment.proxy_url;
                        msgImageAttachment.className = 'msg_img';
                        msgImageAttachmentLink.appendChild(msgImageAttachment);
                    } else if (attachment.content_type?.startsWith('video/')) {
                        // creating message video attachment container
                        const msgVideoElement = document.createElement('video');
                        msgVideoElement.setAttribute('controls', 'true');
                        msgVideoElement.className = 'msg_img';
                        msgContent.appendChild(msgVideoElement);

                        const msgVideoSourceElement = document.createElement('source');
                        msgVideoSourceElement.src = attachment.proxy_url;
                        msgVideoSourceElement.type = attachment.content_type;
                        msgVideoElement.appendChild(msgVideoSourceElement);
                    }
                });

                // displaying attachments with additional text
            } else if (message.content !== '' && message.embeds.length === 0 && message.attachments.length > 0) {
                // creating main message container
                const msgElem = document.createElement('div');
                msgElem.className = 'msg';
                $('#messages').appendChild(msgElem);

                const msgBr = document.createElement('br');
                msgElem.parentNode.insertBefore(msgBr, msgElem);

                // creating avatar element
                const msgAvatar = document.createElement('img');
                msgAvatar.src = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
                msgAvatar.alt = message.author.username;
                msgAvatar.className = 'msg_avatar';
                msgElem.appendChild(msgAvatar);

                // creating message author username element
                const msgUsername = document.createElement('h3');
                msgUsername.className = 'msg_username';
                msgUsername.innerText = message.author.username;
                msgElem.appendChild(msgUsername);

                // creating message time and date element
                const msgTime = document.createElement('span');
                msgTime.className = 'msg_time';
                msgTime.innerText = `${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`;
                msgUsername.appendChild(msgTime);

                // creating message content container
                const msgContent = document.createElement('p');
                msgContent.className = 'msg_msgcontent';
                msgContent.innerText = message.content;
                msgElem.appendChild(msgContent);

                const msgAttachmentBr = document.createElement('br');
                msgContent.parentNode.insertBefore(msgAttachmentBr, msgContent);

                // creating message attachment element
                message.attachments.forEach(attachment => {
                    if (attachment.content_type?.startsWith('image/')) {
                        // creating message image attachment container (clickable image)
                        const msgImageAttachmentLink = document.createElement('a');
                        msgImageAttachmentLink.href = attachment.proxy_url;
                        msgImageAttachmentLink.target = '_blank';
                        msgContent.appendChild(msgImageAttachmentLink);

                        const msgImageAttachment = document.createElement('img');
                        msgImageAttachment.src = attachment.proxy_url;
                        msgImageAttachment.alt = attachment.proxy_url;
                        msgImageAttachment.className = 'msg_img';
                        msgImageAttachmentLink.appendChild(msgImageAttachment);

                        const msgImageBr = document.createElement('br');
                        msgImageAttachmentLink.parentNode.insertBefore(msgImageBr, msgImageAttachmentLink);
                    } else if (attachment.content_type?.startsWith('video/')) {
                        // creating message video attachment container
                        const msgVideoElement = document.createElement('video');
                        msgVideoElement.setAttribute('controls', 'true');
                        msgVideoElement.className = 'msg_img';
                        msgContent.appendChild(msgVideoElement);

                        const msgVideoSourceElement = document.createElement('source');
                        msgVideoSourceElement.src = attachment.proxy_url;
                        msgVideoSourceElement.type = attachment.content_type;
                        msgVideoElement.appendChild(msgVideoSourceElement);

                        const msgVideoBr = document.createElement('br');
                        msgVideoElement.parentNode.insertBefore(msgVideoBr, msgVideoElement);
                    }
                });
            }

            // displaying video posted from external site (ex.: http://example.com/vid.mp4)
            if (
                message.content.startsWith('https://') || message.content.startsWith('http://')
                && message.attachments.length === 0 && message.embeds.length === 0
            ) {
                if (isVideoLink) {
                    // videos
                    const msgElem = document.createElement('div');
                    msgElem.className = 'msg';
                    $('#messages').appendChild(msgElem);

                    const msgBr = document.createElement('br');
                    msgElem.parentNode.insertBefore(msgBr, msgElem);

                    // creating avatar element
                    const msgAvatar = document.createElement('img');
                    msgAvatar.src = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
                    msgAvatar.alt = message.author.username;
                    msgAvatar.className = 'msg_avatar';
                    msgElem.appendChild(msgAvatar);

                    // creating message author username element
                    const msgUsername = document.createElement('h3');
                    msgUsername.className = 'msg_username';
                    msgUsername.innerText = message.author.username;
                    msgElem.appendChild(msgUsername);

                    // creating message time and date element
                    const msgTime = document.createElement('span');
                    msgTime.className = 'msg_time';
                    msgTime.innerText = `${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`;
                    msgUsername.appendChild(msgTime);

                    // creating message content container
                    const msgContent = document.createElement('p');
                    msgContent.className = 'msg_msgcontent';
                    msgElem.appendChild(msgContent);

                    // creating link to video 
                    const msgVideoLink = document.createElement('a');
                    msgVideoLink.href = message.content;
                    msgVideoLink.innerText = message.content;
                    msgContent.appendChild(msgVideoLink);

                    const msgAttachmentBr = document.createElement('br');
                    msgContent.parentNode.insertBefore(msgAttachmentBr, msgContent);

                    const msgVideoElement = document.createElement('video');
                    msgVideoElement.setAttribute('controls', 'true');
                    msgVideoElement.className = 'msg_img';
                    msgContent.appendChild(msgVideoElement);

                    const msgVideoSourceElement = document.createElement('source');
                    msgVideoSourceElement.src = message.content;
                    msgVideoElement.appendChild(msgVideoSourceElement);

                    const msgVideoBr = document.createElement('br');
                    return msgVideoElement.parentNode.insertBefore(msgVideoBr, msgVideoElement);
                }
            }
        });

        $('#messages').scrollTop = 999999999 * 999999999;

        // delete messages from vm memory
        messages = null;
    } else sertex.ui.displayInfo('This channel is empty. Maybe you could try sending some messages?', 'tips');
}