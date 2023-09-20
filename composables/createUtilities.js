import { useToast } from 'vuestic-ui';

export const useCreateUtilities = () => {
  const { init } = useToast();

  async function uploadToCloudinary(file) {
    try {
      if (file.size >= 1024000) {
        throw new Error('File should be less than 1MB');
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'sitmp7vs');
      formData.append('folder', 'rexapp');
  
      const response = await fetch('https://api.cloudinary.com/v1_1/dsgvwxygr/image/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      return data.secure_url;
    } catch (error) {
      init({message: error, color: "danger"})
      console.error(error)
      return;
    }
  }

  return {
    uploadToCloudinary
  }
}