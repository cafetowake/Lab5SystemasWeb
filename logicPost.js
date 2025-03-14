document.addEventListener('DOMContentLoaded', () => {
    let container = document.createElement('div');
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '20px';
    document.body.appendChild(container);

    let h1title = document.createElement('h1');
    h1title.textContent = 'Comentarios del Post';
    h1title.style.textAlign = 'center';
    container.appendChild(h1title);

    let commentsContainer = document.createElement('div');
    commentsContainer.id = 'commentsContainer';
    commentsContainer.style.border = '1px solid #ddd';
    commentsContainer.style.borderRadius = '8px';
    commentsContainer.style.padding = '10px';
    commentsContainer.style.boxShadow = '2px 2px 12px rgba(0, 0, 0, 0.1)';
    commentsContainer.style.marginTop = '20px';
    commentsContainer.style.maxHeight = '400px';
    commentsContainer.style.overflowY = 'auto';
    container.appendChild(commentsContainer);

    let postId = localStorage.getItem('id');
    mostrarComentarios(commentsContainer, postId);

    let commentInput = document.createElement('input');
    commentInput.placeholder = 'Escribe tu comentario (máx. 140 caracteres)';
    commentInput.maxLength = 140;
    commentInput.style.width = '100%';
    commentInput.style.marginTop = '10px';
    commentInput.style.padding = '10px';
    commentInput.style.border = '1px solid #ddd';
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') agregarComentario(commentsContainer, commentInput.value);
    });
    container.appendChild(commentInput);
});

function mostrarComentarios(commentsContainer, postId) {
    const comentariosPorPost = {
        1: [
            { id: 1, comentario: 'Excelente buscador' },
            { id: 2, comentario: 'Muy útil' }
        ],
        2: [
            { id: 3, comentario: 'Me encanta Facebook' },
            { id: 4, comentario: 'Buen lugar para compartir' }
        ]
    };

    const comentarios = comentariosPorPost[postId] || [];

    comentarios.forEach(comment => {
        let commentElement = document.createElement('div');
        commentElement.textContent = comment.comentario;
        commentElement.style.borderBottom = '1px solid #eee';
        commentElement.style.padding = '5px 0';
        commentsContainer.appendChild(commentElement);
    });
}

function agregarComentario(commentsContainer, comentario) {
    if (comentario.trim()) {
        let nuevoComentario = document.createElement('div');
        nuevoComentario.textContent = comentario;
        nuevoComentario.style.borderBottom = '1px solid #eee';
        nuevoComentario.style.padding = '5px 0';
        commentsContainer.appendChild(nuevoComentario);

        commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }
}
