import { useState, useEffect } from "react";
import { uploadService } from "../services/upload.service";

export function ImgUploader({ onUploaded = null }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  });
  const [isUploading, setIsUploading] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const emptyImg = 'https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg'

  useEffect(()=>{
    if(!imgData.imgUrl)
      setImgData(prev=>({...prev, imgUrl: emptyImg})) 
      triggerPictureAnimation()
  },[imgData])


  async function uploadImg(ev) {
    setIsMoving(true)
  
    setTimeout(async () => {
      setIsUploading(true)
      const { secure_url, height, width } = await uploadService.uploadImg(ev)
      setImgData({ imgUrl: secure_url, width, height })
      setIsUploading(false)
  
      setTimeout(() => {
        setIsMoving(false)
      }, 250)
    }, 250)
  }

  function triggerPictureAnimation() {
    setIsMoving(true)
    setTimeout(() => {
      setIsMoving(false)
    }, 1000)
  }

  return (
    <section className="image-uploader">
      {imgData.imgUrl && (
        <img className={`profile-picture ${isMoving ? "move" : ""}`} 
        src={imgData.imgUrl}/>
      )}
      <input
        type="file"
        onChange={uploadImg}
        accept="img/*"
        id="imgUpload"
        className="input-file"
      />
    </section>
  );
}
