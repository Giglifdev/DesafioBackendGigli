const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  console.log("Before the fetch call");
  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 201) {
        console.log("Redirecting to /login");
        window.location.replace("/login");
      } else {
        console.log("Error Server:", result.status);
      }
    })
    .catch((error) => {
      console.error("Error  fetch:", error);
    });
});
