export default function selectTab(tabId){
    // 1. Select the tab trigger element by its ID or selector
    const tabTriggerEl = document.querySelector(tabId);

    // 2. Initialize or fetch the Bootstrap Tab instance
    const tabInstance = bootstrap.Tab.getOrCreateInstance(tabTriggerEl);

    // 3. Show the tab panel
    tabInstance.show();
}
