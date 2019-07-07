const serverUrl = process.env.REACT_APP_SERVER;

const api = ({
  method,
  url,
  body,
  headers = "application/json",
  contentType = "text",
}) => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    fetch(`${serverUrl}${url}`, {
      method,
      headers: {
        ...(contentType === "text" ? { "Content-Type": headers } : {}),
        ...(token ? { token } : {}),
      },
      ...(body
        ? contentType === "text"
          ? { body: JSON.stringify(body) }
          : { body }
        : {}),
    }).then(response => {
      response.json().then(res => {
        return response.ok ? resolve(res) : reject(res);
      });
    });
  });
};

export default api;
