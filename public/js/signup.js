        const signupForm = document.querySelector("form");
        const errorMessage = document.querySelector(".message")
        const passwordInput = document.getElementById('password');
        

        

        signupForm.addEventListener("submit", async (event) =>{
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;


            try{
                const response = await fetch("/signup", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body:JSON.stringify({name, email, password}),
                });

                const data = await response.json();

                if(response.ok) {
                    errorMessage.textContent = "Account created Successfully";
                    errorMessage.style.color="green";
                    window.location.href ='/public/login.html'

                }

                else{
                    errorMessage.textContent = data.message;
                    errorMessage.style.color = "red";

                }


            }catch(error){
                console.error("error occurred:", error);
                errorMessage.textContent= "error occurred while processing";
                errorMessage.style.color="red";
            
            }
        });


