document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    if (!postId) {
        alert('Error: No se encontró el post');
        return;
    }

    function validarURL(str) {
        const patron = new RegExp("^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$");
        return patron.test(str);
    }

    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.padding = '20px';

    let container = document.createElement('div');
    document.body.appendChild(container);

  
    let backButton = document.createElement('button');
    backButton.textContent = '← Volver';
    backButton.style.marginBottom = '20px';
    backButton.onclick = () => window.history.back();
    container.appendChild(backButton);

  
    let h1title = document.createElement('h1');
    h1title.textContent = 'Comentarios del Post';
    h1title.style.textAlign = 'center';
    container.appendChild(h1title);

   
    let postContainer = document.createElement('div');
    postContainer.id = 'postContainer';
    postContainer.style.border = '1px solid #ddd';
    postContainer.style.padding = '20px';
    postContainer.style.marginBottom = '20px';
    postContainer.style.borderRadius = '8px';
    container.appendChild(postContainer);

   
    let commentsContainer = document.createElement('div');
    commentsContainer.id = 'commentsContainer';
    commentsContainer.style.border = '1px solid #ddd';
    commentsContainer.style.padding = '20px';
    commentsContainer.style.borderRadius = '8px';
    commentsContainer.style.maxHeight = '400px';
    commentsContainer.style.overflowY = 'auto';
    container.appendChild(commentsContainer);

   
    let commentInput = document.createElement('input');
    commentInput.placeholder = 'Escribe tu comentario (máx. 140 caracteres)';
    commentInput.maxLength = 140;
    commentInput.style.width = 'calc(80% - 20px)';
    commentInput.style.padding = '10px';
    commentInput.style.margin = '10px 0';
    commentInput.style.border = '1px solid #ddd';
    commentInput.style.borderRadius = '4px';
    
    
    let commentButton = document.createElement('button');
    commentButton.textContent = 'Enviar';
    commentButton.style.padding = '10px 20px';
    commentButton.style.marginLeft = '10px';
    commentButton.style.backgroundColor = '#0079d3';
    commentButton.style.color = 'white';
    commentButton.style.border = 'none';
    commentButton.style.borderRadius = '4px';
    commentButton.style.cursor = 'pointer';
    commentButton.onclick = async () => {
        if (commentInput.value.trim()) {
            await agregarComentario(commentsContainer, commentInput.value, postId);
            commentInput.value = '';
        }
    };

    
    commentInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && commentInput.value.trim()) {
            await agregarComentario(commentsContainer, commentInput.value, postId);
            commentInput.value = '';
        }
    });

    container.appendChild(commentInput);
    container.appendChild(commentButton);

  
    await mostrarPost(postContainer, postId);
    await mostrarComentarios(commentsContainer, postId);
    autoRefresh(commentsContainer, postId);
});


async function mostrarPost(container, postId) {
    try {

        const response = await fetch('http://awita.site:3000/posts');
        if (!response.ok) throw new Error('Error al obtener posts');
        const data = await response.json();
        const post = data.posts.find(p => p.id == postId); 

        if (!post) throw new Error('Post no encontrado');

        container.innerHTML = '';


        let h2title = document.createElement('h2');
        h2title.textContent = post.titulo;
        h2title.style.textAlign = 'center';
        h2title.style.color = '#1a1a1a';
        container.appendChild(h2title);

        let img = document.createElement('img');
        if (validarURL(post.imagen)) {
            img.src = post.imagen;
        } 
        
        img.style.width = '100%';
        img.style.maxHeight = '400px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.margin = '10px 0';
        container.appendChild(img);

        let p = document.createElement('p');
        p.textContent = post.descripcion || "Sin descripción";
        p.style.color = '#666';
        p.style.textAlign = 'center';
        p.style.fontSize = '1.1em';
        container.appendChild(p);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color:red; text-align:center;">Error: Post no encontrado</p>';
    }
}
