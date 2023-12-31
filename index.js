const apiurl  = "http://localhost:3000"
async function register(e){
    e.preventDefault();
  axios.post(`${apiurl}/register`, {
    "username" : e.target.username.value,
    // "email" : e.target.email.value,
    // "phone" :e.target.phone.value,
    "password" : e.target.password.value
   }).then(res=>{
     alert("User Created");
   }).catch(err=>{
    alert(err.response.data.errorMsg);
   })
}

function enablelogin(e){
  e.preventDefault();
 document.getElementById('login-form').style.display = 'block';
 document.getElementById('register-form').style.display = 'none';

}

function enableregister(e){
  e.preventDefault();
  document.getElementById('register-form').style.display = 'block'
  document.getElementById('login-form').style.display = 'none'

}

function login(e){
  e.preventDefault();
  axios.post(`${apiurl}/login`, {"username" :e.target.username.value, "password" : e.target.password.value}).then(res=>{
    alert('Logged In Successfully');
    const token = res.data.token;
    sessionStorage.setItem("token", token);
    localStorage.setItem("token", token);
    window.location.href = "chat.html";
  }).catch(err=>{
    // console.log();
    if(err.response.status === 401){
      alert('Password Is Incorrect!');
    }
    else if(err.response.status === 404){
      alert('No User Found!');
    }
    else {
      alert('Some Error Occured!');

    }
  });
}

