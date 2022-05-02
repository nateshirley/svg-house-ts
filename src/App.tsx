import React from 'react';
import './App.css';
import { base64EncodedSvg } from './svgBuilder';
import { Buffer } from 'buffer';

function App() {

  let encodedSvg = base64EncodedSvg("steeze", 5, 9980, "https://i.imgur.com/eZPLAdc.jpeg");
  let encodedField = "data:image/svg+xml;base64," + encodedSvg;
  console.log(encodedSvg);
  let rawHtml = Buffer.from(encodedSvg, "base64").toString();
  console.log(rawHtml);

  return (
    <div className="App">
      <div>
        <br />
        as img (more common)
        <br />
        <img src={`data:image/svg+xml;base64,${encodedSvg}`} alt="shit" />
      </div>
      <div>
        <br />
        as html
        <br />
        <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
      </div>
    </div>
  );
}

export default App;
