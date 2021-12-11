// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove, onValue} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn-EdWqJGisxwAsS__4pT23grpf-yo3GQ",
  authDomain: "brunello-87a69.firebaseapp.com",
  projectId: "brunello-87a69",
  storageBucket: "brunello-87a69.appspot.com",
  messagingSenderId: "75944243376",
  databaseURL: "https://brunello-87a69-default-rtdb.firebaseio.com/",
  appId: "1:75944243376:web:e6c51523e602ffbb264b75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase()
const auth = getAuth();

/* ! LOGIN loader*/
const loginLoaderContainer = document.querySelector('.login__loader__container')

/* ! variabili login */
const form = document.querySelector('.form')
const emailInput = document.querySelector('.emailInput')
const passwordInput = document.querySelector('.passwordInput')
const erroreLoginForm = document.querySelector('.login__error')
const showPassword = document.querySelector('.showPassword')
const loginButton = document.querySelector('.login__button')
const pageDescription = document.querySelector('.page__description')
const pageLogin = document.querySelector('.page__login')

/* ! variabili registrati */
const registratiForm =  document.querySelector('.registrati__form')
const registratiUsernameInput = document.querySelector('.registrati__usernameInput')
const registratiEmailInput = document.querySelector('.registrati__emailInput')
const registratiPasswordInput = document.querySelector('.registrati__passwordInput')
const registratiShowPassword = document.querySelector('.registrati__showPassword')
const registratiText = document.querySelector('.registrati')
const registratiErrore = document.querySelector('.registrati__errore')
const registratUtenteCreatoText = document.querySelector('.registrati__utenteCreatoText')
const closeRegistratiForm = document.querySelector('.registrati__title__container')

/* ! variabili home */
const homeContainer = document.querySelector('.home-container')
const plusIcon = document.querySelector('.home__plus__icon')
const logoutIcon = document.querySelector('.logout__icon')
const fotoProfilo =  document.querySelector('.home__foto__profilo')
const salutoUtente =  document.querySelector('.home__saluto__utente')
const formCreaBachecha = document.querySelector('.form__crea__bachecha')
const formCreaBachechaInput = document.querySelector('.form__crea__bachecha__titolo')
const bachecheListContainer = document.querySelector('.home__content__bachechaList__container')
const bachecheTitolo = document.querySelector('.bachecheTitolo')
var bacheche = []

/* ! variabili bacheca*/
const bachecaPageContainer = document.querySelector('.singol__bacheca__container')
const titoloBacheca = document.querySelector('.titolo__bacheca')
const taskListForm = document.querySelector('.tasklist__form')
const tasklistTextInput = document.querySelector('.tasklist__textInput')
const singolBachecaContentContent = document.querySelector('.singol__bacheca__content__content')

// ! codice firebase
onAuthStateChanged(auth, (user) => {
  if (user) {

   loginLoaderContainer.classList.add('login__loader__container__active')
   setTimeout(function(){
     loginLoaderContainer.classList.remove('login__loader__container__active')
     homeContainer.classList.remove('homeClosed')
    }, 2500);
   console.log(user)
   salutoUtente.innerHTML = 'Ciao ' + user.displayName

   //prendi i dati dell'utente dal database
   const starCountRef = ref(db, 'user/' + user.displayName);
   onValue(starCountRef, (snapshot) => {
   const data = snapshot.val();
   console.log(data)

   const leBacheche = data.bacheche
   bacheche = []
   leBacheche.forEach((bacheca) => {
      bacheche.push(bacheca)
      console.log(bacheche)
   });


   for(let i = 0; i < leBacheche.length; i++){
     const nuovaBacheca = document.createElement('div')
     nuovaBacheca.innerHTML = `
     <div class="home__content__bacheca__card" id="bachecaCard">
      <img src="img/chiudibacheca.png" class="home__content__bacheca__card__delete__bacheca" id="deleteBacheca" alt="">
       <img class="home__content__bacheca__card__img" src="https://picsum.photos/200/300?random=${i}" alt="" >
       <h3 class="home__content__bacheca__card__title" id="homeBachecaCard">${bacheche[i].nomeBacheca}</h3>
     </div>
     `

        bachecheListContainer.appendChild(nuovaBacheca)
   }
   });






  } else {

    homeContainer.classList.add('homeClosed')
    console.log('user not logged')

  }
});

