
export function renderComments({ comments }) {
    let commentSection = document.querySelector(".comments");

    const commentsHtml = comments
        .map((comment, index) => {
            console.log(comment.isLikeLoading);
            return `<li class="comment" id="comment" data-index="${index}">
  <div class="comment-header">
    <div>${comment.name}</div>
    <div>${comment.date}</div>
  </div>
  <div class="comment-body">
    ${comment.isEdited ? `<textarea id="textarea-${index}">${comment.text}</textarea>` : `<div class="comment-text">${comment.text}</div>`}
  </div>
  <div class="comment-footer">
    <button class="edit-button">${comment.isEdited ? 'Сохранить' : 'Редактировать'}</button>
    <div class="likes">
                    <span class="likes-counter">${comment.likesCount}</span>
      <button class="like-button ${comment.isLiked ? '-active-like' : ''} ${comment.isLikeLoading ? '-loading-like' : ''}"></button>
    </div>
  </div>
</li>`
        })
        .join('');

    commentSection.innerHTML = commentsHtml;


    likeComment();
    answerCommentListener();
    editComment();



    

}