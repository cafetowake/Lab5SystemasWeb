document.addEventListener('DOMContentLoaded', async () => {
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

function validarURL(str) {
    const patron = new RegExp("^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$");
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
                commentDiv.innerHTML = `
                    <p style="margin: 0; color: #1c1c1c;">${comentario.comentario}</p>
                    <small style="color: #666;">${new Date(comentario.fecha).toLocaleString()}</small>
                `;
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