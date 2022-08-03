    await loadWalkDetailArticle(id)
    const response = await fetch(`${backend_base_url}walk/${id}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()

    return response_json