// crea utente firebase function
function creaUtente(){
  const username = document.querySelector('.registrati__usernameInput').value;
  const email = document.querySelector('.registrati__emailInput').value;
  const password = document.querySelector('.registrati__passwordInput').value;

  if(password.length >= 6 && username.length > 0){
    createUserWithEmailAndPassword(auth, email, password,)
     .then((userCredential) => {
       // Signed in
       const user = userCredential.user;

      // aggiorna il profilo inserendo il nome
       updateProfile(auth.currentUser, {
         displayName: username
         }).then(() => {
           // Profile updated!
           // ...
         }).catch((error) => {
           // An error occurred
           // ...
         });

         //aggiunge l'utente al database
           set(ref(db, "user/" + username),{
               name: username,
               email: email,
           })
           .then(() => {
             alert("utente creato con successo sul db")
           })
           .catch((error) => {
              alert('errore:' + error)
           })

       registratUtenteCreatoText.innerHTML = 'Utente Creato con successo'
       setTimeout(function(){
         registratiForm.classList.remove("registrati__form__active")
         registratiForm.reset()
         registratiErrore.innerHTML = ''
       }, 1000);
       // ...
     })
     .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;
       alert('errore:' + errorMessage)
       // ..
     });
  }else if(username.length <= 0){
    registratiErrore.innerHTML = 'Inserire lo username'
  }else if(email.length <= 0){
    registratiErrore.innerHTML = 'inserire un email'
  }else if(password.length < 6){
    registratiErrore.innerHTML = 'La password deve essere lunga almeno 6 caratteri'
  }
//chiusura funzione crea utente
}

// funzione per il login
function login(){
  const email = document.querySelector('.emailInput').value
  const password = document.querySelector('.passwordInput').value

  if(email.length > 0 && password.length >= 6){
    signInWithEmailAndPassword(auth, email, password,)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorMessage == "Firebase: Error (auth/wrong-password)."){
        erroreLoginForm.innerHTML = 'Password sbagliata'
      }else if(errorMessage == "Firebase: Error (auth/user-not-found)."){
         erroreLoginForm.innerHTML = 'Utente non trovato, Registrati!'
      }

    });
  }else if(email.length <= 0){
    erroreLoginForm.innerHTML = 'Inserire un Email'
  }else if(password.length < 6){
    erroreLoginForm.innerHTML = 'Inserire una password lunga almeno 6 caratteri'
  }
//chiusura funzione login
}

// funzione per il logout
function logout(){
  auth.signOut().then(() =>{
    console.log('logout eseguito con successo')
  })
}

/* ! codice del login */
loginButton.addEventListener('click', () =>{
  pageDescription.classList.add('description__active')
  pageLogin.classList.add('login__active')
})

showPassword.addEventListener('click', () =>{
  if (passwordInput.type === "password"){
  passwordInput.type = "text";
  showPassword.src = "img/hidden.png"
} else {
  passwordInput.type = "password";
  showPassword.src = "img/eye.png"
}
})

form.addEventListener('submit', (e) =>{
  e.preventDefault()
  login()
})

/* ! codice del registrati */
//attiva mostra password al click dell'occhio
registratiShowPassword.addEventListener('click', () =>{
  if (registratiPasswordInput.type === "password") {
  registratiPasswordInput.type = "text";
  registratiShowPassword.src = "img/hidden.png"
} else {
  registratiPasswordInput.type = "password";
  registratiShowPassword.src = "img/eye.png"
}
})


// fa apparire il form di registrazione
registratiText.addEventListener('click', () =>{
  registratiForm.classList.add("registrati__form__active")
})
// fa scoparire il form di registrazione
closeRegistratiForm.addEventListener('click', () =>{
  registratiForm.classList.remove("registrati__form__active")
})

