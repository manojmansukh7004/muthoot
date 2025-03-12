import { ImagePickerResponse, launchCamera } from "react-native-image-picker";
import ImagePicker from 'react-native-image-crop-picker';
import Colors from 'config/Colors';

const CaptureImage = (): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
  
    ImagePicker.openCamera({
     
      cropping: true,
      cropperStatusBarColor: Colors.Primary,
      cropperToolbarColor: Colors.Primary,
      cropperToolbarWidgetColor: Colors.White,
      cropperActiveWidgetColor: Colors.Primary,
      hideBottomControls: true,
      freeStyleCropEnabled: true,

    }).then(image => {
      console.log(image.path);
      if (image) {
        resolve(image.path);
       
      }
    }).catch(e => {
      console.log("mjjjjjjj");
      
      console.log(e);
    })
  });
};


export default CaptureImage;