

function tagToLink(str){

    var newText = str.replace(/<br>/g, "\r\n");
    var txt = newText.replace(/#[^#\s,;]+/gm, function(tag) {
        return `<a href="#" onclick="hashtag_search('${tag}')" class="hashtag">` + tag + '</a>'
    });
    txt = txt.replace(/\n/g, "<br>")
    return txt;
  }
  
  

async function hashtag_search(words_for_search) {
    words_for_search = words_for_search.replace("#", "%23");

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
