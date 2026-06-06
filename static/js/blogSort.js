function blogSort(category) {
    const posts = document.getElementsByClassName(category);
    console.log(posts);
    if (!posts) {
        alert("no such post(s)");
        return;
    }

    // get all pages, loop through them and hide them
    const pages = document.getElementsByClassName('blog');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }

    // then show the requested page
    posts.style.display = 'block';
}