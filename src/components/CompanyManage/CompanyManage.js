import React, { useEffect, useState } from "react";
import ManageEdit from "./components/ManageEdit";
import axios from "axios";
import CompanyManageView from "./components/CompanyManageView";
import { Box, Button } from "@mui/material";
import CompanyCreateNew from "./components/CompanyCreateForm";
import CompanyCreateForm from "./components/CompanyCreateForm";
import CompnayManageEdit from "./components/CompnayManageEdit";
import Cookies from "js-cookie"; // Import Cookies

const CompanyManage = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [displayPage, setDisplayPage] = useState(1);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const displayPageFn = (page) => {
    setDisplayPage(page);
    console.log(page);
  };

  const handleEditClick = () => setIsEditable(true);
  const handleSaveClick = () => setIsEditable(false);
  const handleCancelClick = () => setIsEditable(false);
  useEffect(() => {
    // Fetch the company data from the API
    axios
      .get(`${process.env.REACT_APP_URL}/api/getCompany`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      })
      .then((response) => {
        setCompanyData(response.data.data.reverse());
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);
  return (
    <>
      {displayPage == 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            onClick={() => displayPageFn(2)}
            variant="contained"
            // sx={{ "&:hover": { bgcolor: "#1b5e20" } }}
          >
            Add Company
          </Button>
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        {displayPage == 1 &&
          companyData.map((item, index) => (
            <CompanyManageView
              key={index}
              companyData={item}
              onEdit={handleEditClick}
              displayPageFn={displayPageFn}
              index={index}
            />
          ))}
      </Box>

      {displayPage == 2 && <CompanyCreateForm displayPageFn={displayPageFn} />}

      {displayPage == 3 && (
        <CompnayManageEdit
          data={companyData}
          displayPageFn={displayPageFn}
          // onSave={handleSaveClick}
          // onCancel={handleCancelClick}
        />
      )}

      {![1, 2, 3].includes(displayPage) && <p>abc</p>}
    </>
  );
};

export default CompanyManage;
