// 내 게시물 불러오기(전체)
async function loadMyArticle() {
    articles = await getMyArticle()
    for(let i=0; i<articles.length; i++) {
        let image = articles[i].images[0]
        console.log(image)
        let article_box = document.getElementById("article_box")
        article_box.innerHTML +=
            `<div class="article_card">
                <img class="article_img" src='${image}'/>
            </div>`
    }
}

loadMyArticle()