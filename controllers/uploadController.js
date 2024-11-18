// GET /upload -> upload form
function uploadGet(req, res, next) {
    res.render("upload", {
        title: "File upload"
    });
}

// POST /upload -> upload to filesystem / upload to cloud (later)
function uploadPost(req, res, next) {
    console.log(`Uploaded file:`);
    const fileData = req.file;
    fileData.created = new Date().toLocaleDateString(); // format: DD/MM/YYYY
    console.log(fileData);

    // upload to destination


    res.redirect("/sky-vault");
}

export default {
    uploadGet,
    uploadPost,
}