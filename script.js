const wrapper = document.querySelector(".wrapper"),  //.wrapper is a class 
searchInput = wrapper.querySelector("input"),       
infoText = wrapper.querySelector(".info-text"),  //.info-text is a class
synonyms = wrapper.querySelector(".synonyms .list"),
volumeIcon = wrapper.querySelector(".word i"), 
removeIcon = wrapper.querySelector(".search span");
let audio;


//data function
function data(result,word)
{
    if(result.title)
    {   //if api returns can't find word.
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>.Please,try search other word.`; 
    }
    else
    {
        //When api return found.
        //console.log(result);
        wrapper.classList.add("active"); //we add active class to the wrapper element.
        //Now,pass the particular response data to a particular HTML element 

        let def = result[0].meanings[0].definitions[0];
        let phonetics =`${result[0].meanings[0].partOfSpeech}/${result[0].phonetics[0].text}/`;
        document.querySelector(".word p").innerText = result[0].word; 
        document.querySelector(".word span").innerText = phonetics; 
        document.querySelector(".meaning span").innerText = def.definition;
        document.querySelector(".example span").innerText = def.example;

        //creating new object of audio and passing audio src.
        audio = new Audio(result[0].phonetics[0].audio);
        
        if(def.synonyms[0] == undefined)//if there is no synonym there,im gonna hide synonyms div
        {
            synonyms.parentElement.style.display = "none"; 
        }
        else
        {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML=""; 
            //First five synonyms will print.
            for (let i=0;i<5;i++){
            let tag = `<span onclick = search('${def.synonyms[i]}')>${def.synonyms[i]},</span>`;
            tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
            synonyms.insertAdjacentHTML("beforeend",tag); 
            //passing five synonyms inside synonoyms div
            //insertAdjacentHTML(position, html)
        }
     }     
   }  
}

//Search synonyms function
function search(word)
{
   fetchApi(word);
   searchInput.value = word;  
   //wrapper.classList.remove("active");
}

//fetch api function
function fetchApi(word)
{
    wrapper.classList.remove("active");
    infoText.style.color = "#000"; 
    infoText.innerHTML = `Searching for the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; 
    
    /* 
    fetching api response and returning it with parsing into js object and in 
    another then method calling data function with passing api response and 
    searched word as an argument. 
    */
    fetch(url)
    .then(response => response.json())
    .then(result => data(result,word))
    .catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;  
    });
}


searchInput.addEventListener("keyup",e =>{
    let word = e.target.value.replace(/\s+/g, ' ');
    if(e.key === "Enter" && word){
        //if pressed key is Enter and the input field is not empty
        //then call fetchApi function. 
        fetchApi(word); //target is an Even Property.
    }
    
});


//addEventListener(event, function, useCapture)
volumeIcon.addEventListener("click",()=>{
    volumeIcon.style.color = "#4D59FB";
    audio.play(); 
    setTimeout(() =>{
        volumeIcon.style.color = "#999";
    },800);
});

removeIcon.addEventListener("click",()=>{
    searchInput.value = ""; //all input will empty.
    searchInput.focus();   //search portion will focused.
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a"; 
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

