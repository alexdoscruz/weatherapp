const logInForm= document.getElementById("login-form");
const signInBtn= document.querySelector(".submit");
const errorMessage = document.querySelector('.message');


logInForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try{
        signInBtn.disabled = true;

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body:JSON.stringify({email, password}),
        });

        const data = await response.json();

        if(response.ok) {
            errorMessage.textContent = "Login Successfully";
            errorMessage.style.color="green";
            window.location.href ='/public/home.html'
        }

        else{
            errorMessage.textContent = data.message;
            errorMessage.style.color = "red";

        }


    }catch(error){
        console.error("error occurred: ", error);
        errorMessage.textContent= "error occurred while processing";
        errorMessage.style.color="red";
    
    }finally{
        signInBtn.disabled=false;
    }
});


