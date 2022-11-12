<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
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
        <b>ID:</b> {$loggedInUser.uid}
      </div>
      <div>
        <b>Correo:</b> {$loggedInUser.email}
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
</style>