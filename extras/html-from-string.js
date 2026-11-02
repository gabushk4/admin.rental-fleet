// === 2 Exemples - Créer un élément à partir d'une chaîne html ===
const htmlString = `
    <button id="delete2" class="btn btn-danger mx-2">
        Delete
    </div>
`;

const template = document.createElement('template');
template.innerHTML = htmlString.trim();

const button = template.content.querySelector('button');
button.textContent = 'Delete 2';            

form.appendChild(template.content.firstElementChild);


// On pourrait aussi utiliser fetch()
let template2 = '';

const res = await fetch('button.html');

if (res.ok) {

    const htmlString2 = await res.text();

    template2 = document.createElement('template');
    template2.innerHTML = htmlString2.trim();

    const button2 = template2.content.querySelector('button');
    button2.textContent = 'Delete 3'; 

    form.appendChild(template2.content.firstElementChild);

}  