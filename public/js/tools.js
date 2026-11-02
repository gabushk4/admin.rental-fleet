export function selectTab(tabId){
    // 1. Select the tab trigger element by its ID or selector
    const tabTriggerEl = document.querySelector(tabId);

    // 2. Initialize or fetch the Bootstrap Tab instance
    const tabInstance = bootstrap.Tab.getOrCreateInstance(tabTriggerEl);

    // 3. Show the tab panel
    tabInstance.show();
}

let globalMessageTimerId;

export function displayGlobalMessage(containerID, message = null, success = null){

    const globalMessage = document.querySelector(containerID);

    if (success ?? true) {

        globalMessage.classList.toggle('text-danger', false);
        globalMessage.classList.toggle('text-success', true);

    } else {

        globalMessage.classList.toggle('text-success', false);
        globalMessage.classList.toggle('text-danger', true);

    }

    globalMessage.textContent = message ?? '';

    if (typeof globalMessageTimerId === "number") {

        clearTimeout(globalMessageTimerId);
        globalMessageTimerId = undefined;

    }

    globalMessageTimerId = setTimeout(() => {
        globalMessage.textContent = ''
        globalMessageTimerId = undefined;
    }, 5000);

} 

export function disableFormButtons (form, disable = true) {

    form.querySelectorAll('button').forEach( (b) => {
        b.disabled = disable;
    });

}
