<script>
  import Avatar from "$lib/assets/no_user.png";
  import { getPastRelativeTime } from "$lib/utils/date";

  /* props */
  export let color = "green";
  export let description = "";
  export let date;
</script>

<div class="comment-container">
  <div class="comment-divider" style="--divider-color: {color};">
    <div class="comment">
      <div class="comment-header">
        <div class="comment-avatar">
          <img src={Avatar} alt="avatar" />
        </div>
        <div class="comment-info">
          <p class="comment-user">Dan Rojas</p>
          <small class="comment-role"><span class="role-prefix">#</span>1254789</small>
        </div>
        <small class="comment-time__header">{getPastRelativeTime(date)}</small>
      </div>
      <div class="comment-body">
        <p>{description}</p>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .comment-container {
    &:first-child .comment-divider {
      padding-top: 8px;
    }
    &:not(:first-child) .comment-divider {
      padding-top: 20px;
    }
  }
  .comment-avatar {
    width: 40px;
    height: 40px;
    img {
      width: inherit;
      height: inherit;
      object-fit: cover;
    }
  }

  .comment-header {
    display: grid;
    grid-template-columns: 40px 1fr 1fr;
    align-items: center;
    gap: 8px;
  }

  .comment-time__header {
    text-align: right;
  }

  .comment-divider {
    margin-left: 18px;
    padding-left: 20px;
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: var(--divider-color);
  }

  .comment-user {
    font-weight: 600;
    font-size: 12px;
  }

  .comment-role {
    font-size: 10px;
    font-weight: 300;
    color: $grey;
  }

  .role-prefix {
    margin-right: 2px;
    user-select: none;
  }

  .comment-body {
    margin-top: 8px;
  }

  /* Dark Mode */
  :global(body.dark-mode) {
    .comment-time__header,
    .comment-user,
    .comment-body {
      color: $font-dark-primary;
    }
  }
</style>
