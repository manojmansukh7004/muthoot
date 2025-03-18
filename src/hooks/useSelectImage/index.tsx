// import DocumentPicker from '@react-native-documents/picker';
// import useShowFlashMessage from 'hooks/useShowFlashMessage';
// import { Dispatch, SetStateAction } from 'react';
// import ImagePicker from 'react-native-image-crop-picker';
// import Colors from 'config/Colors';

// type SelectImageType = (
//   callback: any,
//   flow: string,
//   setDeselected: Dispatch<SetStateAction<'upload' | 'capture' | null>>,
//   ResetImage?: () => void,
// ) => Promise<void>;

// const useSelectImage: SelectImageType = async (
//   callback: any,
//   flow: string,
//   setDeselected: Dispatch<SetStateAction<'upload' | 'capture' | null>>,
//   ResetImage,
// ) => {

//   const bytesToMegaBytes = (bytesData: any) => {
//     const sizeInMB = (bytesData ? bytesData / (1024 * 1024) : 0).toFixed(2);
//     return sizeInMB;
//   };

//   const CreateZipFile = (results: any, frontPath: any) => {
//     console.log("CreateZipFile", results);

//     let imgname = results[0].name.split('.');

//     return callback(results, imgname);
//   };
//   console.log("useeselect pdffffff", flow);

//   try {
//     const results = await DocumentPicker.pick({
//       copyTo: 'documentDirectory',
//       type: 
//        flow === 'onlypickimage' ? [DocumentPicker.types.images] : flow === 'pdf' ? [DocumentPicker.types.pdf] : flow === 'all' ? [DocumentPicker.types.pdf, DocumentPicker.types.images]: 
//       [ DocumentPicker.types.images, DocumentPicker.types.pdf,],
//       allowMultiSelection: false,
//     });
//     const ImageSize: number = parseInt(bytesToMegaBytes(results[0]?.size));

// console.log("useeselect immmmmmm",results);


//     if (results[0]?.type?.split('/')?.pop() == 'pdf' && ImageSize >= 10) {

//       useShowFlashMessage(
//         'warning',
//         `File size should be a maximum of 10 MB`, 1500
//       );
//       if (ResetImage) {
//         ResetImage();
//       }
//     }
//     else if (results[0]?.type?.split('/')?.pop() !== 'pdf' && ImageSize > 3) {
//       console.log("ImageSize");
//       useShowFlashMessage(
//         'warning',
//         `File size should be a maximum of 3 MB`,
//         1500,
//       );
//       if (ResetImage) {
//         ResetImage();
//       }
//     }
//     else {
//       console.log("elllll");
      
//       if (flow === 'onlypickimage' || flow === 'allDocument' || flow === 'pdf') {

//         if (results[0]?.type?.split('/')?.pop() == 'pdf') {
//           CreateZipFile(results, results[0].fileCopyUri)
//         }
//         else {
//           ImagePicker.openCropper({
//             path: results[0].fileCopyUri || '',
//             // width: 100,
//             // height: 200,
//             freeStyleCropEnabled: true,
//             cropperStatusBarColor: Colors.Primary,
//             cropperToolbarColor: Colors.Primary,
//             cropperToolbarWidgetColor: Colors.White,
//             cropperActiveWidgetColor: Colors.Primary,
//             hideBottomControls: true,
//             mediaType: 'photo'
//           }).then(image => {

//             // console.log("iiiiiii", image);

//             var temp = [image]
//             image['fileCopyUri'] = image.path,
//               image['type'] = results[0].type,
//               image['name'] = results[0].name,

//               CreateZipFile(temp, results[0].fileCopyUri);

//           });
//         }
//       }
//     }
//   } catch (err) {
//     if (DocumentPicker.isCancel(err)) {
//       setDeselected(null);
//       console.log("kkkkkk", err);
//     } else {
//       throw err;
//     }
//   }
// };
// export default useSelectImage;

import DocumentPicker from 'react-native-document-picker';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import { Dispatch, SetStateAction } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Colors from 'config/Colors';

type SelectImageType = (
  callback: (result: any, name: string[]) => void,
  flow: string,
  setDeselected: Dispatch<SetStateAction<'upload' | 'capture' | null>>,
  ResetImage?: () => void,
) => Promise<void>;

const useSelectImage: SelectImageType = async (callback, flow, setDeselected, ResetImage) => {
  
  const bytesToMegaBytes = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

  const CreateZipFile = (results: any) => {
    console.log("CreateZipFile", results);
    let imgName = results[0].name.split('.');
    return callback(results, imgName);
  };

  console.log("Flow Type:", flow);

  try {
    const results = await DocumentPicker.pickSingle({
      type:
        flow === 'onlypickimage' ? [DocumentPicker.types.images] :
        flow === 'pdf' ? [DocumentPicker.types.pdf] :
        flow === 'all' ? [DocumentPicker.types.pdf, DocumentPicker.types.images] :
        [DocumentPicker.types.images, DocumentPicker.types.pdf],
    });

    console.log("Picked File:", results);

    const fileSizeMB = parseFloat(bytesToMegaBytes(results.size || 0));
    const fileType = results.type?.split('/').pop();

    if (fileType === 'pdf' && fileSizeMB >= 10) {
      useShowFlashMessage('warning', 'File size should be a maximum of 10 MB', 1500);
      if (ResetImage) ResetImage();
    } 
    else if (fileType !== 'pdf' && fileSizeMB > 3) {
      useShowFlashMessage('warning', 'File size should be a maximum of 3 MB', 1500);
      if (ResetImage) ResetImage();
    } 
    else {
      if (flow === 'onlypickimage' || flow === 'allDocument' || flow === 'pdf') {
        if (fileType === 'pdf') {
          CreateZipFile([results]);
        } else {
          ImagePicker.openCropper({
            path: results.uri, // Use `uri` instead of `fileCopyUri`
            freeStyleCropEnabled: true,
            cropperStatusBarColor: Colors.Primary,
            cropperToolbarColor: Colors.Primary,
            cropperToolbarWidgetColor: Colors.White,
            cropperActiveWidgetColor: Colors.Primary,
            hideBottomControls: true,
            mediaType: 'photo',
          }).then(image => {
            const croppedImage = {
              ...image,
              uri: image.path,
              type: results.type,
              name: results.name,
            };
            CreateZipFile([croppedImage]);
          });
        }
      }
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log("File selection cancelled", err);
      setDeselected(null);
    } else {
      console.error("Error picking file:", err);
      throw err;
    }
  }
};

export default useSelectImage;
