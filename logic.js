function start() {
    let container = document.createElement('div');
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '20px';
    document.body.appendChild(container);

    let searchBar = document.createElement('input');
    searchBar.placeholder = 'Buscar posts...';
    searchBar.style.position = 'fixed';
    searchBar.style.top = '0';
    searchBar.style.width = '100%';
    searchBar.style.padding = '10px';
    searchBar.style.border = '1px solid #ddd';
    searchBar.addEventListener('input', filterPosts);
    document.body.appendChild(searchBar);

    let h1title = document.createElement('h1');
    h1title.textContent = 'Reddit UVG';
    h1title.style.textAlign = 'center';
    container.appendChild(h1title);

    getPosts(container);

    let btnWin = document.createElement('button');
    btnWin.textContent = 'Abrir comentarios';
    btnWin.style.display = 'block';
    btnWin.style.margin = '20px auto';
    btnWin.style.padding = '10px 20px';
    btnWin.style.backgroundColor = '#6200EE';
    btnWin.style.color = '#FFF';
    btnWin.style.border = 'none';
    btnWin.style.borderRadius = '4px';
    btnWin.style.cursor = 'pointer';
    btnWin.onclick = function () {
        let win = window.open('./post.html', '_blank');
        localStorage.setItem("id", 1);
        win.focus();
    };
    container.appendChild(btnWin);

    return container;
}

const posts = [
    { id: 1, imagen: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png', titulo: 'Google', descripcion: 'Motor de búsqueda' },
    { id: 2, imagen: 'https://www.facebook.com/images/fb_icon_325x325.png', titulo: 'Facebook', descripcion: 'Red social' }
];

function getPosts(container) {
    let containerPosts = document.createElement('div');
    containerPosts.id = 'containerPosts';
    containerPosts.style.display = 'grid';
    containerPosts.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    containerPosts.style.gap = '15px';
    container.appendChild(containerPosts);

    renderPosts(posts, containerPosts);
}

function renderPosts(posts, containerPosts) {
    containerPosts.innerHTML = '';
    posts.forEach(post => {
        let card = document.createElement('div');
        card.style.border = '1px solid #ddd';
        card.style.borderRadius = '8px';
        card.style.padding = '10px';
        card.style.boxShadow = '2px 2px 12px rgba(0, 0, 0, 0.1)';
        card.style.textAlign = 'center';
        card.style.cursor = 'pointer';
        card.onclick = () => mostrarDetalles(post);

        let img = document.createElement('img');
        img.src = post.imagen;
        img.style.width = '100px';
        img.style.borderRadius = '50%';

        let title = document.createElement('h3');
        title.textContent = post.titulo;

        let desc = document.createElement('p');
        desc.textContent = post.descripcion;

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(desc);
        containerPosts.appendChild(card);
    });
}

function filterPosts() {
    const searchText = document.querySelector('input').value.toLowerCase();
    const filteredPosts = posts.filter(post => post.titulo.toLowerCase().includes(searchText));
    const containerPosts = document.getElementById('containerPosts');
    renderPosts(filteredPosts, containerPosts);
}

function mostrarDetalles(post) {
    alert(`Detalles de ${post.titulo}:
Descripción: ${post.descripcion}`);
}

start();
