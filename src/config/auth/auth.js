
export const isAuthenticated = () => {
    
    if(localStorage.getItem("token")!=null){
        console.log("Retornando true");
        return true;
    }
    console.log("Retornando false");
    return false;
}