// éléments du formulaire et du tableau
const prenom=document.getElementById("prenom");
const nom=document.querySelector("#nom");
const tel=document.getElementById("Tel");
const btnAjout=document.getElementById("btn-ajout");
const list=document.getElementsByTagName("tbody")[0];
const id=document.getElementById("id");
const search=document.getElementById("search");
const prevBtn=document.getElementById("prev");
const nextBtn=document.getElementById("next");
const pageInfo=document.getElementById("page-info");

// tableau des contacts en mémoire
let tabcontact=[];

// pagination
let currentPage = 1;
const itemsPerPage = 10;

// validation du téléphone : vérifie le format du numéro à la saisie et à la perte de focus
tel.addEventListener("blur",() => veriftel());
tel.addEventListener("keyup", ()=> veriftel());

// validation des champs prénom et nom
prenom.addEventListener("input", validateNameInput);
prenom.addEventListener("blur", validateNameInput);
nom.addEventListener("input", validateNameInput);
nom.addEventListener("blur", validateNameInput);

function isValidName(value) {
    const cleaned = value.trim();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\-\' ]+$/;
    return cleaned.length > 0 && nameRegex.test(cleaned);
}

function validateNameInput(e) {
    const element = e.target;
    if (element.value.trim() === "" || isValidName(element.value)) {
        element.style.borderColor = "grey";
    } else {
        element.style.borderColor = "red";
    }
}

// recherche instantanée avec reset de la page à 1
search.addEventListener("input", () => {
    currentPage = 1;
    lister();
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        lister();
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredContacts().length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        lister();
    }
});
function veriftel(){
   // vérifie que le téléphone contient exactement 9 chiffres
   if(isNaN(tel.value)==false && tel.value.length== 9){
    tel.style.borderColor="grey";
   }
   else{
    tel.style.borderColor="red";
   }
}

btnAjout.onclick=function(){
    // verifier que tous les champs sont remplis
    if(prenom.value.trim()==="" || nom.value.trim()==="" || tel.value.trim()===""){
        alert('tous les champs sont obligatoires');
    }
    // validation du prénom et du nom avant enregistrement
    else if(!isValidName(prenom.value) || !isValidName(nom.value)){
        alert('Le prénom et le nom doivent contenir seulement des lettres, des espaces, des traits d\'union ou des apostrophes.');
        if(!isValidName(prenom.value)) prenom.style.borderColor = "red";
        if(!isValidName(nom.value)) nom.style.borderColor = "red";
    }
    // ajout des éléments dans la liste
    else{
        //numero++;
        
        let c={
            prenom: prenom.value.trim(),
            nom: nom.value.trim(),
            tel: tel.value.trim()

        };
        //si le champ id est vide on est en mode ajout sinon on est en mode modifier
        if(id.value==""){
          tabcontact.push(c);

        }
        else{
            tabcontact[id.value]=c;
            id.value="";
            btnAjout.innerText="Ajouter";
        }
       
        //appelle de le fonction lister pour raffraichir le tableu HTML
       lister();
  
          //vider les champs
         prenom.value="";
         nom.value="";
         tel.value="";
    }
}
function supprimer(indice){
    if(confirm("vouler-vous supprimer ce contact")){
        //splice permet de supprimer un element à partir de l'indice
       tabcontact.splice(indice,1);
       const filtered = filteredContacts();
       const totalPages = Math.ceil(filtered.length / itemsPerPage);
       if (currentPage > totalPages && totalPages > 0) {
           currentPage = totalPages;
       }
       lister();

    }

}
function lister(){
    const filtered = filteredContacts();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageContacts = filtered.slice(start, end);
    // initialisation du tableau à chaque clic pour (ajouter) sinon tous les elements precedents du tableau vont etre rajouter
     list.innerHTML="";
        pageContacts.forEach((Element,index )=> {
            const actualIndex = tabcontact.indexOf(Element);
                    list.innerHTML+=`
                     <tr>
                            <td>${start + index + 1}</td>
                            <td>${Element.prenom}</td>
                            <td>${Element.nom}</td>
                            <td>${Element.tel}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-warning"
                                onclick="modifier('${actualIndex}')">✏️</button>
                                <button class="btn btn-sm btn-outline-danger"
                                onclick="supprimer('${actualIndex}')">❌</button>

                            </td>
                        </tr>`;
        });
    updatePagination(filtered.length);
}
function filteredContacts() {
    const query = search.value.toLowerCase();
    return tabcontact.filter(contact =>
        contact.prenom.toLowerCase().includes(query) ||
        contact.nom.toLowerCase().includes(query) ||
        contact.tel.toLowerCase().includes(query)
    );
}
function updatePagination(total) {
    const totalPages = Math.ceil(total / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}
function modifier(indice){
    //ici on fait un remplissage du formulaire apres un clic du boutton modifier sur une ligne (indice) du tableau
    prenom.value=tabcontact[indice].prenom;
    nom.value=tabcontact[indice].nom;
    tel.value=tabcontact[indice].tel;
    id.value=indice;
    btnAjout.innerText="modifier"
}