//al submit esegue la funzione crea utente e aggiorna la foto ed il nome dell'creaUtente
registratiForm.addEventListener('submit', (e) =>{
  e.preventDefault()
  creaUtente()
})


/* ! codice della home */
//logout function
logoutIcon.addEventListener('click', () => {
  logout()
})

//apri form crea bacheca
plusIcon.addEventListener('click', () => {
  formCreaBachecha.classList.toggle('form__crea__bachecha__active')
  plusIcon.classList.toggle('home__plus__rotate')
  bachecheTitolo.classList.toggle('dissapear')
})

//form crea bacheca
formCreaBachecha.addEventListener('submit', (e) => {
  e.preventDefault()
  var bacheca ={
    nomeBacheca: formCreaBachechaInput.value,
  }
  bacheche.push(bacheca)
  const user = auth.currentUser.displayName
  //aggiunge le bacheche al database
    update(ref(db, "user/" + user),{
        bacheche: bacheche
    })
    .then(() => {

    })
    .catch((error) => {
       alert('errore:' + error)
    })

    bachecheListContainer.innerHTML = ""

    for(let i = 0; i < bacheche.length; i++){
      const nuovaBacheca = document.createElement('div')
      nuovaBacheca.innerHTML = `
      <div class="home__content__bacheca__card" id="bachecaCard">
        <img src="img/chiudibacheca.png" class="home__content__bacheca__card__delete__bacheca" alt="">
        <img class="home__content__bacheca__card__img" src="https://picsum.photos/200/300?random=${i}" alt="" >
        <h3 class="home__content__bacheca__card__title" id="homeBachecaCard">${bacheche[i].nomeBacheca}</h3>
      </div>
      `
      bachecheListContainer.appendChild(nuovaBacheca)
    }
    formCreaBachecha.reset()
    formCreaBachecha.classList.remove('form__crea__bachecha__active')
    plusIcon.classList.remove('home__plus__rotate')
    bachecheTitolo.classList.remove('dissapear')
    // ! eliminare le bacheche
    const deleteCard = document.querySelectorAll('.home__content__bacheca__card__delete__bacheca')
    deleteCard.forEach((cardDeleter) => {
        cardDeleter.addEventListener('click', function(e){
           const titleBacheca = e.target.parentElement.lastElementChild.textContent
           const indexObjBacheca = bacheche.findIndex(item => item.nomeBacheca === titleBacheca);
           console.log(indexObjBacheca)
           const user = auth.currentUser.displayName
           if (indexObjBacheca > -1) {
              bacheche.splice(indexObjBacheca, 1);
           }
           update(ref(db, "user/" + user),{
               bacheche: bacheche
           })
           .then(() => {
             alert('elemento eliminato')
           })
           .catch((error) => {
              alert('errore:' + error)
           })
           bachecheListContainer.innerHTML = ""

           for(let i = 0; i < bacheche.length; i++){
             const nuovaBacheca = document.createElement('div')
             nuovaBacheca.innerHTML = `
             <div class="home__content__bacheca__card" id="bachecaCard">
               <img src="img/chiudibacheca.png" class="home__content__bacheca__card__delete__bacheca" alt="">
               <img class="home__content__bacheca__card__img" src="https://picsum.photos/200/300?random=${i}" alt="" >
               <h3 class="home__content__bacheca__card__title" id="homeBachecaCard">${bacheche[i].nomeBacheca}</h3>
             </div>
             `
             bachecheListContainer.appendChild(nuovaBacheca)
           }
        })


    });

})


var nomeBacheca
var indexDelTodo

