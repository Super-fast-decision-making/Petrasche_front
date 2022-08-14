

const GetSearchResultList = () => {
  var search_results = JSON.parse(localStorage.getItem('search_results'));
  document.getElementById("search_result").innerHTML = "";

  console.log(search_results);
  search_results.forEach((item) => {
    let html = `<figure onclick="modal_open(${item.id})" class="search_item">
    <img src="${item.images[0]}" alt="">
    <figcaption>
        <h4>${item.author}</h4>
        <div>좋아요 ${item.like_num}개 댓글 ${item.comments.length}개</div>
        <p>${item.content}</p>
    </figcaption>
</figure>`

    document.getElementById("search_result").innerHTML += html;
  });
  localStorage.removeItem('search_results');

};

GetSearchResultList();
