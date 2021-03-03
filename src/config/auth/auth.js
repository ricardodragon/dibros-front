
export const isAuthenticated = () => {
    
    if(localStorage.getItem("token")!=null)
        return true;
    return false;
}