//al click apre la singola bacheca e renderizza il contenuto
document.addEventListener('click', function(e){
    if( e.target.id== 'homeBachecaCard'){
         var card = e.target.parentElement
         var titleCard = e.target.textContent
         card.classList.add('cardActive')
         bachecaPageContainer.classList.add('singol__bacheca__container__active')
         titoloBacheca.innerHTML = titleCard
         const indexObjBacheca = bacheche.findIndex(item => item.nomeBacheca === titleCard);
         nomeBacheca = indexObjBacheca
         // console.log(indexObjBacheca)
         singolBachecaContentContent.innerHTML = ""
          bacheche[indexObjBacheca].tasklist.forEach((task) => {
            const nuovaTaskList = document.createElement("div")
            nuovaTaskList.innerHTML = `
            <div class="tasklist__box" id="boxTodoSeparatorId">
              <div class="tasklist__box__title">
                <h4>${task.nomeTasklist}</h4>
                <img src="img/chiudibacheca.png" style="width: 20px;margin-right:10px" id="deleteTasklist" alt="">
              </div>
              <div class="tasklist__box__content">
                <form class="crea__todo__form" action="index.html" method="post">
                  <input class="crea__todo__textInput" type="text" name="" value="" placeholder="+ Aggiungi un task">
                </form>

                <div class="boxTodoSeparator" id="newBoxTodoSeparatorId">

                </div>

              </div>
            </div>
            `
            singolBachecaContentContent.appendChild(nuovaTaskList)
            const boxSeparetor = document.querySelectorAll('#boxTodoSeparatorId')
            const globalboxSeparetor = boxSeparetor
            const newBoxSeparator = document.querySelectorAll('#newBoxTodoSeparatorId')
            const globalnewBoxSeparator = newBoxSeparator

            // for(let i = 0; i < bacheche[indexObjBacheca].tasklist.length; i++){
            //
            //   for(let j = 0; j < bacheche[indexObjBacheca].tasklist[i].todosContainer.todo.length; j++){
            //     var test = bacheche[indexObjBacheca].tasklist[i].todosContainer.todo
            //     console.log(test)
            //     newBoxSeparator[i].innerHTML +=  `<div class="todo__box">
            //             <p>${test[j]}</p>
            //             <img src="img/edit.png" alt="">
            //           </div>
            //           `
            //   }
            //
            // }

            for(let i = 0; i < boxSeparetor.length; i++ ){
              newBoxSeparator[i].innerHTML = ""
              if( bacheche[indexObjBacheca].tasklist[i].todosContainer === undefined){
                continue
              }
              for(let j = 0; j < bacheche[indexObjBacheca].tasklist[i].todosContainer.todo.length; j++){
                var test = bacheche[indexObjBacheca].tasklist[i].todosContainer.todo
                console.log(test)
                newBoxSeparator[i].innerHTML +=  `<div class="todo__box">
                        <p>${test[j]}</p>
                        <img src="img/chiudibacheca.png" style="width: 10px;height: auto;margin-right:10px"  id="eliminaTodo" alt="">
                      </div>
                      `

              }
            }

          });



         console.log(bacheche[indexObjBacheca])
    }
});

// ! elimina la sinngola bacheca
document.addEventListener('click', function(e){
    if( e.target.id== 'deleteBacheca'){
      // ! eliminare le bacheche
      const deleteCard = document.querySelectorAll('.home__content__bacheca__card__delete__bacheca')
      deleteCard.forEach((cardDeleter) => {
          cardDeleter.addEventListener('click', function(e){
             const titleBacheca = e.target.parentElement.lastElementChild.textContent
             const indexObjBacheca = bacheche.findIndex(item => item.nomeBacheca === titleBacheca);
             console.log(indexObjBacheca)
             const user = auth.currentUser.displayName
             if (indexObjBacheca > -1) {
                bacheche.splice(indexObjBacheca, 1);
             }
             update(ref(db, "user/" + user),{
                 bacheche: bacheche
             })
             .then(() => {
               alert('elemento eliminato')
             })
             .catch((error) => {
                alert('errore:' + error)
             })
             bachecheListContainer.innerHTML = ""

             for(let i = 0; i < bacheche.length; i++){
               const nuovaBacheca = document.createElement('div')
               nuovaBacheca.innerHTML = `
               <div class="home__content__bacheca__card" id="bachecaCard">
                 <img src="img/chiudibacheca.png" class="home__content__bacheca__card__delete__bacheca" alt="">
                 <img class="home__content__bacheca__card__img" src="https://picsum.photos/200/300?random=${i}" alt="" >
                 <h3 class="home__content__bacheca__card__title" id="homeBachecaCard">${bacheche[i].nomeBacheca}</h3>
               </div>
               `
               bachecheListContainer.appendChild(nuovaBacheca)
             }
          })


      });
    }
})

