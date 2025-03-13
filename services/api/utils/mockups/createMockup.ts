
import template from "./templates/single/default.js";
// import nodeHtmlToImage from "node-html-to-image";
export const createMockup = async (image, backgroundColor) => {
  console.log('entered mockup route')
  const mockUpStart = Date.now()
    const dataUri = `data:image/jpeg;base64,` + image.toString("base64");
    console.log(Date.now() - mockUpStart, ' ms to create data uri')
    // const mockedUp = await nodeHtmlToImage({
    //   html: template,
    //   content: { imageSource: dataUri, backgroundColor },
    // });
    console.log(Date.now() - mockUpStart, ' ms - to generate mockup image')
    // return mockedUp;
  };
  
  
  
  // `<html>
//       <head>
//         <style>
//           body {
//             display: flex; 
//             padding: 3rem; 
            
//             background-color: #3B82F6; 
//             justify-content: center; 
//             align-items: center; 
//   height: 720px;
//     width: 1280px;
  
//           }
//           .margin {
//             margin-left: -20rem; 
//           }
//   .screenshot {
//     object-fit: cover; 
//   width: 60%; 
//   height: 60%; 
//   transform:
//   translate3d(0px, -16px, 0px)
//       rotateX(51deg)
//       rotateZ(43deg);
//     transform-style: preserve-3d;
//     border-radius: 32px;
//     box-shadow:
//       1px 1px 0 1px #f9f9fb,
//       -1px 0 28px 0 rgba(34, 33, 81, 0.01),
//       28px 28px 28px 0 rgba(34, 33, 81, 0.25);
//   }
//         </style>
//       </head>
  
//     <body>
   
//     <img class="screenshot" src="{{imageSource}}" /> <img class="screenshot margin" src="{{imageSource}}" /> </body></html>
    
//     `