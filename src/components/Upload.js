import axios from "axios";
import { useState, useEffect } from "react";

function Upload() {
  const [payloadImages, setPayloadImages] = useState(null);
  const [imageData, setImageData] = useState([]);
  const [personCount, setPersonCount] = useState(1);

  const getFile = (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = e.target.files;
    console.log(personCount);
    formData.append("person_count", personCount); // JSON 형식이 아닌 FormData에 직접 추가
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    console.log(formData);
    console.log(files);
    setPayloadImages(formData);
  };

  const handlePersonCount = (e) => {
    e.preventDefault();
    setPersonCount(e.target.value);

    if (payloadImages) {
      console.log("e.target.value", e.target.value);
      console.log("payloadImages", payloadImages);
      const newFormData = new FormData();
      const existingFiles = payloadImages.getAll("files");

      newFormData.append("person_count", e.target.value || 1);
      for (const file of existingFiles) {
        newFormData.append("files", file);
      }

      //   setPersonCount(e.target.value);
      setPayloadImages(newFormData); //
    }
  };

  const requestImages = async () => {
    if (!personCount || !payloadImages) {
      alert("Please insert images and person count");
      return;
    }
    // const payload = {
    //   person_count: 3,
    //   files: payloadImages,
    // };
    const response = await axios.post(
      "http://127.0.0.1:8000/postingImages",
      payloadImages,
      {
        headers: {
          "Content-Type": "multipart/form-data", // 요청 헤더 설정
        },
      }
    );
    console.log(response);
    setImageData([...response.data]);
  };

  useEffect(() => {
    console.log(imageData);
  }, [imageData]);

  return (
    <>
      <input
        type="number"
        defaultValue={personCount}
        placeholder="분류할 사람 수를 입력해주세요"
        onChange={handlePersonCount}
      />
      <input type="file" multiple onChange={getFile} />
      <button onClick={requestImages}>파일 요청하기</button>

      <div
        style={{
          border: "1px solid red",
          width: "1000px",
          minHeight: "500px",
        }}
      >
        {imageData.map((imageArray, index) => {
          return (
            <div
              key={`image-array-${index}`}
              style={{
                display: "flex",
              }}
            >
              {imageArray.map((image, index) => (
                <div key={`image-${index}`}>
                  <img src={`http://127.0.0.1:8000/static/${image}`} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Upload;