// ! elimina la sinngola tasklist
document.addEventListener('click', function(e){
   if(e.target.id == "deleteTasklist"){
     console.log('ciao')
       const nomeBoxTasklist = e.target.parentElement.firstElementChild.textContent
       const indexTasklist = bacheche[nomeBacheca].tasklist.findIndex(item => item.nomeTasklist === nomeBoxTasklist);
       const box = e.target.parentElement.parentElement.lastElementChild.lastElementChild
       const tasklistSingola = e.target.parentElement.parentElement.parentElement
       tasklistSingola.style.display = 'none'

              const user = auth.currentUser.displayName
              if (indexTasklist > -1) {
                 bacheche[nomeBacheca].tasklist.splice(indexTasklist, 1);
              }
              console.log(bacheche)
              update(ref(db, "user/" + user),{
                  bacheche: bacheche
              })
              .then(() => {
                alert('elemento eliminato')
              })
              .catch((error) => {
                 alert('errore:' + error)
              })



   }
})


/* ! codice della bacheca*/
taskListForm.addEventListener('submit', (e) =>{
   e.preventDefault()
   const tasklistNome = tasklistTextInput.value
   var tasklist ={
     nomeTasklist: tasklistNome,
   }


   if(!bacheche[nomeBacheca].tasklist){
     bacheche[nomeBacheca].tasklist = [tasklist]
   }else{
     bacheche[nomeBacheca].tasklist.push(tasklist)
   }

   console.log(bacheche)
   const user = auth.currentUser.displayName
   //aggiornare le bacheche al database
     update(ref(db, "user/" + user),{
         bacheche: bacheche
     })
     .then(() => {

     })
     .catch((error) => {
        alert('errore:' + error)
     })
     singolBachecaContentContent.innerHTML = ""
      bacheche[nomeBacheca].tasklist.forEach((task) => {
        const nuovaTaskList = document.createElement("div")
        nuovaTaskList.innerHTML = `
        <div class="tasklist__box" id="boxTodoSeparatorId">
          <div class="tasklist__box__title">
            <h4>${task.nomeTasklist}</h4>
            <img src="img/chiudibacheca.png" style="width: 20px;margin-right:10px" id="deleteTasklist" alt="">
          </div>
          <div class="tasklist__box__content">
            <form class="crea__todo__form" action="index.html" method="post">
              <input class="crea__todo__textInput" type="text" name="" value="" placeholder="+ Aggiungi un task">
            </form>

            <div class="boxTodoSeparator" id="newBoxTodoSeparatorId">

            </div>

          </div>
        </div>
        `
        singolBachecaContentContent.appendChild(nuovaTaskList)
      });
      taskListForm.reset()

      const boxSeparetor = document.querySelectorAll('#boxTodoSeparatorId')
      const newBoxSeparator = document.querySelectorAll('#newBoxTodoSeparatorId')
      for(let i = 0; i < boxSeparetor.length; i++ ){
        newBoxSeparator[i].innerHTML = ""
        if( bacheche[nomeBacheca].tasklist[i].todosContainer === undefined){
          continue
        }
        for(let j = 0; j < bacheche[nomeBacheca].tasklist[i].todosContainer.todo.length; j++){
          var test = bacheche[nomeBacheca].tasklist[i].todosContainer.todo
          console.log(test)
          newBoxSeparator[i].innerHTML +=  `<div class="todo__box">
                  <p class="titoloTodo">${test[j]}</p>
                  <img src="img/chiudibacheca.png" style="width: 10px;height: auto;margin-right:10px" id="eliminaTodo" alt="">
                </div>
                `
        }
      }
})


