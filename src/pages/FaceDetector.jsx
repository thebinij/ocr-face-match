import { useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceDetector() {
  const [idCardImage, setIdCardImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const idCardRef = useRef();
  const selfieRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [matched, setMatched] = useState("");

  function handleFileChange(event, imageType) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const image = e.target.result;

      if (imageType === "idCard") {
        setIdCardImage(image);
      } else if (imageType === "selfie") {
        setSelfieImage(image);
      }
    };

    reader.readAsDataURL(file);
  }

  const handleFaceDetection = async () => {
    try {
      setIsLoading(true);
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      // detect a single face from the ID card image
      const idCardFacedetection = await faceapi
        .detectSingleFace(
          idCardRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      // detect a single face from the selfie image
      const selfieFacedetection = await faceapi
        .detectSingleFace(
          selfieRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      //(OPTIONAL)
      /**
       * If a face was detected from the ID card image,
       * call our renderFace() method to display the detected face.
       */
      if (idCardFacedetection) {
        const { x, y, width, height } = idCardFacedetection.detection.box;
        renderFace(idCardRef.current, x, y, width, height);
      }
      //(OPTIONAL)
      /**
       * If a face was detected from the selfie image,
       * call our renderFace() method to display the detected face.
       */
      if (selfieFacedetection) {
        const { x, y, width, height } = selfieFacedetection.detection.box;
        renderFace(selfieRef.current, x, y, width, height);
      }
      let distance = 1;
      /**
       * Do face comparison only when faces were detected
       */
      if (idCardFacedetection && selfieFacedetection) {
        // Using Euclidean distance to comapare face descriptions
        distance = faceapi.euclideanDistance(
          idCardFacedetection.descriptor,
          selfieFacedetection.descriptor
        );
      }
      console.log(distance)
      if (distance < 0.35) {
        setMatched(`Fully Matched (${distance})`);
      } else if (distance <= 0.5) {
        setMatched(`Slightly Matched (${distance})`);
      } else {
        setMatched(`No Matched (${distance})`);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFace = async (image, x, y, width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    context?.drawImage(image, x, y, width, height, 0, 0, width, height);
    canvas.toBlob((blob) => {
      image.src = URL.createObjectURL(blob);
    }, "image/jpeg");
  };

  return (
    <>
      <div className="gallery">
        <div className="image-container">
          <input
            type="file"
            name="idCard"
            accept=".jpg,.jpeg,.png"
            onChange={(event) => handleFileChange(event, "idCard")}
          />
          <img src={idCardImage} ref={idCardRef} alt="ID card" height="400" />
        </div>
        <div className="image-container">
          <input
            type="file"
            name="selfie"
            accept=".jpg,.jpeg,.png"
            onChange={(event) => handleFileChange(event, "selfie")}
          />
          <img src={selfieImage} ref={selfieRef} alt="Selfie" height="400" />
        </div>
      </div>

      <button disabled={isLoading || matched} onClick={handleFaceDetection}>
        Calculate
      </button>

      {matched ? (
        <button
          disabled={isLoading}
          onClick={() => {
            setIdCardImage(null);
            setSelfieImage(null);
            setMatched("");
            document.getElementsByName("idCard")[0].value = "";
            document.getElementsByName("selfie")[0].value = "";
          }}
        >
          Clear
        </button>
      ) : null}

      <div className="result">
        <p>Result: {matched}</p>
      </div>
    </>
  );
}
export default FaceDetector;
