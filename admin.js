const urlA = "http://localhost:3000";

const configA = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

async function isTheUserIsAdminOfTheActiveGroup(){
  return axios.post(`${urlA}/isTheUserIsAdminOfTheActiveGroup`,{activeGroupId : localStorage.getItem('activeGroup')}, configA).then(res=>{
   return  flag = res.data.isAdmin
   });
}  


async function seeGroupUsers(){

  //Switching Tabs
  const inviteListElement = document.getElementById("invite-list-div");
  await inviteListElement.setAttribute('hidden' ,  true);

  const UserList = document.getElementById("user-list-div");
  await  UserList.removeAttribute('hidden');
  const isAdmin = await isTheUserIsAdminOfTheActiveGroup();
  // Calling Api to Get List Of All Users and Id 
  console.log(isAdmin);
  axios
    .post(`${urlI}/seeGroupUsers`, { groupId : localStorage.getItem('activeGroup')} , configI)
    .then(res=>{
      let userListElement = document.getElementById('user-list');
      userListElement.innerHTML = '';
      const users = res.data ;
      console.log(users);
      if(isAdmin === true){
        users.forEach(user=>{
          if(user.username === document.getElementById('loggedinuser').innerHTML){
            userListElement.innerHTML += `<tr>
           <td>${user.username}</td>
           <td></td>
           <td></td>
          </tr>`
          }
          else {
            userListElement.innerHTML += `<tr>
            <td>${user.username}</td>
            <td><button onclick="removeUser(${user.UserId})" class="btn btn-danger">Remove</button></td>
            <td><button onclick="makeAdmin(${user.UserId} , ${user.GroupId})" class="btn btn-danger">Make Admin</button></td>
           </tr>`
          }
         
         })
      }

      else {
        users.forEach(user=>{
          userListElement.innerHTML += `<tr>
           <td>${user.username}</td>
           <td></td>
           <td></td>
          </tr>`
         })
      }
      
    }).catch(err=>{
      console.log(err);
    })
  



}

async function activateInvitationForm(){

   const isAdmin = await isTheUserIsAdminOfTheActiveGroup();
   if(isAdmin){
    document.getElementById('invitation-form').removeAttribute('hidden');
   }
   else {
    alert("Only Admins Can Invite!")
   }
}


async function removeUser(userId){
  const isAdmin = await isTheUserIsAdminOfTheActiveGroup();
  let groupId = await localStorage.getItem('activeGroup');
  if(isAdmin){
    axios.post(`${urlA}/removeUser`, {UserId : userId , GroupId :groupId}, configA).then(res=>{
       alert(res.data.Message);
       seeGroupUsers();
    }).catch(err=>{
       alert(err.data.Error);
    })
  }
  else {
    alert("Only Admins Can Remove Other Users")
  }
}

async function makeAdmin(userId){
  const isAdmin = await isTheUserIsAdminOfTheActiveGroup();
  let groupId = await localStorage.getItem('activeGroup');
  if(isAdmin){
    axios.post(`${urlA}/makeAdmin`, {UserId : userId , GroupId :groupId}, configA).then(res=>{
       alert(res.data.Message);
       seeGroupUsers();
    }).catch(err=>{
       alert(err.data.Error);
    })
  }
  else {
    alert("Only Admins Can Make Other Users Admin")
  }
}
seeGroupUsers();