// al click crea un todo, lo renderizza e crea la funzione eliminatodo
document.addEventListener('click', function(e){
     if( e.target.classList == 'crea__todo__textInput'){
       console.log("funziona")
       const form = e.target.parentElement
       const box = e.target.parentElement.parentElement.lastElementChild
       console.log(box)
       const nomeBoxTasklist = e.target.parentElement.parentElement.previousElementSibling.firstElementChild.textContent
       console.log(nomeBoxTasklist)

       // function trovaIndexTasklist(indiceBacheca, nomeTasklist) {
       //  const indexTasklist = bacheche[indiceBacheca].tasklist.findIndex(
       //  item => item.nomeTasklist === nomeTasklist
       // );
       //
       // console.log(indexTasklist);
       // }
       //
       // trovaIndexTasklist(nomeBacheca, nomeBoxTasklist)

       const indexTasklist = bacheche[nomeBacheca].tasklist.findIndex(item => item.nomeTasklist === nomeBoxTasklist);
       console.log(indexTasklist)

       const inputValue = e.target
       const nuovoInputValue = e.target
       form.addEventListener('submit', (e) =>{
         e.preventDefault()
         const todosContainer = {
           todo: [inputValue.value]
         }
         if(!bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer){
           bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer = todosContainer
         }else{
           bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer.todo.push(nuovoInputValue.value)
         }
         console.log(bacheche)
         const user = auth.currentUser.displayName
         //aggiornare le bacheche al database
           update(ref(db, "user/" + user),{
               bacheche: bacheche
           })
           .then(() => {

           })
           .catch((error) => {
              alert('errore:' + error)
           })
         box.innerHTML = ""
         bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer.todo.forEach((todo) => {
           const singolTodo = document.createElement('div')
           singolTodo.innerHTML = `
           <div class="todo__box">
             <p>${todo}</p>
             <img src="img/chiudibacheca.png" style="width: 10px;height: auto;margin-right:10px" id="eliminaTodo" alt="">
           </div>
           `
           box.appendChild(singolTodo)
         });
         form.reset()
         const deleteTodoIcon = document.querySelectorAll('#eliminaTodo')
         deleteTodoIcon.forEach((deleteTodo) => {
           deleteTodo.addEventListener('click', function(e){
             var titleTodoInput = e.target.parentElement.parentElement.firstElementChild.firstElementChild.textContent
             var titleTasklistTodo = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.textContent
             var indexTodoInput = bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer.todo.indexOf(titleTodoInput)
             const todoInput = e.target.parentElement
             todoInput.style.display = "none";
             bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer.todo.splice(indexTodoInput, 1);
             update(ref(db, "user/" + user),{
                   bacheche: bacheche
               })
               .then(() => {
                 alert('elemento eliminato')
               })
               .catch((error) => {
                  alert('errore:' + error)
               })

           })
         });
       })
     }
})

// // ! elimina la singola todo
document.addEventListener('click', function(e){

  if(e.target.id == "eliminaTodo"){

  var titleTodo = e.target.parentElement.firstElementChild.textContent
  var titleTasklist = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.textContent
  var indexTasklist = bacheche[nomeBacheca].tasklist.findIndex(item => item.nomeTasklist === titleTasklist);
  var indexTodo = bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer.todo.indexOf(titleTodo)
  console.log(indexTodo)
  //
  const box = e.target.parentElement.parentElement
  const todo = e.target.parentElement
  console.log(box)
  todo.style.display = "none";

  const user = auth.currentUser.displayName

    bacheche[nomeBacheca].tasklist[indexTasklist].todosContainer.todo.splice(indexTodo, 1);

    update(ref(db, "user/" + user),{
        bacheche: bacheche
    })
    .then(() => {
      alert('elemento eliminato')
    })
    .catch((error) => {
       alert('errore:' + error)
    })


  }
})
