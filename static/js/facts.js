var facts = [
    "this site was founded back in the summer of 2023 on neocities! i was in my scene phase and i had just started learning html so it didn't look good...",
    "i have 2 dogs! we got them when they were puppies and that was when i was 8! they're black labs and so adorable :3",
    "i like going to the gym! i've never really been too athetically inclined, but i like going to the gym and working off stress :]",
    "haha leefy is actually really mean and evil and HATES joy and kindness >:3 (wait what, who put this in here?! ryni!!)",
    "i love playing overwatch! i main orisa, but i love playing many other characters! often times you'll find me playing with my friends :3 (shoutout to tommy, skitter, kable, and greel!!)",
    "i have a surface rt that is called the BBQRT. i dropped the flash drive i was using to install raspiOS into my BBQ sauce and uh. yeah."
];

activeFact = Math.floor(Math.random() * facts.length);

document.getElementById("fact-text").innerText = facts[activeFact];