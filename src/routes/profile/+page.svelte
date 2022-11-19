<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { changeEmail, changePassword } from '$lib/hooks/auth.js'
  import { updateUserInfo } from '$lib/hooks/updates.js'
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';

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
    {#if userData.name != "" &&userData.lastName != "" && userData.businessName != "" && userData.businessAddress != ""}
      <Input on:click={close} on:click={() => handleChangeUserInfo()} label="Guardar" id="save-modal-button" type="button" className="button" icon=""/>
    {/if}
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
    {#if newEmail.match(emailPattern) && currPassword != ""}
      <Input on:click={close} on:click={() => handleChangeEmail(currPassword, newEmail)} label="Guardar" id="save-modal-button" type="button" className="button" icon=""/>
    {/if}
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
    {#if currPassword != "" && newPass != "" && repeatPassword != "" && newPass == repeatPassword}
      <Input on:click={close} on:click={() => handleChangePassword(currPassword, newPass)} label="Guardar" id="save-modal-button" type="button" className="button" icon=""/>
    {/if}
  </div>
</Modal>

<div>
  {#if $loggedInUser}
    <div class="content">
      <div class="title">
        <h1>Perfil</h1>
      </div>
      <div class="avatar-container">
        <div class="avatar">
          <img alt="imagen" src="https://api.lorem.space/image/face?hash=33791" />
        </div>
      </div>
      <div class="user-name">
        {$loggedInUser.name} {$loggedInUser.lastName}  
      </div>
    </div>
    <div class="display-user-info">
      <!-- <label for="edit-user-info">Editar Información</label> -->
      <div class="user-general-info">
        <b>ID de Usuario:</b> {userData.uid}
        <b>Nombre del Negocio:</b> {userData.businessName}
        <b>Dirección del Negocio:</b> {userData.businessAddress}
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
  .avatar-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.avatar {
  /* position: relative; */
  display: inline-flex;
  width: 4rem;
  cursor: pointer;
  justify-content: center;
  align-content: center;
}
.avatar img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
  justify-content: center;
}

.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.user-name{
  display: flex;
  justify-content: center;
}

.title{
  display: flex;
  justify-content: center;
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