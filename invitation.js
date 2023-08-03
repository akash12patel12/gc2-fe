const urlI = "http://localhost:3000";
const configI = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

async function inviteUser(e) {
  e.preventDefault();
  let username = e.target.username.value;
  let groupId = await localStorage.getItem("activeGroup");
  axios
    .post(
      `${urlI}/inviteuser`,
      { groupId: groupId, username: username },
      configI
    )
    .then((res) => {
      alert(res.data.message);
    })
    .catch((err) => {
      alert(err.response.data.error);
    });
}

async function seeGroupInvites() {
  axios
    .get(`${urlI}/seeGroupInvites`, config)
    .then((res) => {
      const invites = res.data;
      const inviteListElement = document.getElementById("invite-list-div");
      inviteListElement.removeAttribute("hidden");
      const inviteListElementTable = document.getElementById("invite-list");

      inviteListElementTable.innerHTML = "";
      invites.forEach((invite) => {
        inviteListElementTable.innerHTML += ` <tr> <td>${invite.groupName}</td>

        <td> <button onclick="acceptInvite(${invite.id})" class="btn btn-warning"> Accept</button> </td>

        <td><button onclick="rejectInvite(${invite.id})" class="btn btn-danger"> Reject </button></td> </tr> <br>`;
      });
    })
    .catch((err) => {});
}

async function acceptInvite(id) {
  console.log(`Accepting ${id}`);

  // call api to accept invite sending id
  axios
    .post(`${urlI}/acceptInvite`, { id: id }, configI)
    .then((res) => {
      // on succefull accepting
      alert(res.data.message);
      seeGroupInvites();
      getGroupsOfUser();
    })
    .catch((err) => {
      alert(err.response.data.error);
      // on failures
      // Alert Error Message
      seeGroupInvites();
    });
}

async function rejectInvite(id) {
  console.log(`Rejecting ${id}`);

  axios
    .post(`${urlI}/rejectInvite`, { id: id }, configI)
    .then((res) => {
      alert(res.data.message);
      seeGroupInvites();
    })
    .catch((err) => {
      alert(err.response.data.error);
      seeGroupInvites();
    });
}
