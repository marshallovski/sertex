/**
 * @param {string} text text to display in info container
 * @param {string} icon icon to show ("info" and "tips")
 * @description just clearing contents of div#messages and pasting an info container
 */

sertex.ui.displayInfo = async (text, icon) => {
    const messagesContainer = $('#messages');

    // creating info container
    if (messagesContainer) {
        // removing all content from messages container
        while (messagesContainer.firstChild) messagesContainer.firstChild.remove();

        // creating  div
        const infoContainer = document.createElement('div');
        infoContainer.className = 'error-container';
        messagesContainer.appendChild(infoContainer);

        // creating  div body with  icon and text
        const infoContainerBody = document.createElement('div');
        infoContainerBody.className = 'error-container_body';
        infoContainer.appendChild(infoContainerBody);

        // creating  icon
        const infoContainerBodyIcon = document.createElement('img');
        infoContainerBodyIcon.className = 'error-container_body-icon';
        infoContainerBodyIcon.src = icon === 'info' ? '/assets/icons/info_white.svg' : '/assets/icons/tips_white.svg';
        infoContainerBody.appendChild(infoContainerBodyIcon);

        // creating  text
        const infoContainerBodyText = document.createElement('p');
        infoContainerBodyText.className = 'error-container_body-text';
        infoContainerBodyText.innerText = text;
        infoContainerBody.appendChild(infoContainerBodyText);
    } else sertex.logger('Messages container (div#messages) is missing, can\'t create info container', '');
}