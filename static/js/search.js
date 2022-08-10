async function search(div) {
  let words_for_search = div.parentNode.childNodes[1].value;
  if (words_for_search.startsWith("#")) {
    words_for_search = words_for_search.replace("#", "%23");
  }
  var url = new URL(
    backend_base_url + `article/search/?words=${words_for_search}`
  );
  const search_results = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      "Content-Type": "application/json",
    },
  }).then((response) => {
    var status_code = response.status;
    return Promise.resolve(response.json()).then((data) => ({
      data,
      status_code,
    }));
  });
  localStorage.setItem("search_results", JSON.stringify(search_results.data));

  if (search_results.status_code == 200) {
    window.location.replace(`${frontend_base_url}search_result.html`);
  } else {
    alert("로그인 후 이용해주세요.");
  }
}
