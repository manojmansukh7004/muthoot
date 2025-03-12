// import useShowFlashMessage from 'hooks/useShowFlashMessage';
// import RNFetchBlob from 'rn-fetch-blob';

// const DownloadFile = async (url: string, fileName: string) => {
//   console.log("uuuuujjj",url, fileName);
  
//   const { config, fs } = RNFetchBlob;
//   let PictureDir = fs.dirs.PictureDir;
//   const fileExtension = url.split('.').pop()?.toLowerCase() || 'pdf'; // Default to PDF
//   const timestamp = new Date().getTime();
//   const uniqueFileName = `${fileName}_${timestamp}`;
//   const mimeTypes: Record<string, string> = {
//     pdf: "application/pdf",
//     doc: "application/msword",
//     docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   };
//   const mimeType = mimeTypes[fileExtension] ||  "application/pdf"; 

//   let options = {
//     fileCache: true,
//     addAndroidDownloads: {
//       useDownloadManager: true,
//       mime: mimeType,
//       notification: true,
//       path:
//         PictureDir +
//         '/' + uniqueFileName + '.'+fileExtension,
//       description: 'File downloaded',
//     },
//   };

//   console.log("options",options);
  
//   config(options)
//     .fetch('GET', url)
//     .then(res => {
// console.log("reeeee",res);

//       useShowFlashMessage('success', 'File downloaded successfully.');
//     });
        
//   }

// export default DownloadFile;


import { showMessage } from 'react-native-flash-message'; // Flash message library
import RNBlobUtil from 'react-native-blob-util';

const DownloadFile = async (url: string, fileName: string) => {
  try {
    console.log("Downloading File:", url, fileName);

    const { fs, config } = RNBlobUtil;
    const PictureDir = fs.dirs.PictureDir;
    const fileExtension = url.split('.').pop()?.toLowerCase() || 'pdf'; // Default to PDF
    const timestamp = new Date().getTime();
    const uniqueFileName = `${fileName}_${timestamp}.${fileExtension}`;

    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    const mimeType = mimeTypes[fileExtension] || "application/pdf";

    const downloadPath = `${PictureDir}/${uniqueFileName}`;

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: downloadPath,
        description: 'Downloading file...',
        mime: mimeType,
      },
    };

    console.log("Download Options:", options);

    const res = await config(options).fetch('GET', url);

    console.log("Download Response:", res.path());

    showMessage({
      message: "Download Successful",
      description: `File saved at ${res.path()}`,
      type: "success",
    });

  } catch (error) {
    console.error("Download Error:", error);

    showMessage({
      message: "Download Failed",
      description: "Something went wrong. Please try again.",
      type: "danger",
    });
  }
};

export default DownloadFile;
