import { useState, useEffect } from 'react';
// @ts-ignore
import styles from './ControlSlider.module.scss';
import { Splide, SplideSlide, SplideProps } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import cn from 'classnames';
import React from 'react';

interface SliderItem {
  image: {
    url: string;
    name?: string;
  };
  imageCaption: {
    text: string;
  };
}

type Offset = {
  x: number;
  y: number;
}

interface SliderControls {
  arrowsImgUrl: string | null;
  isActive: boolean;
  color: string;
  hover: string;
  offset: Offset;
  scale: number;
}

interface SliderPagination {
  position: 'outside-1' | 'outside-2' | 'inside-1' | 'inside-2';
  isActive: boolean;
  scale: number;
  offset: Offset;
  colors: string[];
  hover: string;
}

type Alignment = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface SliderCaption {
  alignment: Alignment;
  isActive: boolean;
  color: string;
  offset: Offset;
  hover: string;
}
interface SliderSettings {
  controls: SliderControls;
  pagination: SliderPagination;
  direction: 'horizontal' | 'vertical';
  caption: SliderCaption;
}

interface CaptionStyles {
  fontSettings: {
    fontFamily: string;
    fontWeight: number;
    fontStyle: string;
  },
  widthSettings: {
    width: number;
    sizing: 'auto' | 'manual';
  };
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  wordSpacing: number;
  fontSizeLineHeight: {
    fontSize: number;
    lineHeight: number;
  };
  textAppearance: {
    textTransform: 'none' | 'uppercase' | 'lowercase';
    textDecoration: 'none' | 'underline';
    fontVariant: 'normal' | 'small-caps';
  };
  color: string;
}

interface SliderStyles {
  caption: CaptionStyles;
}

interface SliderProps {
  settings: SliderSettings;
  content: SliderItem[];
  styles: SliderStyles;
}

type Dimensions = {
  width: number;
  height: number;
}

const alignmentClassName: Record<Alignment, string> = {
  'top-left': styles.topLeftAlignment,
  'top-center': styles.topCenterAlignment,
  'top-right': styles.topRightAlignment,
  'middle-left': styles.middleLeftAlignment,
  'middle-center': styles.middleCenterAlignment,
  'middle-right': styles.middleRightAlignment,
  'bottom-left': styles.bottomLeftAlignment,
  'bottom-center': styles.bottomCenterAlignment,
  'bottom-right': styles.bottomRightAlignment,
};

