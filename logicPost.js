document.addEventListener('DOMContentLoaded', async () => {
    // Obtiene el id del post de la URL
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    if (!postId) {
        alert('Error: No se encontró el post');
        return;
    }

    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.padding = '20px';

    let container = document.createElement('div');
    document.body.appendChild(container);

    // Botón para volver
    let backButton = document.createElement('button');
    backButton.textContent = '← Volver';
    backButton.style.marginBottom = '20px';
    backButton.onclick = () => window.history.back();
    container.appendChild(backButton);

    // Título
    let h1title = document.createElement('h1');
    h1title.textContent = 'Comentarios del Post';
    h1title.style.textAlign = 'center';
    container.appendChild(h1title);

    // Contenedor del post
    let postContainer = document.createElement('div');
    postContainer.id = 'postContainer';
    postContainer.style.border = '1px solid #ddd';
    postContainer.style.padding = '20px';
    postContainer.style.marginBottom = '20px';
    postContainer.style.borderRadius = '8px';
    container.appendChild(postContainer);

    // Contenedor de comentarios
    let commentsContainer = document.createElement('div');
    commentsContainer.id = 'commentsContainer';
    commentsContainer.style.border = '1px solid #ddd';
    commentsContainer.style.padding = '20px';
    commentsContainer.style.borderRadius = '8px';
    commentsContainer.style.maxHeight = '400px';
    commentsContainer.style.overflowY = 'auto';
    container.appendChild(commentsContainer);

    // Input para nuevo comentario
    let commentInput = document.createElement('input');
    commentInput.placeholder = 'Escribe tu comentario (máx. 140 caracteres)';
    commentInput.maxLength = 140;
    commentInput.style.width = 'calc(80% - 20px)';
    commentInput.style.padding = '10px';
    commentInput.style.margin = '10px 0';
    commentInput.style.border = '1px solid #ddd';
    commentInput.style.borderRadius = '4px';

    // Botón para enviar comentario
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

    // Permite enviar comentario con Enter
    commentInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && commentInput.value.trim()) {
            await agregarComentario(commentsContainer, commentInput.value, postId);
            commentInput.value = '';
        }
    });

    container.appendChild(commentInput);
    container.appendChild(commentButton);

    // Muestra el post y los comentarios
    await mostrarPost(postContainer, postId);
    await mostrarComentarios(commentsContainer, postId);
    autoRefresh(commentsContainer, postId);
});// Valida si un string es una URL

function validarURL(str) {
    const patron = /^(https?:\/\/)?([\w.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/i;
    return patron.test(str);
}

async function mostrarComentarios(container, postId) {
    try {
        const response = await fetch(`http://awita.site:3000/posts/${postId}`);
        if (!response.ok) throw new Error('Error al obtener comentarios');
        const post = await response.json();
        
        container.innerHTML = '<h3 style="margin: 15px 0; color: #333;">Comentarios:</h3>';
        
        if (post.comentarios && post.comentarios.length > 0) {
            post.comentarios.forEach(comentario => {
                const commentDiv = document.createElement('div');
                commentDiv.style.padding = '10px';
                commentDiv.style.margin = '10px 0';
                commentDiv.style.backgroundColor = '#f8f9fa';
                commentDiv.style.borderRadius = '4px';

                // Procesar el texto del comentario para detectar imágenes y links
                const processed = procesarComentario(comentario.comentario);
                commentDiv.appendChild(processed);

                // Fecha
                const fecha = document.createElement('small');
                fecha.style.color = '#666';
                fecha.textContent = new Date(comentario.fecha).toLocaleString();
                commentDiv.appendChild(fecha);

                container.appendChild(commentDiv);
            });
        } else {
            container.innerHTML += '<p style="color: #999; text-align: center;">Sé el primero en comentar</p>';
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color:red;">Error al cargar comentarios</p>';
    }
}

// Procesa el texto del comentario para detectar imágenes y links y mostrar previews
function procesarComentario(texto) {
    const cont = document.createElement('div');
    cont.style.marginBottom = '5px';
    // Expresión regular para URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let lastIndex = 0;
    let match;
    let hasPreview = false;
    while ((match = urlRegex.exec(texto)) !== null) {
        // Texto antes del link
        if (match.index > lastIndex) {
            cont.appendChild(document.createTextNode(texto.substring(lastIndex, match.index)));
        }
        const url = match[0];
        // Si es imagen
        if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '120px';
            img.style.maxHeight = '80px';
            img.style.display = 'block';
            img.style.margin = '5px 0';
            cont.appendChild(img);
            hasPreview = true;
        } else {
            // Link normal
            const a = document.createElement('a');
            a.href = url;
            a.textContent = url;
            a.target = '_blank';
            a.style.color = '#0079d3';
            cont.appendChild(a);
            // Preview de página web (solo si no es imagen)
            if (!hasPreview) {
                const preview = document.createElement('iframe');
                preview.src = url;
                preview.style.width = '100%';
                preview.style.height = '80px';
                preview.style.border = '1px solid #ccc';
                preview.style.margin = '5px 0';
                preview.loading = 'lazy';
                cont.appendChild(preview);
                hasPreview = true;
            }
        }
        lastIndex = urlRegex.lastIndex;
    }
    // Texto después del último link
    if (lastIndex < texto.length) {
        cont.appendChild(document.createTextNode(texto.substring(lastIndex)));
    }
    return cont;
}

async function agregarComentario(container, texto, postId) {
    try {
        const response = await fetch(`http://awita.site:3000/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comentario: texto,
                fecha: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            await mostrarComentarios(container, postId);
            container.scrollTop = container.scrollHeight;
        }
    } catch (error) {
        console.error('Error al agregar comentario:', error);
    }
}


function autoRefresh(container, postId) {
    setInterval(async () => {
        await mostrarComentarios(container, postId);
    }, 3000); 
}