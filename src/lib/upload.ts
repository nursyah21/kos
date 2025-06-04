export const upload = (file: any) => {
    const username = import.meta.env.VITE_UPLOAD_USERNAME
    const password = import.meta.env.VITE_UPLOAD_PASSWORD
    const url_upload = import.meta.env.VITE_UPLOAD_URL

    const formData = new FormData();
    formData.append('file', file);
    return fetch(url_upload, {
        method: 'post',
        headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: formData
    })
}