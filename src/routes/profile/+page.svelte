<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { changeEmail, changePassword } from '$lib/hooks/auth.js'
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let userData = {
    id: $loggedInUser?.uid,
    name: $loggedInUser?.name,
    lastName: $loggedInUser?.lastName,
    businessName: "",
    email: $loggedInUser?.email,
  }

  let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  let currPassword ="", newPass = "", newEmail = "", repeatPassword = "";

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
      <div>

      </div>
      <div>
        <b>Correo:</b> {$loggedInUser.email}
        <Modal>
          <div slot="trigger" let:open>
            <Input on:click={open} label="Editar" id="edit-email" type="button" className="button" icon=""/>
          </div>
          <div slot="header">
            <h1>Editar Correo</h1>
          </div>
          <div slot="content">
            <p>
              A continuación, ingresa tu nueva direción de correo electrónico y 
              tu actual contraseña en los campos correspondientes
            </p>
            <Input label="Correo: " id="edit-email-text-field" bind:value={newEmail} type="email" className="texField" icon=""/>
            <Input label="Contraseña: " id="edit-pass-text-field" bind:value={currPassword} type="password" className="texField" icon=""/>
          </div>
          <div class="modal-buttons" slot="footer" let:store={{close}}>
            <Input on:click={close} label="Cerrar" id="close-modal-button" type="button" className="button" icon=""/>
            {#if newEmail.match(emailPattern) && currPassword != ""}
              <Input on:click={close} on:click={() => handleChangeEmail(currPassword, newEmail)} label="Guardar" id="save-modal-button" type="button" className="button" icon=""/>
            {/if}
          </div>
        </Modal>
      </div>
      <div>
        <b>Contraseña</b>
        <Modal>
          <div slot="trigger" let:open>
            <Input on:click={open} label="Editar" id="edit-password" type="button" className="button" icon=""/>
          </div>
          <div slot="header">
            <h1>Cambiar Contraseña</h1>
          </div>
          <div slot="content">
            <p>
              A continuación, ingresa los campos requeridos
            </p>
            <Input label="Contraseña Actual: " id="edit-pass-curr-text-field" bind:value={currPassword} type="password" className="texField" icon=""/>
            <Input label="Contraseña Nueva: " id="edit-pass-new-text-field" bind:value={newPass} type="password" className="texField" icon=""/>
            <Input label="Repite Contraseña Nueva: " id="edit-pass-new2-text-field" bind:value={repeatPassword} type="password" className="texField" icon=""/>
          </div>
          <div class="modal-buttons" slot="footer" let:store={{close}}>
            <Input on:click={close} label="Cerrar" id="close-modal-button" type="button" className="button" icon=""/>
            {#if currPassword != "" && newPass != "" && repeatPassword != "" && newPass == repeatPassword}
              <Input on:click={close} on:click={() => handleChangePassword(currPassword, newPass)} label="Guardar" id="save-modal-button" type="button" className="button" icon=""/>
            {/if}
          </div>
        </Modal>
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
  position: relative;
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
  justify-content: left;
  flex-direction: column;
}

.modal-buttons {
  display:flex;
  flex-direction: row;
}
</style>