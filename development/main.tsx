import React from 'react'
import ReactDOM from 'react-dom/client'
import { ImageRevealSlider } from '../src/Components/ImageRevealSlider/ImageRevealSlider'


const content = [
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01K740QZCY7R9HD9KTMB6XGPJ4.jpeg",
      "name": "Slider-1.jpeg"
    },
    "link": "https://app.slack.com/client/TV38ZDJ2F/D08AGG2DWSG"
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01K740S36970GH347RCZ8GW6QF.jpeg",
      "name": "Slider-2.jpeg"
    }
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01K740RZ7VG1PWA7CRMR6TW0QS.jpeg",
      "name": "Slider-3.jpeg"
    }
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01K740RV2XQMBWM2RZABY6AP9N.jpeg",
      "name": "Slider-4.jpeg"
    }
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01K740RQ4E62FG7Y92J4AP8T0A.jpeg",
      "name": "Slider-5.jpeg"
    }
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01K740RE073FS2HZX8AVP3MCR7.jpeg",
      "name": "Slider-6.jpeg"
    }
  },
  {
    "image": {
      "objectFit": "cover",
      "url": "https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01K740R841W216BPQR07XZN8G4.jpeg",
      "name": "Slider-7.jpeg"
    }
  },
];

const settings = {
  "imageSize": {
    "sizeType": "custom", // 'custom' 'as Is'
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
