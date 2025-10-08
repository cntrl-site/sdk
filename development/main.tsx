import React from 'react'
import ReactDOM from 'react-dom/client'
import { ImageRevealSlider } from '../src/Components/ImageRevealSlider/ImageRevealSlider'


const content = [
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01GJ2SMPPCQ7JSNGVXZ2DHWXWF/articles-assets/01JRZ15T247392621FNTTRCW9D.jpeg",
      "name": "Slider-1.jpeg"
    }
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01GJ2SMPPCQ7JSNGVXZ2DHWXWF/articles-assets/01JRZ17S8TS9T62P7NKTNNEB64.jpeg",
      "name": "Slider-2.jpeg"
    }
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01GJ2SMPPCQ7JSNGVXZ2DHWXWF/articles-assets/01JRZ197S89RNT6RA7ZJSX3Z38.jpeg",
      "name": "Slider-3.jpeg"
    }
  }
];

const settings = {
  "imageSize": {
    "sizeType": "as Is",
    "imageWidth": 500,
    "randomRangeImageWidth": {
      "min": 100,
      "max": 1000
    }
  },
  "cursor": {
    "cursorType": "system",
    "defaultCursor": null,
    "hoverCursor": null
  },
  "position": {
    "revealPosition": "random",
    "visible": "all",
    "target": "area"
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ width: '700px', height: '400px', position: 'relative'}}>
      <ImageRevealSlider content={content} settings={settings}/>
    </div>
  </React.StrictMode>
)
