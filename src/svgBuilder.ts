import { Buffer } from 'buffer';

export interface Earth {
  orbitRadius: number;
  bodyRadius: number;
  coordinates: Coordinates;
}
export interface Coordinates {
  centerX: number;
  centerY: number;
}

const squareDimension = 348;
const squareCenter = squareDimension / 2;

const gradients = (earth: Earth) => {
  const earthTranslateX = earth.coordinates.centerX - 4;
  const earthTranslateY = earth.coordinates.centerY - 4;
  return `
    <g>
      <linearGradient id="background_gradient" x1="286" y1="6.00001" x2="119.296" y2="517.689" gradientUnits="userSpaceOnUse">
        <stop stop-color="#3D3D3D"/>
        <stop offset="1" stop-color="#0A0A0A"/>
      </linearGradient>
      <radialGradient id="paint0_radial_37_1537" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(158.4 162) rotate(47.0826) scale(93.3998)">
        <stop stop-color="white" />
        <stop offset="1" stop-color="#969696" />
      </radialGradient>
      <radialGradient id="earthRadial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${earthTranslateX} ${earthTranslateY}) rotate(43.8563) scale(11.1341)">
        <stop stop-color="white" />
        <stop offset="1" stop-color="#CECECE" />
      </radialGradient>
    </g>`;
};

const filters = (orbRadius: number) => {
  const orbShadowBlur = 8;
  const orbShadowDimension = orbRadius * 2 + orbShadowBlur * 2;
  return `
      <g>
        <filter id="filter0_d_37_1537" x="0" y="0" width="${orbShadowDimension}" height="${orbShadowDimension}" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="4" dy="8" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_37_1537" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_37_1537" result="shape" />
        </filter>
        <filter id="earthFilter" x="0" y="0" width="32" height="32" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="4" dy="8" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_37_1537" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_37_1537" result="shape" />
        </filter>
      </g>
      `;
};

const nameGradient = () => {
  return `
    <linearGradient id="rainbow" x1="0%" x2="100%" y1="50%" y2="50%" gradientUnits="objectBoundingBox" >
      <stop stop-color="#FF7245" offset="0%"/>
      <stop stop-color="#D154A7" offset="20%"/>
      <stop stop-color="#1882FF" offset="100%"/>
    </linearGradient>
    `;
};

const bottomLeftText = (
  followerNumber: number,
  currentSupply: number,
  creatorHandle: string,
) => {
  const denominatorPush = (followerNumber: number) => {
    if (followerNumber < 10) {
      return 0;
    } else if (followerNumber < 100) {
      return 15;
    } else if (followerNumber < 1000) {
      return 34;
    } else if (followerNumber < 10000) {
      return 54;
    } else {
      return 74;
    }
  };
  const denominatorX = 62 + denominatorPush(followerNumber);
  return `
    <text x="15" y="298" class="username" fill="url(#rainbow)">${creatorHandle}</text>
    <text x="15" y="330" class="followerNumber">#${followerNumber}</text>
    <text x="${denominatorX}" y="328" class="denominator" font-family="Inter, sans-serif">/ ${currentSupply}</text>
    <style>
    .username { font: bold 28px Inter, sans-serif; }
    .followerNumber { font: bold 28px Inter, sans-serif; fill: white; }
    .denominator { font: medium 20px; fill: #CCCCCC; }
    </style>
    `;
};

const getEarth = (
  followerNumber: number,
  currentSupply: number,
  orbRadius: number,
) => {
  currentSupply = currentSupply > 0 ? currentSupply : 1;
  followerNumber = followerNumber - 1; //lowest number has min radius
  const minOrbitRadius = orbRadius + 14;
  const maxOrbitRadius = 110;
  const normalizedOrbitRadius =
    (followerNumber / currentSupply) * (maxOrbitRadius - minOrbitRadius) +
    minOrbitRadius;
  const calculateEarthCoordinates = (orbitRadius: number) => {
    const earthAngle = 38;
    const height = orbitRadius * Math.sin(earthAngle * (Math.PI / 180));
    const length = orbitRadius * Math.cos(earthAngle * (Math.PI / 180));
    return {
      centerX: squareCenter + length,
      centerY: squareCenter - height,
    };
  };
  return {
    orbitRadius: normalizedOrbitRadius,
    bodyRadius: 8,
    coordinates: calculateEarthCoordinates(normalizedOrbitRadius),
  };
};
const calculateOrbRadius = (normalizedSize: number) => {
  const orbRadiusMin = 44;
  const orbRadiusMax = 60;
  return orbRadiusMin + (normalizedSize / 100) * (orbRadiusMax - orbRadiusMin);
};

export const base64EncodedSvg = (
  handle: string,
  followerNumber: number,
  currentSupply: number,
  profilePictureUrl: string,
) => {
  const normalizedSize = calculateNormalizedSize(currentSupply);
  const orbRadius = calculateOrbRadius(normalizedSize);
  const earth = getEarth(followerNumber, currentSupply, orbRadius);
  const raw = `
    <svg width="${squareDimension}" height="${squareDimension}" viewBox="0 0 ${squareDimension} ${squareDimension}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="${squareDimension}" height="${squareDimension}" fill="url(#background_gradient)" />
    <image x="16" y="16" width="41" height="41" xlink:href="${profilePictureUrl}" style="clip-path: url(#clipPath); "/>
    <rect x="15" y="15" width="43" height="43" rx="21.5" stroke="#F2F2F2" stroke-opacity="0.25" stroke-width="2"/>
    <defs>
    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
    <use xlink:href="#image0_27_35" transform="scale(0.0025)"/>
    </pattern>
    <clipPath id="clipPath">
      <circle cx="36.5" cy="36.5" r="20.5" />
    </clipPath>
    ${nameGradient()}
    </defs>
    <circle cx="${squareCenter}" cy="${squareCenter}" r="${
    earth.orbitRadius
  }" fill="white" fill-opacity="0.1" stroke="white" stroke-width="1.5" stroke-dasharray="4 4" />
      <g filter="url(#filter0_d_37_1537)">
        <circle cx="${squareCenter}" cy="${squareCenter}" r="${orbRadius}" fill="url(#paint0_radial_37_1537)" />
      </g>
      <g filter="url(#earthFilter)">
      <circle cx="${earth.coordinates.centerX}" cy="${
    earth.coordinates.centerY
  }" r="${earth.bodyRadius}" fill="url(#earthRadial)" />
      </g>
      ${bottomLeftText(followerNumber, currentSupply, handle)}
      ${filters(orbRadius)}
      ${gradients(earth)}
      </svg>
    `;
  const buffer = Buffer.from(raw);
  const base64 = buffer.toString('base64');
  return base64;
};
const calculateNormalizedSize = (currentSupply: number) => {
  if (currentSupply >= 10000) {
    return 100;
  } else {
    return (currentSupply / 10000) * 100;
  }
};
