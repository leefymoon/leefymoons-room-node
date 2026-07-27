const pageName = window.location.pathname;
if (!window.fetch || !window.Promise) {
    window.location.replace("old" + pageName);
}