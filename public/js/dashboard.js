import { selectTab } from "./tools.js";
import ProductTab from "./product-tab.js";

//=== Bind Events ===

// On tab select, call tab function
document.querySelector('#myTab').addEventListener('shown.bs.tab', async (event) => {

    // event.target is the newly activated tab element
    // event.relatedTarget is the previous active tab element
    // console.log('Active tab target:', event.target.getAttribute('data-bs-target'));

    const tabActions = {
        'home-tab': homeTab,
        'truck-tab': truckTab,
        'product-tab': productTab,
        'profile-tab': profileTab
    };
    
    const activeTabName = event.target.id;
    await tabActions[activeTabName]();

});

// On page load, call active tab function
document.addEventListener('DOMContentLoaded', () => {

    // Find the active tab link inside #myTab
    const activeTabEl = document.querySelector('#myTab button.active');

    if (activeTabEl) {
        // Create a native Bootstrap-compatible custom event
        const event = new CustomEvent('shown.bs.tab', 
            {
            bubbles: true, // Allows #myTab to hear it
            cancelable: true
            }
        );
    
        // Define the event target so your listener knows which tab triggered it
        Object.defineProperty(event, 'target', { value: activeTabEl, enumerable: true });

        // Fire the event directly from the active button
        activeTabEl.dispatchEvent(event);
    }
});

const loginForm = document.querySelector('#profile #login-form');
loginForm.addEventListener('submit', async (event) => {
        
    event.preventDefault();

    const formData = new FormData(loginForm);

    const globalMessage = document.querySelector('#profile #global-message');

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    // Validation
    if(!email || !password){
        globalMessage.textContent = 'required !!!!';
        return;
    }

    console.log(email);
    console.log(password);
    
    selectTab('#home-tab');

});

//=== Tab on load functions ===

async function homeTab(){
   
    console.log('homeTab');
    const tab = document.querySelector('#home');

    // empty tab
    tab.replaceChildren();

    const p = document.createElement('p');
    p.textContent = 'dashboard loaded';
    tab.appendChild(p);

}

async function truckTab(){
    console.log('truckTab');
}

async function productTab() {
    console.log("Product tab my list")
    ProductTab.createProductSubmitBindEvent()
    await ProductTab.loadList()    
}

async function profileTab(){
    console.log('profileTab');
    loginForm.reset();
    document.querySelector('#profile #global-message').textContent = '';
}