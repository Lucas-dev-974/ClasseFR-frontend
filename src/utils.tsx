//Ajouter une vérif du token necessaire ?
export default function authenticationCheck(){
    var myToken:any;
    myToken = localStorage.getItem('Authorization');
    if (myToken==null){
        return false
    }
    else{
        return true
    }
}