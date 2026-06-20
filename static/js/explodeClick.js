function create(event) {
    //Create the image
    var i = document.createElement('img');

    //Set the source of the image
    i.src = 'https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyY21heTA4OGxiYXF4cWU2YmIzcGtscmNiend4cWl5NWo0OHVuZ2RvYSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/pKWCBvHevLcMU/200w.gif';
          
    i.style.width = '40px';
    i.style.height = '40px';

    //Set CSS styles so it appears where you clicked (Top left corner)
    i.style.position = 'absolute';
    i.style.left     = event.clientX - 20 + 'px';
    i.style.top      = event.clientY + window.scrollY - 20 + 'px';
 
    //Add it to the body of the document
    document.body.appendChild(i);
 
    function explode() {
        i.remove();
    }
   
    setTimeout(explode, 800);
}

//Main event listener for clicks
document.addEventListener('click', create);