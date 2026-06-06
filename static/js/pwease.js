var pweaseAlert = document.getElementById('pwease');

let pweaseTriggered = false;

document.body.addEventListener('mouseleave', function(event) {
    if (event.clientY <= 10 && !pweaseTriggered) { 
        pweaseAlert.style.display = 'flex';
        pweaseAlert.style.top = window.scrollY + 'px';
        document.body.style.overflowY = 'hidden';
        
        pweaseTriggered = true
    }
});

function pweaseClick() {
    pweaseAlert.style.display = 'none'
    document.body.style.overflowY = 'scroll'
}

/* html code:
<div id="pwease">
    <div id="pwease-child">
        <h1>woah where you goin?</h1>
        <p>just kidding, thanks for visiting! i hope to see you come back :]</p>
        <button onclick="pweaseClick()">ok!</button>
    </div>
</div> */