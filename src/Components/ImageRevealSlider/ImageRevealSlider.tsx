import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './ImageRevealSlider.module.scss';

interface ImageRevealSliderProps {
  settings: ImageRevealSliderSettings;
  content: ImageRevealSliderItem[];
  isEditor?: boolean;
}

type RandomRange = {
  min: number;
  max: number;
}

type ImageRevealSliderImageSize = {
  sizeType: 'as Is' | 'custom' | 'random';
  imageWidth: number;
  randomRangeImageWidth: RandomRange;
}

type ImageRevealSliderCursor = {
  cursorType: 'system' | 'custom';
  defaultCursor: string | null;
  hoverCursor: string | null;
}

type ImageRevealSliderPosition = {
  revealPosition: 'random' | 'same' | 'onClick';
  visible: 'all' | 'lastOne';
  target: 'area' | 'image';
}

type ImageRevealSliderSettings = {
  imageSize: ImageRevealSliderImageSize;
  cursor: ImageRevealSliderCursor;
  position: ImageRevealSliderPosition;
};

type ImageRevealSliderItem = {
  image: {
    url: string;
    name: string;
  };
  imageCaption: any[];
};

interface PlacedImage {
  id: number;
  url: string;
  name: string;
  x: number;
  y: number;
  width?: string;
}

function isMouseOverImage(mouseX: number, mouseY: number, placedImages: PlacedImage[]) {
  for (const img of placedImages) {
    const imgEl = new Image();
    imgEl.src = img.url;

    const imgWidth = img.width ? Number.parseFloat(img.width) : imgEl.naturalWidth;
    const imgHeight = imgEl.naturalHeight / imgEl.naturalWidth * imgWidth;

    const halfW = imgWidth / 2;
    const halfH = imgHeight / 2;

    if (
      mouseX >= img.x - halfW
      && mouseX <= img.x + halfW
      && mouseY >= img.y - halfH
      && mouseY <= img.y + halfH
    ) {
      return true;
    }
  }
  return false;
}

export function ImageRevealSlider({ settings, content, isEditor }: ImageRevealSliderProps) {
  const revealPosition = settings.position.revealPosition;
  const visibleType = settings.position.visible;
  const sizeType = settings.imageSize.sizeType;
  const customWidth = settings.imageSize.imageWidth;
  const randomRange = settings.imageSize.randomRangeImageWidth;
  const clickTarget = settings.position.target;
  const defaultCursorUrl = settings.cursor.defaultCursor;
  const hoverCursorUrl = settings.cursor.hoverCursor;
  const cursorType = settings.cursor.cursorType;

  const [counter, setCounter] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
  const imageIdCounter = useRef(0);

  useEffect(() => {
    if (visibleType === 'lastOne') {
      setPlacedImages(prev =>
        prev.length > 0 ? [prev[prev.length - 1]] : []
      );
    }
  }, [visibleType]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    if (cursorType === 'system') {
      divRef.current.style.cursor = '';
      return;
    }
    const rect = divRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let isHover = false;

    if (clickTarget === 'area') {
      isHover = true;
    } else if (clickTarget === 'image') {
      isHover = isMouseOverImage(mouseX, mouseY, placedImages);
    }

    if (divRef.current) {
      divRef.current.style.cursor = isHover
        ? `url(${hoverCursorUrl}), auto`
        : `url(${defaultCursorUrl}), auto`;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const containerWidth = rect.width;
    const containerHeight = rect.height;

    if (clickTarget === 'image') {
      const hit = isMouseOverImage(clickX, clickY, placedImages);
      if (!hit) return;
    }

    let x: number;
    let y: number;

    if (revealPosition === 'onClick') {
      x = clickX;
      y = clickY;
    } else if (revealPosition === 'same') {
      x = containerWidth / 2;
      y = containerHeight / 2;
    } else {
      x = Math.random() * containerWidth;
      y = Math.random() * containerHeight;
    }

    let finalWidth: string | undefined;
    let imgWidthValue: number | undefined;

    if (sizeType === 'custom') {
      finalWidth = `${customWidth}px`;
      imgWidthValue = customWidth;
    } else if (sizeType === 'random') {
      const rnd = Math.random() * (randomRange.max - randomRange.min) + randomRange.min;
      finalWidth = `${rnd}px`;
      imgWidthValue = rnd;
    }

    const tempImg = new Image();
    tempImg.src = content[counter].image.url;
    tempImg.onload = () => {
      const imgWidth = imgWidthValue ?? tempImg.naturalWidth;
      const imgHeight = imgWidthValue
        ? (tempImg.naturalHeight / tempImg.naturalWidth) * imgWidthValue
        : tempImg.naturalHeight;

      const halfW = imgWidth / 2;
      const halfH = imgHeight / 2;

      const adjustedX = Math.min(Math.max(x, halfW), containerWidth - halfW);

      let adjustedY: number;
      if (imgHeight > containerHeight) {
        adjustedY = containerHeight / 2;
      } else {
        adjustedY = Math.min(Math.max(y, halfH), containerHeight - halfH);
      }

      const newImage: PlacedImage = {
        id: imageIdCounter.current++,
        url: content[counter].image.url,
        name: content[counter].image.name,
        x: adjustedX,
        y: adjustedY,
        width: finalWidth,
      };

      setPlacedImages(prev => {
        if (visibleType === 'all') {
          return [...prev, newImage];
        } else {
          return [newImage];
        }
      });
      setCounter(prev => (prev >= content.length - 1 ? 0 : prev + 1));
    };
  };

  return (
    <div
      ref={divRef}
      onClick={handleClick}
      onMouseEnter={handleMouseMove}
      onMouseMove={handleMouseMove}
      className={styles.imageRevealSlider}
    >
      {placedImages.map(img => (
        <img
          key={img.id}
          src={img.url}
          alt={img.name}
          className={styles.image}
          style={{
            top: `${img.y}px`,
            left: `${img.x}px`,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            width: img.width ?? 'auto',
            height: 'auto',
          }}
        />
      ))}
    </div>
  );
}
