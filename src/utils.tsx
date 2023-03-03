//Ajouter une vérif du token necessaire ?
export default function authenticationCheck(){
    console.log("date=>", new Date(Date.now()).toISOString())

    var myToken:any;
    myToken = localStorage.getItem('Authorization');
    console.log("authCheck=====>",myToken)
    if (myToken==null){
        return false
    }
    else{
        return true
    }
}