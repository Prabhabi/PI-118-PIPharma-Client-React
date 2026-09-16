import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

const Test1 = () => {
  const contentRef = useRef();
  const [imageDataUrl, setImageDataUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl =
        "http://103.225.70.39:20250/storage/product_images/2345620250122Image3.png";
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUrl(reader.result);
      };
      reader.readAsDataURL(blob);
    };

    fetchImage();
  }, []);

  const handleGeneratePdf = () => {
    if (!imageDataUrl) return;

    const element = contentRef.current;
    const options = {
      margin: 10,
      filename: "product-image.pdf",
      html2canvas: { scale: 2 }, // Higher scale for better quality
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div>
      <div ref={contentRef} style={{ textAlign: "center", padding: "20px" }}>
        <h1>Product Image</h1>
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt="Product"
            style={{ maxWidth: "100%", height: "auto", width: "500px" }}
          />
        ) : (
          <p>Loading image...</p>
        )}
      </div>
      <button onClick={handleGeneratePdf} style={{ marginTop: "20px" }}>
        Generate PDF
      </button>
      <p>
        imga url is-
        http://103.225.70.39:20250/storage/product_images/2345620250122Image3.png
      </p>
    </div>
  );
};

export default Test1;
