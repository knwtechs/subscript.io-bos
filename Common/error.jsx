return (
    <div class="row justify-content-center d-flex py-3">
      <div class="col-10 col-md-4 text-center">
        <span class="alert alert-danger">
          <b>Error</b>: {props.message ?? "An error occurred."}
        </span>
      </div>
    </div>
  );
  