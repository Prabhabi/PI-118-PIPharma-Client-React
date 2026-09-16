import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Help() {
  const [url, setUrl] = useState("");
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const handleSubmit = async () => {
    try {
      const token = Cookies.get("token");
      const sanctumToken = `Bearer ${token?.replace(/"/g, "")}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: sanctumToken,
        },
      });

      console.log("Fetched data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>main color: #0078cf</h1>
      <h1>drawer color: #7fbbe7</h1>
      <h1>endpoint: {process.env.REACT_APP_URL}</h1>

      <p>sanctumToken : {sanctumToken}</p>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "500px", padding: "8px", marginRight: "10px" }}
        />
        <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
          Submit
        </button>
      </div>
    </div>
  );
}
