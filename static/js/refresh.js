const TOKEN = "Bearer " + localStorage.getItem("user_access_token");

const Refresh_Token = () => {
  const PayLoad = JSON.parse(localStorage.getItem("payload"));
  if (PayLoad.exp < Date.now() / 1000) {
    return;
  } else {
    fetch(`${backend_base_url}user/refresh/`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        Authorization: TOKEN,
      },
      body: JSON.stringify({
        refresh: localStorage.getItem("user_refresh_token"),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("user_access_token", res.access);
      });
  }
};

Refresh_Token();
