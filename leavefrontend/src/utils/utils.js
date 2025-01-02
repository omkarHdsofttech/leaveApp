// import { useNavigate } from "react-router-dom";

export const isAuthenticated = async () => {
    // const navigate =useNavigate();
    const token = await localStorage.getItem('userToken');
    console.log("is Authenticated", token)
    
    return token

}

export const designationCheck=(U_desig,navigateState,navigate)=>{

    if (
        U_desig === "D003" ||
        U_desig === "D002" ||
        U_desig === "D012" ||
        U_desig === "D008" ||
        U_desig === "D007"
      ) {
        navigate("/teamleader", { state: navigateState });
      } else if (
        U_desig === "D001" ||
        U_desig === "D016" ||
        U_desig === "D005" ||
        U_desig === "D006" ||
        U_desig === "D009" ||
        U_desig === "D013" ||
        U_desig === "D014"
      ) {
        navigate("/employee", { state: navigateState });
      } else if (U_desig === "D011") {
        console.log(U_desig)
        navigate("/admin", { state: navigateState });

      } else {
        navigate("/founder", { state: navigateState });
      }
}