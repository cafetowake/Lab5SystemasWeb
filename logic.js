// Valida si un string es una URL
function validarURL(str) {
    const patron = /^(https?:\/\/)?([\w.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/i;
    return patron.test(str);
}

// Inicializa la página principal
async function start() {
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.padding = '20px';

    // Barra de búsqueda fija
    let searchBar = document.createElement('input');
    searchBar.placeholder = 'Buscar posts...';
    searchBar.style.position = 'fixed';
    searchBar.style.top = '0';
    searchBar.style.width = 'calc(100% - 20px)';
    searchBar.style.margin = '10px';
    searchBar.style.padding = '10px';
    searchBar.style.border = '1px solid #ddd';
    searchBar.style.borderRadius = '5px';
    searchBar.addEventListener('input', filterPosts);
    document.body.appendChild(searchBar);

    // Contenedor de posts
    let container = document.createElement('div');
    container.style.marginTop = '70px';
    document.body.appendChild(container);

    await getPosts(container);
}

// Obtiene los posts del servidor y los muestra
async function getPosts(container) {
    try {
        const response = await fetch('http://awita.site:3000/posts');
        if (!response.ok) throw new Error('Error al obtener posts');
        const data = await response.json();
        const posts = data.posts;

        let containerPosts = document.createElement('div');
        containerPosts.id = 'containerPosts';
        containerPosts.style.display = 'grid';
        containerPosts.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        containerPosts.style.gap = '20px';
        containerPosts.style.padding = '10px';
        container.appendChild(containerPosts);

        renderPosts(posts, containerPosts);
    } catch (error) {
        console.error(error);
        document.body.innerHTML = '<p style="color:red; text-align:center;">Error al cargar los posts. Intente nuevamente.</p>';
    }
}

// Renderiza los posts como tarjetas
function renderPosts(posts, containerPosts) {
    containerPosts.innerHTML = '';
    posts.forEach(post => {
        let card = document.createElement('div');
        card.style.border = '1px solid #ddd';
        card.style.borderRadius = '8px';
        card.style.padding = '15px';
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s';
        card.onclick = () => {
            localStorage.setItem('postId', post.id);
            window.location.href = `post.html?id=${post.id}`;
        };

        let img = document.createElement('img');
        if (validarURL(post.imagen)) {
            img.src = post.imagen;
        }
        img.style.width = '100%';
        img.style.height = '150px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';

        let title = document.createElement('h3');
        title.textContent = post.titulo;
        title.style.margin = '10px 0';
        title.style.color = '#333';

        let desc = document.createElement('p');
        desc.textContent = post.descripcion || 'Sin descripción';
        desc.style.color = '#666';
        desc.style.fontSize = '0.9em';

        let category = document.createElement('div');
        category.textContent = post.categoria ? `Categoría: ${post.categoria}` : '';
        category.style.color = '#999';
        category.style.fontSize = '0.8em';
        category.style.marginTop = '10px';

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(desc);
        if (post.categoria) card.appendChild(category);
        containerPosts.appendChild(card);
    });
}

// Filtra los posts según el texto de búsqueda
function filterPosts() {
    let searchText = document.querySelector('input').value.toLowerCase();
    let posts = Array.from(document.getElementById('containerPosts').children);
    posts.forEach(post => {
        const textContent = post.textContent.toLowerCase();
        post.style.display = textContent.includes(searchText) ? 'block' : 'none';
    });
}

// Inicia la app
start();