<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { changeEmail, changePassword } from '$lib/hooks/auth.js'
  import { updateUserInfo, updateUserAvatar } from '$lib/hooks/updates.js'
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Icons from '$lib/components/Icons.svelte'
  import noUser from '$lib/assets/no_user.png';

  let userData = {
    uid: $loggedInUser?.uid || "",
    name: $loggedInUser?.name || "",
    lastName: $loggedInUser?.lastName || "",
    businessName: $loggedInUser?.businessName || "",
    businessAddress: $loggedInUser?.businessAddress || "",
    email: $loggedInUser?.email || "",
  }

  let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  let currPassword ="", newPass = "", newEmail = "", repeatPassword = "";
  let avatar = "";

  const handleChangeUserInfo = async() => {
    console.log(userData);
    await updateUserInfo(userData);
  }

  const handleChangeEmail = (currentPassword, newEmail) => {
    // console.log(currentPassword, newEmail)
    changeEmail(currentPassword, newEmail);
    currPassword =""; 
    newEmail = "";
  }

  const handleChangePassword = (currentPassword, newPassword) => {
    // console.log(currentPassword, newPassword)
    changePassword(currentPassword, newPassword);
    currPassword =""; 
    newPass = ""; 
    repeatPassword = "";
  }

  const handleUpdateProfilePic = async() => {
    const uid = userData.uid;
    const picture = document.getElementById('file').files[0]
    const fileType = document.getElementById('file').files[0].type;

    let profileData = {};
    profileData.uid = uid;
    profileData.avatar = picture;
    profileData.fileType = fileType;
    await updateUserAvatar(profileData)
    // console.log(profileData)
    profileData = {};
  }

</script>

<!-- MODAL UPDATE GENERAL INFO -->
<Modal>
  <div slot="trigger" let:open>
    <Input on:click={open} label="Editar" id="edit-user-info" type="checkbox" className="modal-toggle" icon=""/>
  </div>
  <div slot="header">
    <h1>Editar Información</h1>
  </div>
  <div slot="content">
    <p>
      A continuación, ingresa los datos solicitados
    </p>
    <Input label="Nombre: " id="edit-name-textField" bind:value={userData.name} type="text" className="texField" icon=""/>
    <Input label="Apellido(s): " id="edit-lastName-textField" bind:value={userData.lastName} type="text" className="texField" icon=""/>
    <Input label="Nombre del Negocio: " id="edit-businessName-textField" bind:value={userData.businessName} type="text" className="texField" icon=""/>
    <Input label="Dirección: " id="edit-businessAddress-textField" bind:value={userData.businessAddress} type="text" className="texField" icon=""/>
  </div>
  <div class="modal-buttons" slot="footer" let:store={{close}}>
    <Input on:click={close} label="Cerrar" id="close-modal-button" type="button" className="button" icon=""/>
    <Input on:click={close} on:click={() => handleChangeUserInfo()} label="Guardar" id="save-modal-button" type="button" 
      className="button {
        userData.name != "" && 
        userData.lastName != "" && 
        userData.businessName != "" && 
        userData.businessAddress != "" ? '' : 'disabled'}" 
      icon=""/>
  </div>
</Modal>

<!-- MODAL UPDATE EMAIL -->
<Modal>
  <div slot="trigger" let:open>
    <Input on:click={open} label="Editar" id="edit-email" type="checkbox" className="modal-toggle" icon=""/>
  </div>
  <div slot="header">
    <h1>Editar Correo</h1>
  </div>
  <div slot="content">
    <p>
      A continuación, ingresa los datos solicitados
    </p>
    <Input label="Nuevo Correo: " id="edit-email-textField" bind:value={newEmail} type="email" className="texField" icon=""/>
    <Input label="Contraseña Actual: " id="edit-pass-textField" bind:value={currPassword} type="password" className="texField" icon=""/>
  </div>
  <div class="modal-buttons" slot="footer" let:store={{close}}>
    <Input on:click={close} label="Cerrar" id="close-modal-button" type="button" className="button" icon=""/>
    <Input on:click={close} on:click={() => handleChangeEmail(currPassword, newEmail)} label="Guardar" id="save-modal-button" type="button" 
      className="button
      {
        newEmail.match(emailPattern) && 
        currPassword != "" ? '' : 'disabled'}" 
      icon=""/>
  </div>
