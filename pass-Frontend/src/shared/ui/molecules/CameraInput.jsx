import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

const dataURLtoBlob = (dataUrl) => {
  try {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (error) {
    console.error("Failed to convert dataURL to Blob", error);
    return null;
  }
};

export const CameraInput = forwardRef(
  ({ onCapture, width = "300px", height = "200px" }, ref) => {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [capturedBlob, setCapturedBlob] = useState(null);

    // Expose logic to the main page
    useImperativeHandle(ref, () => ({
      takePhoto: () => {
        return new Promise((resolve) => {
          if (capturedBlob) {
            resolve(capturedBlob);
            return;
          }
          if (capturedImage) {
            const blob = dataURLtoBlob(capturedImage);
            resolve(blob);
            return;
          }
          if (!videoRef.current) {
            resolve(null);
            return;
          }
          const canvas = document.createElement("canvas");
          const videoWidth = videoRef.current.videoWidth || 640;
          const videoHeight = videoRef.current.videoHeight || 480;
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
            setCapturedImage(dataUrl);
            canvas.toBlob(
              (blob) => {
                setCapturedBlob(blob);
                if (onCapture) onCapture(blob);
                resolve(blob);
              },
              "image/jpeg",
              0.95
            );
          } else {
            resolve(null);
          }
        });
      },
      resetCamera: () => {
        setCapturedImage(null);
        setCapturedBlob(null);
      },
    }));

    useEffect(() => {
      // Start stream only if no image is captured yet
      if (!capturedImage) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "user" } })
          .then((stream) => {
            if (videoRef.current) videoRef.current.srcObject = stream;
          })
          .catch((err) => console.error("Camera access denied", err));
      }
      // Cleanup: stop tracks when component unmounts
      return () => {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject;
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [capturedImage]);

    return (
      <div
        className="relative overflow-hidden border border-slate-300 rounded-lg bg-black"
        style={{ width, height }}
      >
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay={true}
            playsInline={true}
            muted={true}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  },
);
