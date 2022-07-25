// const BACK_END_URL = "http://127.0.0.1:8000/article/";
// const USER_URL = "http://127.0.0.1:8000/user/";
// const backend_base_url = "http://127.0.0.1:8000/"
// const frontend_base_url = "http://127.0.0.1:5500/"


function tagToLink(str){

    var newText = str.replace(/<br>/g, "\r\n");
    var txt = newText.replace(/#[^#\s,;]+/gm, function(tag) {
        return `<a href="#" onclick="hashtag_search('${tag}')" id="hashtag_search" class="hashtag">` + tag + '</a>'
    });
    txt = txt.replace(/\n/g, "<br>")
    return txt;
  }
  
  

async function hashtag_search(words_for_search) {
    // let words_for_search = document.getElementById("hashtag_search").innerText;
    console.log(words_for_search)
    words_for_search = words_for_search.replace("#", "%23");
    console.log(words_for_search)

    var url = new URL(backend_base_url + `article/search/?words=${words_for_search}`);
    const search_results = await fetch(url)
        .then(response => {
            var status_code = response.status;
            return Promise.resolve(response.json())
                .then(data => ({ data, status_code }))
        })

    localStorage.setItem('search_results', JSON.stringify(search_results.data));

    if (search_results.status_code == 200) {
        window.location.replace(`${frontend_base_url}search_result.html`);
    } else {
        alert(search_results.data.message)
    }
}