</Modal>

<!-- MODAL UPDATE PASSWORD -->
<Modal>
  <div slot="trigger" let:open>
    <Input on:click={open} label="Editar" id="edit-password" type="checkbox" className="modal-toggle" icon=""/>
  </div>
  <div slot="header">
    <h1>Cambiar Contraseña</h1>
  </div>
  <div slot="content">
    <p>
      A continuación, ingresa los datos solicitados
    </p>
    <Input label="Contraseña Actual: " id="edit-pass-curr-textField" bind:value={currPassword} type="password" className="texField" icon=""/>
    <Input label="Contraseña Nueva: " id="edit-pass-new-textField" bind:value={newPass} type="password" className="texField" icon=""/>
    <Input label="Repite Contraseña Nueva: " id="edit-pass-new2-textField" bind:value={repeatPassword} type="password" className="texField" icon=""/>
  </div>
  <div class="modal-buttons" slot="footer" let:store={{close}}>
    <Input on:click={close} label="Cerrar" id="close-modal-button" type="button" className="button" icon=""/>
    <Input on:click={close} on:click={() => handleChangePassword(currPassword, newPass)} label="Guardar" id="save-modal-button" type="button" 
      className="button {
        currPassword != "" &&
        newPass != "" &&
        repeatPassword != "" &&
        newPass == repeatPassword ? '' : 'disabled'
      }" 
      icon=""/>
  </div>
</Modal>

<div class="container">
  {#if $loggedInUser}
    <div class="content">
      <div class="title">
        <h1>Perfil</h1>
      </div>
      <div class="avatar-container">
        <div class="avatar">
          <img class="avatar-img" alt="imagen" src="{$loggedInUser.avatar ? $loggedInUser.avatar : noUser}" />
          <label for="file">
            <input id="file" type="file" on:change={handleUpdateProfilePic} accept="image/jpeg, image/png"/>
            <div class="avatar-content">
              <span class="avatar-icon"><Icons name="camera-fill" width="24" height="24"/></span>
              <span class="avatar-text">Cambiar Foto</span>
            </div>
          </label>
        </div>
      </div>
      <div class="user-name">
        {$loggedInUser.name} {$loggedInUser.lastName}  
      </div>
    </div>
    <div class="display-user-info">
      <!-- <label for="edit-user-info">Editar Información</label> -->
      <div class="user-general-info">
        <span><b>ID de Usuario:</b> {userData.uid}</span>
        <span><b>Nombre del Negocio:</b> {userData.businessName}</span>
        <span><b>Dirección del Negocio:</b> {userData.businessAddress}</span>
        <Input on:click={open} label="Editar" id="edit-user-info" type="checkbox" className="button" icon=""/>
      </div>
      <div>
        <b>Correo:</b> {$loggedInUser.email}
        <Input on:click={open} label="Editar" id="edit-email" type="checkbox" className="button" icon=""/>
      </div>
      <div>
        <b>Contraseña</b>
        <Input on:click={open} label="Editar" id="edit-password" type="checkbox" className="button" icon=""/>
      </div>
    </div>
  {/if}
</div>

<style>
/* ========================================== */
.container {
  width: 100%;
}
.title {
  display: flex;
  justify-content: center;
}
.title h1 {
  font-size: xx-large;
}
.avatar-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: .5rem;
}
.avatar {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #111;
}
.avatar img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
  justify-content: center;
  cursor: pointer;
}
.avatar:hover .avatar-img {
  opacity: .5;
}
.avatar-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity .2s ease-in-out;
}
.avatar:hover .avatar-content {
  opacity: 1;
  cursor: pointer;
}
.avatar-text {
  text-transform: uppercase;
  font-size: 12px;
  width: 50%;
  text-align: center;
  cursor: pointer;
}

.avatar-icon {
  color: white;
}
.avatar input {
  display: none;
}

.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.user-name{
  display: flex;
  justify-content: center;
  font-size: x-large;
  margin-bottom: 2rem;
}
.display-user-info{
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.user-general-info{
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.modal-buttons {
  display:flex;
  flex-direction: row;
}
</style>