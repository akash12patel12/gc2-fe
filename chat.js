const url = "http://localhost:3000";
let globalgroups;
const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

async function getLoggedInUser(){
  const loggedinuser = document.getElementById('loggedinuser');
  axios.get(`${url}/getLoggedInUser`, config).then(res=>{
    loggedinuser.innerHTML = res.data.User;
  })


}

getLoggedInUser();

function sendm(e) {
  e.preventDefault();
  // console.log("called");
  axios
    .post(
      `${url}/send`,
      {
        message: e.target.message.value,
        groupId: localStorage.getItem("activeGroup"),
      },
      config
    )
    .then((data) => {
      location.reload();
    });
}

// getMsgsFromLS();

// async function getMsgsFromLS() {
//   let success = await checkForNewMessages();
//   let messages = await localStorage.getItem("messages");
//   messages = JSON.parse(messages);
//   showMessages(messages);
// }

// async function checkForNewMessages() {
//   let currentMessages = await localStorage.getItem("messages");
//   let lastMsgId;

//   if (!currentMessages) {
//     let messages = await axios.get(`${url}/getLatestTenMessages`, config);
//     await localStorage.setItem("messages", JSON.stringify(messages.data));
//     return true;
//   } else {
//     currentMessages = JSON.parse(currentMessages);
//     lastMsgId = currentMessages[currentMessages.length - 1].id;
//   }

//   let messages = await axios.get(
//     `${url}/getLatestMessages?lastMsgId=${lastMsgId}`,
//     config
//   );
//   currentMessages = currentMessages.concat(messages.data);
//   currentMessages = currentMessages.slice(
//     Math.max(currentMessages.length - 10, 0)
//   );
//   await localStorage.setItem("messages", JSON.stringify(currentMessages));
//   return true;
// }

async function showMessages(messages) {
  const chatarea = document.getElementById("chat-area");
  chatarea.innerHTML = "";
  await messages.forEach((msg) => {
    chatarea.innerHTML =
      chatarea.innerHTML + `${msg.sender} : ${msg.message} <br>`;
  });
}

async function createGroup(e) {
  e.preventDefault();
  axios
    .post(`${url}/createGroup`, { groupName: e.target.groupName.value }, config)
    .then((res) => {
      alert(res.data.msg);
      getGroupsOfUser()
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getGroupsOfUser() {
  return axios
    .get(`${url}/getGroupsOfUser`, config)
    .then(async (res) => {
      if (res.data.length !== 0) {
        // console.log(res.data[0].id);
        var groups = res.data;

        const elem = await document.getElementById("group-list");

        elem.innerHTML = "";

        groups.forEach((group) => {
          elem.innerHTML =
            elem.innerHTML +
            `<button class="btn btn-info mt-2" onclick="activateGroup(${group.id})"> ${group.name}</button><br> `;
        });

        return groups;
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log(err);
    });
}


function activateGroup(groupId) {
  // console.log(`group activated ${groupId}`);
  localStorage.setItem("activeGroup", groupId);
  getActiveGroup(groupId);
}

getGroupsOfUser();


async function getActiveGroup(id) {
  if(!id) {
    // console.log(localStorage.getItem('activeGroup'));
    if (localStorage.getItem("activeGroup")) {
      getActiveGroup(localStorage.getItem("activeGroup"));
    }
    
  }
  else  {
    axios
      .post(`${url}/getActiveGroup`, { id: id }, config)
      .then(async (res) => {
        const groupHeading = document.getElementById("group-heading");
        groupHeading.innerHTML = `${res.data.name}`;
      });
  } 
  getAllMessagesOfGroup();
}

getAllMessagesOfGroup();

async function getAllMessagesOfGroup(){
  axios
  .post(`${url}/getAllMessagesOfGroup`, { groupId: localStorage.getItem('activeGroup') }, config)
  .then( (res) => {
     const messages = res.data.messages ;
     showMessages(messages );
  }); 
}

setInterval(() => getAllMessagesOfGroup() , 1000)





