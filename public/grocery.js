import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./App.js";

const $$ = Dom7;

$$(".card").on("click", e => {
    //submitting a new note
    e.preventDefault();
    console.log("test");
});

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("groceries/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);
        $$("#groceryList").html("");
        for(let n = 0; n < aKeys.length; n++){
            let sCard = `
            <div id="card" class="card">
                <article class="toy">
                <div style='display:none' id="itemId">${aKeys[n]}</div>
                <h3>${oItems[aKeys[n]].item}</h3>
                <img  src="${oItems[aKeys[n]].image}"  alt="Toy"/>
                
                <button id="strike_${n}">I bought this</button> 
                <button id="delete_${n}">I don't need this</button>
            </article>
        </div>
        `
        // <div class="card-content card-content-padding">${oItems[aKeys[n]].item}</div>
        $$("#groceryList").append(sCard);
        
        $$('#delete_'+n)[0].onclick = function(){
            var key = document.getElementById("itemId").innerText;
            var node = firebase.database().ref("groceries/" + sUser + "/" + key);
            node.remove();
            console.log(key);
        };
        $$('#strike_'+n)[0].onclick = function(){
            var key = document.getElementById("itemId").innerText;
            document.getElementById("name").style = "text-decoration: line-through;"
            const sId = new Date().toISOString().replace(".", "_");
            firebase.database().ref("groceries/" + sUser + "/" + sId).updateChildren({ datePurchased: sId });
            console.log(key);
        };
    }
    console.log($$("#delete"));
    console.log($$("#strike"));
});

});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("groceries/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});

