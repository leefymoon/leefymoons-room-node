//script for random banners :yippee:
//array in "banner creator";"image name" format
var img = [
    "leefy;banner1",
    "bespoke;banner2",
    "zookajoe;banner3",
    "hunter;banner4",
    "epicness;banner5",
    "li;banner6",
    "ryni;banner7",
    "cozmo;banner8",
    "jarhead;banner9"
];

//randomly picks a string
banner = Math.floor(Math.random() * img.length);

//splits the picked string into image name and creator name
var bannerSplit = img[banner].split(";");

//changes the src of banner element to the split string and the text of banner creds to the other half of split string
//i hate making comments holy shit
document.getElementById("banner").src = "images/" + bannerSplit[1] + ".png";
document.getElementById("banner-creds").textContent = "made by " + bannerSplit[0];