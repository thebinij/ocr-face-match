import Tesseract from "tesseract.js";
import { useRef, useState } from "react";

function OCR() {
  const imageRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [result, setResult] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      // Set the selected image to the corresponding img element
      if (event.target.name === "image-card") {
        imageRef.current.src = e.target.result;
      }
    };

    reader.readAsDataURL(file);
  };

  // const handleScanImagePublic = async () => {
  //   try {
  //     if (!imageFile) {
  //       throw new Error("No image file selected.");
  //     }
  //     const formData = new FormData();
  //     formData.append("image", imageFile);

  //     setIsLoading(true);
  //     const response = await fetch(" http://127.0.0.1:5000/ocr", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error("An error occurred while processing the image.");
  //     }

  //     const data = await response.json();
  //     setResult(JSON.stringify(data))
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleScanImage = () => {
    const img = imageRef.current;
    if (img.complete) {
      setIsLoading(true);
      Tesseract.recognize(img.src, "eng+jpn")
        .then(({ data: { text } }) => {
          // Split text into lines
          const lines = text.split(/\r?\n/);
          let name = lines[1].trim();
          name = name.replace(/^\.\s*/, "").replace(/\s*\.$/, "");

          // Extract date of birth from line 4
          const dobRegex = /\d{8}/;
          const dobMatch = lines[3].match(dobRegex);
          const dateOfBirth = dobMatch ? dobMatch[0] : "";

          // Extract gender from line 4
          const genderRegex = /(M|F)\./;
          const genderMatch = lines[3].match(genderRegex);
          const gender = genderMatch ? genderMatch[1] : "";

          // Create result object
          const scan_result = {
            name,
            date: dateOfBirth,
            gender,
          };
          console.log(scan_result);
          setResult(lines);

          // Print each line
          // lines.forEach((line, index) => {
          //   console.log(`Line ${index + 1}: ${line}`);
          // });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <div>
      <h2>OCR Page</h2>

      <div className="image-container">
        <input
          type="file"
          name="image-card"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        <img src={imageFile} ref={imageRef} alt="image" height="400" />
      </div>
      {isLoading ? "Loading...." : null}
      {/* <button
        disabled={isLoading}
        style={{ marginTop: "1rem" }}
        onClick={handleScanImagePublic}
      >
        Fetch Json
      </button> */}

      <button
        disabled={isLoading}
        style={{ marginTop: "1rem" }}
        onClick={handleScanImage}
      >
        Get all Text 
      </button>
      {result ? (
        <div style={{ maxWidth: "600px", marginTop: "1rem" }}>
          <span>{result}</span>{" "}
        </div>
      ) : null}
    </div>
  );
}

export default OCR;