export function ControlSlider({ settings, content, styles: sliderStyles }: SliderProps) {
  const [sliderRef, setSliderRef] = useState<Splide | null>(null);
  const [sliderDimensions, setSliderDimensions] = useState<Dimensions | undefined>(undefined);
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { direction } = settings;
  const { x: controlsOffsetX, y: controlsOffsetY } = settings.controls.offset;
  const handleArrowClick = (dir: '+1' | '-1') => {
    if (sliderRef) {
      sliderRef.go(dir);
    }
  };
  useEffect(() => {
    if (!wrapperRef) return;
    const observer = new ResizeObserver((entries) => {
      if (!sliderRef) return;
      const [wrapper] = entries;
      setSliderDimensions({
        width: wrapper.contentRect.width,
        height: wrapper.contentRect.height
      });
    });
    observer.observe(wrapperRef);
    return () => observer.unobserve(wrapperRef);
  }, [wrapperRef]);

  return (
    <div className={styles.wrapper} ref={setWrapperRef}>
      {settings.caption.isActive && (
        <div
          className={cn(styles.captionBlock)}
        >
          <div
            className={styles.captionTextWrapper}
          >
            {content.map((item, index) => (
              <span
                key={index}
                data-styles="caption"
                className={cn(styles.captionText, alignmentClassName[settings.caption.alignment])}
                style={{
                  fontFamily: sliderStyles.caption.fontSettings.fontFamily,
                  fontWeight: sliderStyles.caption.fontSettings.fontWeight,
                  fontStyle: sliderStyles.caption.fontSettings.fontStyle,
                  width: sliderStyles.caption.widthSettings.sizing === 'auto' ? 'max-content' : sliderStyles.caption.widthSettings.width,
                  letterSpacing: `${sliderStyles.caption.letterSpacing}px`,
                  wordSpacing: `${sliderStyles.caption.wordSpacing}px`,
                  textAlign: sliderStyles.caption.textAlign,
                  fontSize: `${sliderStyles.caption.fontSizeLineHeight.fontSize}px`,
                  lineHeight: `${sliderStyles.caption.fontSizeLineHeight.lineHeight}px`,
                  textTransform: sliderStyles.caption.textAppearance.textTransform ?? 'none',
                  textDecoration: sliderStyles.caption.textAppearance.textDecoration ?? 'none',
                  fontVariant: sliderStyles.caption.textAppearance.fontVariant ?? 'normal',
                  color: sliderStyles.caption.color,
                  pointerEvents: index === currentSlideIndex ? 'auto' : 'none',
                  opacity: index === currentSlideIndex ? 1 : 0
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    top: settings.caption.offset.y,
                    left: settings.caption.offset.x
                  }}
                >
                  {item.imageCaption.text}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
      <Splide
        onMove={(e) => {
          setCurrentSlideIndex(e.index);
        }}
        ref={setSliderRef}
        options={{
          arrows: false,
          direction: direction === 'horizontal' ? 'ltr' : 'ttb',
          pagination: false,
          perPage: 1,
          width: sliderDimensions ? sliderDimensions?.width : '100%',
          height: sliderDimensions ? sliderDimensions?.height : '100%',
          type: 'loop'
        }}
      >
        {content.map((item, index) => (
          <SplideSlide key={index}>
            <div
              className={styles.sliderItem}
              style={{
                ...sliderDimensions
              }}
            >
              <div
                className={styles.imgWrapper}
              >
                <img className={styles.sliderImage} src={item.image.url} alt={item.image.name ?? ''} />
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
      {settings.controls.isActive && (
        <>
          <button
            className={cn(styles.arrow, {
              [styles.arrowVertical]: settings.direction === 'vertical'
            })}
            onClick={() => {
              handleArrowClick('-1');
            }}
            style={{
              color: settings.controls.color,
              ['--arrow-hover-color' as string]: settings.controls.hover
            }}
          >
            <div
              className={styles.arrowInner}
              style={{
                transform: `translate(${controlsOffsetX}px, ${controlsOffsetY * (direction === 'horizontal' ? 1 : -1)}px) scale(${settings.controls.scale / 100}) rotate(${direction === 'horizontal' ? '180deg' : '-90deg'})`,
              }}
            >
              {settings.controls.arrowsImgUrl && (
                <img src={settings.controls.arrowsImgUrl} alt="arrow" className={styles.arrowImg} />
              )}
              {!settings.controls.arrowsImgUrl && (
                <ArrowIcon color={settings.controls.color} className={cn(styles.arrowIcon)} />
              )}
            </div>
          </button>
          <button
            className={cn(styles.arrow, styles.nextArrow, {
              [styles.arrowVertical]: settings.direction === 'vertical'
            })}
            onClick={() => handleArrowClick('+1')}
            style={{
              color: settings.controls.color,
              ['--arrow-hover-color' as string]: settings.controls.hover
            }}
          >
            <div
              className={styles.arrowInner}
              style={{
                transform: `translate(${controlsOffsetX * (direction === 'horizontal' ? -1 : 1)}px, ${controlsOffsetY}px) scale(${settings.controls.scale / 100}) rotate(${direction === 'horizontal' ? '0deg' : '90deg'})`,
              }}
            >
              {settings.controls.arrowsImgUrl && (
                <img src={settings.controls.arrowsImgUrl} alt="arrow" className={styles.arrowImg} />
              )}
              {!settings.controls.arrowsImgUrl && (
                <ArrowIcon color={settings.controls.color} className={cn(styles.arrowIcon)} />
              )}
            </div>
          </button>
        </>
      )}
      {settings.pagination.isActive && (
        <div
          className={cn(styles.pagination, {
            [styles.paginationInsideBottom]: settings.pagination.position === 'inside-1' && settings.direction === 'horizontal',
            [styles.paginationInsideTop]: settings.pagination.position === 'inside-2' && settings.direction === 'horizontal',
            [styles.paginationOutsideBottom]: settings.pagination.position === 'outside-1' && settings.direction === 'horizontal',
            [styles.paginationOutsideTop]: settings.pagination.position === 'outside-2' && settings.direction === 'horizontal',
            [styles.paginationInsideLeft]: settings.pagination.position === 'inside-1' && settings.direction === 'vertical',
            [styles.paginationInsideRight]: settings.pagination.position === 'inside-2' && settings.direction === 'vertical',
            [styles.paginationOutsideLeft]: settings.pagination.position === 'outside-1' && settings.direction === 'vertical',
            [styles.paginationOutsideRight]: settings.pagination.position === 'outside-2' && settings.direction === 'vertical',
            [styles.paginationVertical]: settings.direction === 'vertical',
          })}
        >
          <div
            className={styles.paginationInner}
            style={{
              backgroundColor: settings.pagination.colors[0],
              transform: `scale(${settings.pagination.scale / 100}) translate(${settings.pagination.offset.x}px, ${settings.pagination.offset.y}px) rotate(${settings.direction === 'horizontal' ? '0deg' : '90deg'})`,
            }}
          >
            {content.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (sliderRef) {
                    sliderRef.go(index);
                  }
                }}
                className={cn(styles.paginationItem)}
              >
                <div
                  className={cn(styles.dot, {
                    [styles.activeDot]: index === currentSlideIndex
                  })}
                  style={{
                    backgroundColor: settings.pagination.colors[1],
                    ['--pagination-hover-color' as string]: settings.pagination.hover
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type ArrowIconProps = {
  color: string;
  className: string;
}

function ArrowIcon({ color, className }: ArrowIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 51" className={className}>
      <path fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(-1 0 0 1 18.6055 1.13037)" d="M17.472713 0L0 23L17.472713 47" fillRule="evenodd" />
    </svg>
  );
}
