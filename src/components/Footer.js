import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Pinterest,
  Instagram,
  WhatsApp,
  Phone,
} from "@mui/icons-material";

const Footer = () => {
  const menuItems = ["Home", "About Us", "Products", "Contact"];
  const usefulLinks = ["FAQ", "Community", "Gallery"];
  const contactInfo = [
    "Agartala, Tripura",
    "1234567890",
    "official millan.office@gmail.com",
    "Help/queary: help.millan@gmail.com",
  ];
  const socialIcons = [Facebook, Twitter, LinkedIn, Pinterest, Instagram, WhatsApp, Phone];

  return (
    <Box component="footer" sx={{ backgroundColor: "#122", color: "white", py: 1.5 }}>
      <Grid container spacing={1} justifyContent="center">
        {/* Company Info */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Millan__</Typography>
          <Divider sx={{ my: 0.3, borderColor: "gray" }} />
          <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
            Millan is Tripura's best choice for classic home and bathroom appliances.
          </Typography>
        </Grid>

        {/* Navigation Links */}
        {[{ title: "Menu__", items: menuItems }, { title: "Useful Links__", items: usefulLinks }].map(({ title, items }, idx) => (
          <Grid key={idx} item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>{title}</Typography>
            <Divider sx={{ my: 0.3, borderColor: "gray" }} />
            {items.map((item, i) => (
              <Typography key={i} variant="body2" component="a" href="#" sx={{ display: "block", color: "#9b59b6", mt: 0.3, fontSize: "0.65rem" }}>
                {item}
              </Typography>
            ))}
          </Grid>
        ))}

        {/* Contact Info */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Contact__</Typography>
          <Divider sx={{ my: 0.3, borderColor: "gray" }} />
          {contactInfo.map((info, idx) => (
            <Typography key={idx} variant="body2" sx={{ mt: idx === 0 ? 1 : 0.3, fontSize: "0.65rem" }}>
              {info}
            </Typography>
          ))}
        </Grid>
      </Grid>
      
      {/* Social Media Icons */}
      <Box sx={{ textAlign: "center", mt: 1.5 }}>
        {socialIcons.map((Icon, idx) => (
          <IconButton key={idx} sx={{ color: "white", mx: 0.3, fontSize: "1rem" }}>
            <Icon />
          </IconButton>
        ))}
      </Box>

      {/* Footer Bottom */}
      <Typography variant="body2" sx={{ textAlign: "center", mt: 1.5, color: "gray", fontSize: "0.55rem" }}>
        © 2024 All rights reserved. ~ By Prababhi Infocom
      </Typography>
    </Box>
  );
};

export default Footer;
