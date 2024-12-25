import axios from 'axios';

export const uploadImage = async image => {
  const formData = new FormData();
  formData.append('image', image);

  console.log({ image });

  try {
    const cloudRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return cloudRes.data.data.url;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    // throw error;
  }
};
