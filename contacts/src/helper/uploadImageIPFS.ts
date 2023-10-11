// import { create, Options } from 'ipfs-http-client';
// import { Buffer } from 'buffer';
//
// const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' } as Options);
//
// export const uploadImageIPFS = async (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new window.FileReader();
//
//     reader.onloadend = async () => {
//       const buffer = Buffer.from(reader.result);
//       try {
//         const result = await ipfs.add(buffer);
//         resolve(`https://ipfs.io/ipfs/${result.path}`);
//       } catch (err) {
//         console.error('Failed to upload image to IPFS', err);
//         reject(err);
//       }
//     };
//
//     reader.onerror = () => {
//       reader.abort();
//       console.error('Unexpected error while reading file');
//       reject(new DOMException('Problem parsing input file.'));
//     };
//
//     reader.readAsArrayBuffer(file);
//   });
// };


import { useStorageUpload } from '@thirdweb-dev/react';

export const uploadImageIPFS = async (file: File) => {
  return new Promise((resolve, reject) => {
    try {
      const { mutateAsync: upload } = useStorageUpload();
      const url = async () => await upload({data: [file] });
      resolve(url);
    } catch (err) {
        console.error('Failed to upload image to IPFS', err);
        reject(err);
    }

  })
}