function allowDrop(ev) {
    //prevents file from being uploaded automatically
    ev.preventDefault();
}


function dropped(ev) {
    //console.log("Drop");
    ev.preventDefault();
    let data = ev.dataTransfer;
    let files = data.files;
    console.log(files[0]);

}