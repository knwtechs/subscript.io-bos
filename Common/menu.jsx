const USER = "4ac12ee4ebd5536d7b130a9c5f8eebb1136145312c9e523289bf346268aeebfd";
return (
  <div class="navbar navbar-dark navbar-expand-lg bg-dark px-3">
    <a
      class="navbar-brand text-white"
      style={{ fontWeight: 700, textTransform: "uppercase" }}
    >
      <img
        src="https://www.knwtechs.com/_next/static/media/knw.39a87d22.png"
        width="40"
        height="40"
        class="d-inline-block align-top"
        alt="KNW Technologies FZCO"
      />
      {APP_TITLE}
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a
            class="nav-link text-light text-capitalize"
            style={{ fontWeight: 700 }}
            href={`#/${USER}/widget/Main.create`}
          >
            Create
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-light text-capitalize"
            style={{ fontWeight: 700 }}
            href={`#/${USER}/widget/Main.manage`}
          >
            Manage
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-white"
            style={{ fontWeight: 700 }}
            href={`#/${USER}/widget/Main.view`}
            tabindex="-1"
          >
            View
          </a>
        </li>
      </ul>
    </div>
    <div
      class="d-flex justify-content-between align-items-center"
      style={{ minWidth: "18vw" }}
    >
      {props.balance && <a class="nav-link text-white">{props.balance} Ξ</a>}
      <Web3Connect connectLabel="Connect with Web3" />
    </div>
  </div>
);
